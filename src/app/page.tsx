'use client'

import { useState, useEffect } from 'react'
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
    <h2 className="font-semibold text-black mb-3 flex items-start min-h-[42px]" style={{ fontSize: '16px', lineHeight: '21px' }}>
      {currentQ.question}
    </h2>
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
          className="w-full border-0 rounded-lg focus:ring-0 focus:outline-none focus:border-0 resize-none bg-transparent [&::placeholder]:text-black/50"
          style={{ outline: 'none', color: 'black', fontSize: '16px', lineHeight: '21px' }}
          rows={4}
          placeholder="Type here..."
        />
      ) : (
        <div className="space-y-3">
          {currentQ.options?.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer">
              <div className="relative">
                                                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ 
                          border: '2px solid black',
                          backgroundColor: formData[fieldName] === option ? 'black' : 'transparent'
                        }}
                      />
            <input
              type="radio"
              name={fieldName}
              value={option}
              checked={formData[fieldName] === option}
              onChange={(e) => onInputChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <span className="text-black" style={{ fontSize: '16px', lineHeight: '21px' }}>{option}</span>
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
              className="w-full border-0 rounded-lg focus:ring-0 focus:outline-none focus:border-0 bg-transparent"
              style={{ outline: 'none', color: 'black' }}
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
  }, [currentQuestion])

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
      <main className="h-[100dvh] w-full bg-gray-500 flex items-center justify-center">
        <div className="w-[calc(100vw-32px)] max-w-[800px] h-[800px] max-h-[calc(100dvh-32px)] min-h-0 flex flex-col mx-auto border-2 border-black bg-white shadow-2xl">
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
    <main className="h-[100dvh] w-full bg-gray-500 flex items-center justify-center">
      <div className="w-[calc(100vw-32px)] max-w-[800px] h-[800px] max-h-[calc(100dvh-32px)] min-h-0 flex flex-col mx-auto border-2 border-black bg-white shadow-2xl">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {/* Content container */}
          <div className="w-full flex flex-col flex-1">
            {/* Chunk 1: Video area with number and noise */}
            <div className="h-[200px] relative z-20 border-b-2 border-black">
              <div className="absolute inset-0 overflow-hidden">
                <ContentAreaVideo questionNumber={currentQuestion + 1} />
              </div>
              
              <div className="absolute top-3 left-3 z-10">
                <span className="text-white font-mono" style={{ fontSize: '16px', lineHeight: '21px', margin: 0, padding: 0 }}>
                  {(currentQuestion + 1).toString().padStart(2, '0')} / 10
                </span>
              </div>
              

            </div>
            
            {/* Chunk 2: Question text */}
            <div className="pt-3 px-3 border-b-2 border-black">
              <QuestionText currentQuestion={currentQuestion} />
            </div>
            
            {/* Chunk 3: Interactive elements */}
            <div className="pt-3 px-3 mb-3">
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
        <div className="mt-auto">
          <div className="w-full flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="flex items-center justify-center space-x-2 w-1/2 px-6 py-2 text-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-2 border-black"
              style={{ 
                backdropFilter: 'blur(2px)', 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                opacity: 1
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.3'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <span style={{ fontSize: '16px', lineHeight: '21px' }}>←</span>
            </button>

            {currentQuestion === 9 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center justify-center space-x-2 w-1/2 px-6 py-2 text-black disabled:opacity-50 disabled:cursor-not-allowed cursor-crosshair border-2 border-black"
                style={{ 
                  backdropFilter: 'blur(2px)', 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  opacity: 1
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.3'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <span style={{ fontSize: '16px', lineHeight: '21px' }}>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(9, currentQuestion + 1))}
                className="flex items-center justify-center space-x-2 w-1/2 px-6 py-2 text-black cursor-pointer border-2 border-black"
                style={{ 
                  backdropFilter: 'blur(2px)', 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  opacity: 1
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.3'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <span style={{ fontSize: '16px', lineHeight: '21px' }}>→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
