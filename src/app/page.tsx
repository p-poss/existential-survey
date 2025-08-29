'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import ContentAreaVideo from "@/components/ContentAreaVideo"
import { surveyQuestions } from '@/data/questions'

// Question Text Component
function QuestionText({ 
  currentQuestion 
}: { 
  currentQuestion: number;
}) {
  const currentQ = surveyQuestions[currentQuestion]
  
  return (
    <h2 className="font-semibold text-black mb-2 flex items-start" style={{ 
      fontSize: '15px', 
      lineHeight: '22px',
      color: '#1D1D1F',
      fontWeight: 600,
      letterSpacing: 0.1,
      minHeight: '44px'
    }}>
      {currentQ.question}
    </h2>
  )
}

// Title Bar Component (modern macOS style)
function TitleBar({ onClose }: { onClose: () => void }) {
  return (
    <div className="title-bar">
      <div className="title-bar-text">&quot;...Contemplate Before We Die&quot;</div>
      <div className="title-bar-controls">
        <button aria-label="Close" onClick={onClose} />
      </div>
    </div>
  )
}

// Interactive Elements Component
function InteractiveElements({ 
  currentQuestion, 
  formData,
  onInputChange,
  onRadioClick,
  onWriteInFocus,
}: { 
  currentQuestion: number;
  formData: FormData;
  onInputChange: (value: string, option?: string) => void;
  onRadioClick: () => void;
  onWriteInFocus: () => void;
}) {
  const currentQ = surveyQuestions[currentQuestion]
  const fieldName = `q${currentQ.id}`
  const optionFieldName = `${fieldName}_option`

  const handleWriteInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const writeInText = e.target.value
    onInputChange('Something else (write in)', writeInText)
  }

  return (
    <div>
      {currentQ.type === 'text' ? (
        currentQ.id === 9 ? (
          <div className="field-row" style={{ alignItems: 'center', gap: 8 }}>
            <input
              type="range"
              min={18}
              max={118}
              step={1}
              value={Number(formData[fieldName] ?? 68)}
              onChange={(e) => onInputChange(e.target.value)}
              aria-label="Select a value from 18 to 118"
              style={{ flex: 1 }}
            />
            <span style={{ minWidth: 32, textAlign: 'right' }}>{formData[fieldName] ?? '68'}</span>
          </div>
        ) : (
          <div className="field-row">
            <input
              type="text"
              value={formData[fieldName] || ''}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Type here..."
              onFocus={onWriteInFocus}
              autoComplete="off"
              style={{ width: '100%' }}
            />
          </div>
        )
      ) : (
        <div>
          {currentQ.options?.map((option) => {
            const optionId = `${fieldName}_${option.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}`
            return (
              <div className="field-row" key={option} onPointerDown={onRadioClick}>
                <input
                  id={optionId}
                  type="radio"
                  name={fieldName}
                  value={option}
                  checked={formData[fieldName] === option}
                  onChange={(e) => onInputChange(e.target.value)}
                />
                <label htmlFor={optionId}>{option}</label>
              </div>
            )
          })}

          {formData[fieldName] === 'Something else (write in)' && (
            <div className="field-row" style={{ marginTop: 8 }}>
              <input
                type="text"
                value={formData[optionFieldName] || ''}
                onChange={handleWriteInChange}
                placeholder="Please specify..."
                onFocus={onWriteInFocus}
                autoComplete="off"
                style={{ width: '100%' }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface FormData {
  [key: string]: string;
}

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [formData, setFormData] = useState<FormData>({})
  const [startTime] = useState(Date.now())
  const [isWindowOpen, setIsWindowOpen] = useState(false)
  const [isIconSelected, setIsIconSelected] = useState(false)
  const [isCelebrating, setIsCelebrating] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [showAboutMenu, setShowAboutMenu] = useState(false)
  const [clock, setClock] = useState<string>('')
  const [loginAge, setLoginAge] = useState<string>('')
  const [loginLocation, setLoginLocation] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [isEmailing, setIsEmailing] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const iconRef = useRef<HTMLDivElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const musicRef = useRef<{
    intervalId?: number
    strobeId?: number
    gain?: GainNode
    filter?: BiquadFilterNode
    pan?: StereoPannerNode
    oscs?: OscillatorNode[]
  } | null>(null)

  const ensureCtx = (): AudioContext | null => {
    try {
      if (!audioCtxRef.current) {
        const G = globalThis as unknown as {
          AudioContext?: typeof AudioContext
          webkitAudioContext?: typeof AudioContext
        }
        const AC = G.AudioContext ?? G.webkitAudioContext
        if (!AC) return null
        audioCtxRef.current = new AC()
      }
      const ctx = audioCtxRef.current
      if (!ctx) return null
      if (ctx.state === 'suspended') void ctx.resume()
      return ctx
    } catch {
      return null
    }
  }

  const blip = (
    ctx: AudioContext,
    startOffset: number,
    freq: number,
    duration: number,
    peakGain: number,
    hpFreq = 800
  ) => {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = hpFreq
    osc.type = 'square'
    osc.frequency.setValueAtTime(freq, now + startOffset)
    gain.gain.setValueAtTime(0.0001, now + startOffset)
    gain.gain.exponentialRampToValueAtTime(peakGain, now + startOffset + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + duration)
    osc.connect(gain).connect(hp).connect(ctx.destination)
    osc.start(now + startOffset)
    osc.stop(now + startOffset + duration + 0.005)
  }

  // Taskbar clock updater
  useEffect(() => {
    const update = () => {
      const timeString = new Date().toLocaleTimeString([], { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
      // Force AM/PM to uppercase for consistent display across all devices
      setClock(timeString.replace(/\s?(am|pm)/i, (match) => ` ${match.toUpperCase()}`))
    }
    update()
    const id = window.setInterval(update, 30_000)
    return () => window.clearInterval(id)
  }, [])

  const playClick = () => {
    const ctx = ensureCtx()
    if (!ctx) return
    blip(ctx, 0.0, 1600, 0.045, 0.18)
    blip(ctx, 0.012, 2300, 0.05, 0.14)
  }

  const playNavClick = () => {
    const ctx = ensureCtx()
    if (!ctx) return
    blip(ctx, 0.0, 1100, 0.05, 0.16)
    blip(ctx, 0.012, 1600, 0.05, 0.12)
  }

  const playSubmitClick = () => {
    const ctx = ensureCtx()
    if (!ctx) return
    blip(ctx, 0.0, 900, 0.07, 0.2, 500)
    blip(ctx, 0.018, 1400, 0.08, 0.16, 600)
  }

  const playRadioClick = () => {
    const ctx = ensureCtx()
    if (!ctx) return
    // Slightly higher, shorter, crisp tick
    blip(ctx, 0.0, 1800, 0.035, 0.14)
    blip(ctx, 0.010, 2400, 0.035, 0.10)
  }

  const playInputFocus = () => {
    const ctx = ensureCtx()
    if (!ctx) return
    // Softer, lower UI blip for entering write-in field
    blip(ctx, 0.0, 700, 0.06, 0.12, 400)
    blip(ctx, 0.015, 1100, 0.06, 0.10, 500)
  }

  const playOpenSwoosh = () => {
    const ctx = ensureCtx()
    if (!ctx) return
    const duration = 0.35
    const now = ctx.currentTime
    // White noise buffer
    const length = Math.max(1, Math.floor(ctx.sampleRate * duration))
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1

    const src = ctx.createBufferSource()
    src.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(900, now)
    filter.frequency.linearRampToValueAtTime(7000, now + duration)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    src.connect(filter).connect(gain).connect(ctx.destination)
    src.start(now)
    src.stop(now + duration + 0.02)
  }

  const playCloseSwoosh = () => {
    const ctx = ensureCtx()
    if (!ctx) return
    const duration = 0.28
    const now = ctx.currentTime
    const length = Math.max(1, Math.floor(ctx.sampleRate * duration))
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1

    const src = ctx.createBufferSource()
    src.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    // Start bright then sweep darker for a closing feel
    filter.frequency.setValueAtTime(8000, now)
    filter.frequency.linearRampToValueAtTime(900, now + duration)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.035)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    src.connect(filter).connect(gain).connect(ctx.destination)
    src.start(now)
    src.stop(now + duration + 0.02)
  }

  const stopCelebrationMusic = () => {
    const current = musicRef.current
    if (!current) return
    if (current.intervalId) {
      window.clearInterval(current.intervalId)
    }
    if (current.strobeId) {
      window.clearInterval(current.strobeId)
    }
    current.oscs?.forEach(osc => {
      try { osc.stop(); } catch {}
      try { osc.disconnect(); } catch {}
    })
    try { current.filter?.disconnect(); } catch {}
    try { current.gain?.disconnect(); } catch {}
    try { current.pan?.disconnect(); } catch {}
    // Restore background color to default teal
    try {
      const bg = document.getElementById('bg-root') as HTMLElement | null
      if (bg) bg.style.backgroundColor = '#008080'
      document.body.style.backgroundColor = '#008080'
    } catch {}
    musicRef.current = null
  }

  const startCelebrationMusic = () => {
    const ctx = ensureCtx()
    // Always reset any existing state
    stopCelebrationMusic()

    let intervalId: number | undefined
    let gain: GainNode | undefined
    let filter: BiquadFilterNode | undefined
    let pan: StereoPannerNode | undefined
    let osc1: OscillatorNode | undefined
    let osc2: OscillatorNode | undefined

    // If audio context is available, start simple chip-tune loop
    if (ctx) {
      gain = ctx.createGain()
      gain.gain.value = 0.06

      filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 1800

      pan = ctx.createStereoPanner()
      pan.pan.value = 0

      const notesHz = [220, 262, 294, 330, 392, 440]
      const pattern = [0, 2, 1, 3, 4, 2, 5, 3]
      let step = 0

      osc1 = ctx.createOscillator()
      osc2 = ctx.createOscillator()
      osc1.type = 'square'
      osc2.type = 'square'
      osc1.detune.value = -6
      osc2.detune.value = +6

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(gain).connect(pan).connect(ctx.destination)

      const setFrequencies = () => {
        const base = notesHz[pattern[step % pattern.length]]
        osc1!.frequency.setTargetAtTime(base, ctx.currentTime, 0.01)
        osc2!.frequency.setTargetAtTime(base * 2, ctx.currentTime, 0.01)
        const p = Math.sin(step / 4) * 0.4
        pan!.pan.setTargetAtTime(p, ctx.currentTime, 0.05)
        step += 1
      }

      setFrequencies()
      osc1.start()
      osc2.start()
      intervalId = window.setInterval(setFrequencies, 260)
    }

    // Background color strobe (navy <-> teal) always runs, even if audio is blocked
    const bg = document.getElementById('bg-root') as HTMLElement | null
    if (bg) bg.style.backgroundColor = '#000080'
    document.body.style.backgroundColor = '#000080'
    let isNavy = true
    const strobeId = window.setInterval(() => {
      const el = document.getElementById('bg-root') as HTMLElement | null
      if (!el) return
      isNavy = !isNavy
      const color = isNavy ? '#000080' : '#008080'
      el.style.backgroundColor = color
      document.body.style.backgroundColor = color
    }, 400)
    musicRef.current = { intervalId, strobeId, gain, filter, pan, oscs: osc1 && osc2 ? [osc1, osc2] : [] }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isWindowOpen) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        if (currentQuestion > 0) {
          setCurrentQuestion(currentQuestion - 1)
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        if (currentQuestion < 12) {
          setCurrentQuestion(currentQuestion + 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentQuestion, isWindowOpen])

  // Stop music if window closes or completion view exits
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isWindowOpen || !isComplete) {
      if (isCelebrating) setIsCelebrating(false)
      stopCelebrationMusic()
    }
  }, [isWindowOpen, isComplete])

  // Deselect icon when clicking outside the icon area
  useEffect(() => {
    const handleDocumentMouseDown = (event: MouseEvent) => {
      if (!iconRef.current) return
      if (!iconRef.current.contains(event.target as Node)) {
        setIsIconSelected(false)
      }
    }
    document.addEventListener('mousedown', handleDocumentMouseDown)
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown)
  }, [])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const completionTime = Math.round((Date.now() - startTime) / 1000)

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          completion_time: completionTime,
          login_age: loginAge ? Number(loginAge) : null,
          login_location: loginLocation || null
        }),
      })

      if (response.ok) {
        setIsComplete(true)
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      console.error('Error submitting survey:', error)
      alert('There was an error submitting your survey. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendEmail = async () => {
    if (!email.trim()) {
      alert('Please enter your email address')
      return
    }

    setIsEmailing(true)
    setEmailStatus('sending')

    // Add a small delay before sending for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          formData: {
            ...formData,
            completion_time: Math.round((Date.now() - startTime) / 1000),
            login_age: loginAge ? Number(loginAge) : null,
            login_location: loginLocation || null
          }
        }),
      })

      if (response.ok) {
        setEmailStatus('success')
        // Reset to idle after 3 seconds
        setTimeout(() => setEmailStatus('idle'), 3000)
      } else {
        throw new Error('Email failed to send')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      setEmailStatus('error')
    } finally {
      setIsEmailing(false)
    }
  }

  const handleLoginOk = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setShowLogin(false)
  }

  // When complete, keep rendering the same window structure

  return (
    <main className="h-[100dvh] w-full">
      <div className="relative w-full h-full">
        {/* Login window shown on page load */}
        {showLogin && (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            width: 420,
            maxWidth: 'calc(100vw - 40px)'
          }}>
            <div className="window" role="dialog" aria-modal="true" aria-label="Welcome to Windows">
              <div className="title-bar">
                <div className="title-bar-text">Welcome to &quot;13 Questions To Contemplate...&quot;</div>
                <div className="title-bar-controls">
                  <button aria-label="Close" onClick={() => { playCloseSwoosh(); setShowLogin(false); }} />
                </div>
              </div>
              <form className="window-body" onSubmit={handleLoginOk} style={{ paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 48, display: 'flex', justifyContent: 'center', marginLeft: 8, marginRight: 8 }}>
                    <Image src="/keys.png" alt="" width={48} height={48} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginTop: 0, marginBottom: 8 }}>
                      <p style={{ margin: 0 }}>Type your general location and age for the survey.</p>
                      <button type="submit" className="default" onPointerDown={playSubmitClick}>OK</button>
                    </div>
                    <div className="field-row" style={{ alignItems: 'center', gap: 8 }}>
                      <label htmlFor="login-location" style={{ minWidth: 80 }}><u>L</u>ocation:</label>
                      <input id="login-location" type="text" value={loginLocation} onChange={(e) => setLoginLocation(e.target.value)} onFocus={playInputFocus} />
                    </div>
                    <div className="field-row" style={{ alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <label htmlFor="login-pass" style={{ minWidth: 80 }}><u>A</u>ge:</label>
                      <input id="login-pass" type="password" value={loginAge} onChange={(e) => setLoginAge(e.target.value)} onFocus={playInputFocus} />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Desktop icon always present and centered */}
        <div
          ref={iconRef}
          role="button"
          tabIndex={0}
          aria-label="Open Anonymous Survey"
          data-selected={isIconSelected}
          onPointerDown={playClick}
          onClick={() => setIsIconSelected(true)}
          onDoubleClick={() => { setIsIconSelected(false); playOpenSwoosh(); setIsWindowOpen(true) }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { playClick(); playOpenSwoosh(); setIsIconSelected(false); setIsWindowOpen(true) } }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'default',
            userSelect: 'none',
            pointerEvents: isWindowOpen ? 'none' : 'auto',
            zIndex: 1
          }}
        >
          <div style={{
            width: 64,
            height: 64,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 2,
            transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }}>
            <Image src="/file-6.png" alt="Anonymous Survey file icon" width={48} height={48} priority />
          </div>
          <div style={{
            marginTop: 3,
            padding: '2px 8px',
            fontSize: 12,
            lineHeight: '16px',
            color: '#FFFFFF',
            fontWeight: 400,
            textShadow: 'none',
            textAlign: 'center',
            backgroundColor: isIconSelected ? '#000A71' : 'transparent',
            border: 'none',
            borderRadius: 0,
            // Custom 1px dash / 1px gap white border using layered repeating gradients
            backgroundImage: isIconSelected 
              ? [
                  'repeating-linear-gradient(90deg, #FFFE54 0 1px, transparent 1px 2px)', // top
                  'repeating-linear-gradient(180deg, #FFFE54 0 1px, transparent 1px 2px)', // right
                  'repeating-linear-gradient(90deg, #FFFE54 0 1px, transparent 1px 2px)', // bottom
                  'repeating-linear-gradient(180deg, #FFFE54 0 1px, transparent 1px 2px)'  // left
                ].join(', ')
              : 'none',
            // Avoid mixing shorthand background with clip/origin to prevent React warnings
            backgroundPosition: '0 0, 100% 0, 0 100%, 0 0',
            backgroundSize: '100% 1px, 1px 100%, 100% 1px, 1px 100%',
            backgroundRepeat: 'repeat-x, repeat-y, repeat-x, repeat-y',
            // No border/outline around label highlight; background only
            boxShadow: 'none'
          }}>
            <div>13 Questions To</div>
            <div>Contemplate Before We Die</div>
          </div>
        </div>

        {/* Window when open, absolutely centered above icon */}
        <AnimatePresence>
          {isWindowOpen && (
              <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'calc(100vw - 56px)',
              maxWidth: 800,
              height: 800,
                // Reserve extra space at the bottom so the window never hugs the taskbar
                maxHeight: 'calc(100dvh - 56px - 24px)',
              minHeight: 0,
              zIndex: 2
            }}>
              <motion.div
                className="window"
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <TitleBar onClose={() => { playCloseSwoosh(); setIsWindowOpen(false) }} />
                <div className="window-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto' }}>
          {/* Content container */}
          <div className="w-full flex flex-col flex-1 relative">
                {isCelebrating && (
              <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                <Image src="/party.gif" alt="" width={800} height={800} className="max-w-[70%] max-h-[70%] opacity-90" />
              </div>
            )}
            {/* Chunk 1: Video area with number and noise (hidden on completion) */}
            {isComplete ? (
                  <div className="h-[200px]" />
            ) : (
                  <div className="h-[200px] relative z-20" style={{ background: '#c0c0c0', padding: 6 }}>
                <div className="sunken-panel w-full h-full relative overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <ContentAreaVideo questionNumber={currentQuestion + 1} />
                  </div>
                  <div className="absolute top-2 left-2 z-10">
                    <div className="badge98">
                      <div className="badge98-inner">
                        <div className="badge98-seg" style={{ width: 38, textAlign: 'center' }}>
                          {(currentQuestion + 1).toString().padStart(2, '0')}
                        </div>
                        <div className="badge98-divider" />
                        <div className="badge98-seg" style={{ width: 38, textAlign: 'center' }}>
                          13
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Chunk 2: Question text or completion */}
                <div className="pt-3 px-3">
              {isComplete ? (
                <div>
                  <h2
                    className="text-center mb-4"
                    style={{
                      fontSize: '15px',
                      lineHeight: '22px',
                      minHeight: '44px',
                      fontWeight: 600
                    }}
                  >
                    Responses submitted anonymously.
                  </h2>
                  
                  {/* Explanatory text */}
                  <p style={{ margin: 0, marginBottom: 16, textAlign: 'center' }}>
                    For a copy of your answers, please provide your email and press the right button.
                  </p>
                  
                  {/* Email input section */}
                  <div className="mb-4">
                    <div className="field-row" style={{ alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <label htmlFor="email-input" style={{ minWidth: 80 }}><u>E</u>mail:</label>
                      <input
                        id="email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        onFocus={playInputFocus}
                        style={{ width: '100%' }}
                        disabled={isEmailing}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <QuestionText currentQuestion={currentQuestion} />
              )}
            </div>
            
            {/* Chunk 3: Interactive elements (hidden when complete) */}
            {!isComplete && (
                  <div className="pt-2 pb-3 px-3 flex-1 flex flex-col min-h-0 relative">
                {/* Celebration overlay GIF */}
                {isCelebrating && (
                  <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                    <Image src="/party.gif" alt="" width={800} height={800} className="max-w-[70%] max-h-[70%] opacity-90" />
                  </div>
                )}
                <InteractiveElements 
                  currentQuestion={currentQuestion}
                  formData={formData}
                  onInputChange={(value, option) => {
                    const fieldName = `q${surveyQuestions[currentQuestion].id}`
                    const optionFieldName = `${fieldName}_option`
                    setFormData(prev => ({
                      ...prev,
                      [fieldName]: value,
                      [optionFieldName]: option || ''
                    }))
                  }}
                  onRadioClick={playRadioClick}
                  onWriteInFocus={playInputFocus}
                />
              </div>
            )}
          </div>
        </div>

        {/* Chunk 4: Footer area; actions */}
        <div className="window-body" style={{ padding: 12 }}>
          {isComplete ? (
            <div className="w-full flex gap-3">
              <button
                type="button"
                className="default"
                onPointerDown={playSubmitClick}
                onClick={() => {
                  // Ensure audio context resumes after a direct user gesture
                  try { ensureCtx()?.resume(); } catch {}
                  setIsCelebrating(prev => {
                    const next = !prev
                    if (next) startCelebrationMusic(); else stopCelebrationMusic()
                    return next
                  })
                }}
              >
                {isCelebrating ? 'Stop The Party' : 'Let\u2019s Celebrate'}
              </button>
              
              <button
                type="button"
                className="default"
                onPointerDown={playSubmitClick}
                onClick={handleSendEmail}
                disabled={isEmailing || (!email.trim() && emailStatus !== 'error')}
              >
                {emailStatus === 'sending' ? 'Sending...' : 
                 emailStatus === 'success' ? 'Email Success' : 
                 emailStatus === 'error' ? 'Retry Email' : 
                 'Email Answers'}
              </button>
            </div>
          ) : (
          <div className="w-full flex gap-3">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              onPointerDown={playNavClick}
              aria-label="Previous question"
            >
              Prev
            </button>

            {currentQuestion === 12 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                onPointerDown={playSubmitClick}
                className="default"
              >
                {isSubmitting ? 'Submitting…' : 'Submit'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(12, currentQuestion + 1))}
                onPointerDown={playNavClick}
                aria-label="Next question"
                className="default"
              >
                Next
              </button>
            )}
          </div>
          )}
        </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* About Menu */}
      {showAboutMenu && (
        <div
          style={{
            position: 'fixed',
            left: 8,
            bottom: 32, // Position above the taskbar (taskbar height is 32px)
            zIndex: 6,
            minWidth: 200
          }}
        >
          <div className="window" style={{ display: 'flex' }}>
            {/* Vertical title bar */}
            <div 
              style={{
                width: 24,
                background: 'linear-gradient(to top, #0080FF 0%, #0000FF 50%, #000080 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                padding: '8px 0',
                borderRight: '1px solid #808080'
              }}
            >
              <div style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', marginBottom: '15px' }}>
                ABOUT
              </div>
            </div>
            
            {/* Content area */}
            <div style={{ flex: 1, padding: '12px' }}>
              <div style={{ padding: '8px 0' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px' }}>
                  <strong>13 Questions To Contemplate Before We Die</strong>
                </p>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', lineHeight: '14px' }}>
                  A design research experiment exploring anonymous existential thoughts.
                </p>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', lineHeight: '14px' }}>
                  Built with Next.js, 98.css, and Framer Motion.
                </p>
                <p style={{ margin: 0, fontSize: '11px', lineHeight: '14px', color: '#666' }}>
                  Version 0.1.0
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom taskbar: Finish button (left) and inset clock (right) */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: 32,
          background: '#c0c0c0',
          display: 'flex',
          alignItems: 'center',
          padding: '2px',
          zIndex: 5,
          borderTop: '1px solid #DFDFDF',
          borderLeft: '1px solid #DFDFDF',
          borderRight: '1px solid #000000',
          borderBottom: '1px solid #000000',
          boxShadow: 'inset 0 1px 0 #FFFFFF, inset 0 -1px 0 #808080, inset 1px 0 0 #FFFFFF, inset -1px 0 0 #808080'
        }}
      >
        <button
          type="button"
          className="default"
          onPointerDown={playSubmitClick}
          onClick={() => setShowAboutMenu(!showAboutMenu)}
          style={{
            minWidth: 80,
            margin: 0,
            paddingLeft: 8,
            paddingRight: 8,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 2, height: '100%' }}>
            <Image src="/info.png" alt="" width={14} height={14} />
            <span style={{ fontWeight: 700 }}>About</span>
          </span>
        </button>
        <div style={{ flex: 1 }} />
        <div className="status-bar" aria-hidden style={{ margin: 0 }}>
          <p className="status-bar-field" style={{ padding: '2px 4px', textAlign: 'center', margin: 0, color: '#000' }}>{clock}</p>
        </div>
      </div>
    </main>
  )
}
