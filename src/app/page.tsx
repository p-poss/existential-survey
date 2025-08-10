'use client'

import { useState, useEffect, useRef } from 'react'
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
    <h2 className="font-semibold text-black mb-4 flex items-start" style={{ 
      fontSize: '15px', 
      lineHeight: '22px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
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
    <div className="flex items-center" style={{
      height: 36,
      paddingLeft: 12,
      paddingRight: 12,
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12
    }}>
      {/* Close control */}
      <div className="flex items-center">
        <button aria-label="Close window" onClick={onClose} style={{
          width: 12, height: 12, borderRadius: 9999, background: '#FF5F57', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
          display: 'inline-block'
        }} />
      </div>
      {/* Center title */}
      <div className="flex-1 flex justify-center">
        <div style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          fontSize: 12,
          lineHeight: '16px',
          fontWeight: 600,
          color: '#3A3A3C',
          letterSpacing: 0.2
        }}>Anonymous Survey</div>
      </div>
      {/* Right side spacer */}
      <div style={{width: 60}} />
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
        <textarea
          value={formData[fieldName] || ''}
          onChange={(e) => onInputChange(e.target.value)}
          className="w-full border-0 rounded-lg focus:ring-0 focus:outline-none focus:border-0 resize-none mac-input"
          style={{ 
            outline: 'none',
            color: '#1D1D1F',
            fontSize: '15px',
            lineHeight: '22px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: '10px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.04)',
            transition: 'all 0.2s ease'
          }}
          onFocus={onWriteInFocus}
          rows={5}
          placeholder="Type here..."
        />
      ) : (
        <div className="space-y-3">
          {currentQ.options?.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer" onPointerDown={onRadioClick}>
              <div className="relative" style={{width: 16, height: 16}}>
                <div 
                  className="rounded-full"
                  style={{ 
                    width: 16,
                    height: 16,
                    border: '1px solid rgba(0,0,0,0.12)',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease'
                  }}
                />
                {formData[fieldName] === option && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="rounded-full" style={{ width: 8, height: 8, background: '#007AFF' }} />
                  </div>
                )}
                <input
                  type="radio"
                  name={fieldName}
                  value={option}
                  checked={formData[fieldName] === option}
                  onChange={(e) => onInputChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-black" style={{ 
                fontSize: '16px', 
                lineHeight: '21px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                fontWeight: '400',
                color: '#1D1D1F'
              }}>{option}</span>
            </label>
          ))}
      
                {/* Custom input for "Something else (write in)" option */}
              <div className="relative h-12">
      {formData[fieldName] === 'Something else (write in)' && (
        <div className="absolute top-3 inset-x-0">
          <input
              type="text"
              value={formData[optionFieldName] || ''}
              onChange={handleWriteInChange}
              placeholder="Please specify..."
              className="w-full border-0 rounded-lg focus:ring-0 focus:outline-none focus:border-0 mac-input"
              style={{ 
                outline: 'none',
                color: '#1D1D1F',
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: '10px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
              onFocus={onWriteInFocus}
              autoComplete="off"
            />
          </div>
        )}
      </div>
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
  const iconRef = useRef<HTMLDivElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

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
        if (currentQuestion < 9) {
          setCurrentQuestion(currentQuestion + 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentQuestion, isWindowOpen])

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
          completion_time: completionTime
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

  if (isComplete) {
    return (
      <main className="h-[100dvh] w-full flex items-center justify-center" style={{
        background: 'linear-gradient(180deg, #F5F5F7 0%, #E8E8ED 100%)'
      }}>
        <div className="w-[calc(100vw-56px)] max-w-[800px] h-[800px] max-h-[calc(100dvh-56px)] min-h-0 flex flex-col mx-auto shadow-2xl" style={{
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)',
          overflow: 'hidden'
        }}>
          <TitleBar onClose={() => setIsWindowOpen(false)} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="font-semibold text-black" style={{ fontSize: '16px', lineHeight: '21px' }}>
                Responses submitted anonymously.
              </h2>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="h-[100dvh] w-full">
      <div className="relative w-full h-full">
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
            width: 80,
            height: 80,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 2,
            transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
            backgroundColor: isIconSelected ? 'rgba(0,0,0,0.20)' : 'transparent',
            // Single outline ring only when selected (no inner stroke)
            boxShadow: isIconSelected ? '0 0 0 2px rgba(60,60,67,0.32)' : 'none',
          }}>
            <img src="/file.png" alt="Anonymous Survey file icon" width={72} height={72} />
          </div>
          <div style={{
            marginTop: 3,
            padding: '2px 8px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            fontSize: 12,
            lineHeight: '16px',
            color: isIconSelected ? '#FFFFFF' : '#FFFFFF',
            fontWeight: 600,
            textShadow: isIconSelected ? 'none' : '0 1px 2px rgba(0,0,0,0.6)',
            textAlign: 'center',
            background: isIconSelected ? 'rgba(60,60,67,0.48)' : 'transparent',
            borderRadius: 2,
            // No border/outline around label highlight; background only
            boxShadow: 'none'
          }}>
            <div>13 Questions To</div>
            <div>Contem...re We Die</div>
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
              maxHeight: 'calc(100dvh - 56px)',
              minHeight: 0,
              zIndex: 2
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
                transition={{
                  default: { type: 'spring', stiffness: 380, damping: 28, mass: 0.9 },
                  opacity: { duration: 0.18, ease: 'easeOut' },
                  filter: { duration: 0.22, ease: 'easeOut' }
                }}
                className="flex flex-col shadow-2xl"
                style={{
                  width: '100%',
                  height: '100%',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)',
                  overflow: 'hidden',
                  transformOrigin: 'center center'
                }}
              >
                <TitleBar onClose={() => { playCloseSwoosh(); setIsWindowOpen(false) }} />
                <div className="flex-1 flex flex-col min-h-0 overflow-y-auto" style={{
                  background: 'rgba(255,255,255,0.95)'
                }}>
          {/* Content container */}
          <div className="w-full flex flex-col flex-1">
            {/* Chunk 1: Video area with number and noise */}
            <div className="h-[200px] relative z-20" style={{
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              background: 'rgba(248,248,248,0.8)'
            }}>
              <div className="absolute inset-0 overflow-hidden">
                <ContentAreaVideo questionNumber={currentQuestion + 1} />
              </div>
              
              <div className="absolute top-3 left-3 z-10">
                <div className="mac-pill">
                  <span className="num">{(currentQuestion + 1).toString().padStart(2, '0')}</span>
                  <span className="divider" />
                  <span className="total">10</span>
                </div>
              </div>
              

            </div>
            
            {/* Chunk 2: Question text */}
            <div className="pt-3 px-3" style={{
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              backgroundColor: 'rgba(255,255,255,0.95)'
            }}>
              <QuestionText currentQuestion={currentQuestion} />
            </div>
            
            {/* Chunk 3: Interactive elements */}
            <div className="pt-3 px-3 mb-3" style={{
              backgroundColor: 'rgba(255,255,255,0.95)'
            }}>
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
          </div>
        </div>

        {/* Chunk 4: Navigation buttons at bottom */}
        <div className="mt-auto" style={{
          background: 'rgba(255,255,255,0.95)',
          padding: '12px',
          borderTop: '1px solid rgba(0,0,0,0.06)'
        }}>
          <div className="w-full flex gap-3">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="flex items-center justify-center space-x-2 flex-1 px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              onPointerDown={playNavClick}
              style={{ 
                backgroundColor: currentQuestion === 0 ? 'rgba(245, 245, 247, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '8px',
                color: currentQuestion === 0 ? 'rgba(0, 0, 0, 0.4)' : '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                fontWeight: '500',
                fontSize: '16px',
                lineHeight: '21px',
                boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease'
              }}
                              onMouseEnter={(e) => {
                  if (currentQuestion > 0) {
                    e.currentTarget.style.backgroundColor = 'rgba(248, 248, 248, 0.95)'
                    e.currentTarget.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.08)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentQuestion === 0 ? 'rgba(245, 245, 247, 0.8)' : 'rgba(255, 255, 255, 0.95)'
                  e.currentTarget.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.04)'
                }}
            >
              <span aria-hidden>←</span>
            </button>

            {currentQuestion === 9 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center justify-center space-x-2 flex-1 px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                onPointerDown={playSubmitClick}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '8px',
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                  fontWeight: '500',
                  fontSize: '16px',
                  lineHeight: '21px',
                  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(248, 248, 248, 0.95)'
                  e.currentTarget.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'
                  e.currentTarget.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.04)'
                }}
              >
                <span>{isSubmitting ? 'Submitting…' : 'Submit'}</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(9, currentQuestion + 1))}
                className="flex items-center justify-center space-x-2 flex-1 px-6 py-2 cursor-pointer"
                onPointerDown={playNavClick}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '8px',
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                  fontWeight: '500',
                  fontSize: '16px',
                  lineHeight: '21px',
                  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(248, 248, 248, 0.95)'
                  e.currentTarget.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'
                  e.currentTarget.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.04)'
                }}
              >
                <span aria-hidden>→</span>
              </button>
            )}
        </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
