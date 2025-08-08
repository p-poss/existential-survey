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
    <h2 className="font-semibold text-black mb-4 flex items-start min-h-[28px]" style={{ 
      fontSize: '20px', 
      lineHeight: '28px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
      color: '#1D1D1F',
      fontWeight: 600,
      letterSpacing: 0.1
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
      {/* Traffic lights */}
      <div className="flex items-center gap-2">
        <button aria-label="Close window" onClick={onClose} style={{
          width: 12, height: 12, borderRadius: 9999, background: '#FF5F57', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
          display: 'inline-block'
        }} />
        <span aria-disabled="true" title="Minimize disabled" style={{width: 12, height: 12, borderRadius: 9999, background: '#FEBC2E', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)', opacity: 0.4, pointerEvents: 'none'}} />
        <span aria-disabled="true" title="Zoom disabled" style={{width: 12, height: 12, borderRadius: 9999, background: '#28C840', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)', opacity: 0.4, pointerEvents: 'none'}} />
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
  onInputChange
}: { 
  currentQuestion: number;
  formData: FormData;
  onInputChange: (value: string, option?: string) => void;
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
          rows={5}
          placeholder="Type here..."
        />
      ) : (
        <div className="space-y-3">
          {currentQ.options?.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer">
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
  const iconRef = useRef<HTMLDivElement | null>(null)

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
        <div className="w-[calc(100vw-32px)] max-w-[800px] h-[800px] max-h-[calc(100dvh-32px)] min-h-0 flex flex-col mx-auto shadow-2xl" style={{
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
    <main className="h-[100dvh] w-full flex items-center justify-center" style={{
      background: 'linear-gradient(180deg, #F5F5F7 0%, #E8E8ED 100%)'
    }}>
      {/* Desktop icon when window is closed */}
      {!isWindowOpen && (
        <div
          ref={iconRef}
          role="button"
          tabIndex={0}
          aria-label="Open Anonymous Survey"
          onDoubleClick={() => setIsWindowOpen(true)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setIsWindowOpen(true) } }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'default',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: 96,
            height: 96,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 12,
            transition: 'transform 0.15s ease',
          }}>
            <img src="/file.svg" alt="Anonymous Survey file icon" width={72} height={72} />
          </div>
          <div style={{
            marginTop: 8,
            padding: '2px 8px',
            borderRadius: 6,
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(0,0,0,0.06)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            fontSize: 12,
            lineHeight: '16px',
            color: '#1D1D1F',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.04)'
          }}>Anonymous Survey</div>
        </div>
      )}

      {/* Window when open */}
      <AnimatePresence>
        {isWindowOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-[calc(100vw-32px)] max-w-[800px] h-[800px] max-h-[calc(100dvh-32px)] min-h-0 flex flex-col mx-auto shadow-2xl"
            style={{
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)',
              overflow: 'hidden'
            }}
          >
            <TitleBar onClose={() => setIsWindowOpen(false)} />
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto" style={{
              background: 'rgba(255,255,255,0.95)'
            }}>
          {/* Content container */}
          <div className="w-full flex flex-col flex-1">
            {/* Chunk 1: Video area with number and noise */}
            <div className="h-[300px] relative z-20" style={{
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
              />
            </div>
          </div>
        </div>

        {/* Chunk 4: Navigation buttons at bottom */}
        <div className="mt-auto" style={{
          background: 'rgba(255,255,255,0.95)',
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          padding: '12px'
        }}>
          <div className="w-full flex gap-3">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="flex items-center justify-center space-x-2 flex-1 px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
        )}
      </AnimatePresence>
    </main>
  )
}
