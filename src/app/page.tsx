'use client'

import { useState } from 'react'
import ContentAreaVideo from "@/components/ContentAreaVideo"
import NoiseOverlay from "@/components/NoiseOverlay"
import { surveyQuestions } from '@/data/questions'

// Question Content Component
function QuestionContent({ 
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
      <h2 className="text-lg font-semibold text-black mb-6">
        {currentQ.question}
      </h2>
      <div>
        {currentQ.type === 'text' ? (
          <textarea
            value={formData[fieldName] || ''}
            onChange={(e) => onInputChange(e.target.value)}
            className="w-full border-0 rounded-lg focus:ring-0 focus:outline-none focus:border-0 resize-none bg-transparent"
            style={{ outline: 'none', color: 'black' }}
            rows={4}
            placeholder="Type your answer here..."
          />
        ) : (
          <div className="space-y-3">
            {currentQ.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <div className="relative">
                                      <div 
                      className="w-4 h-4 rounded-full"
                      style={{ 
                        border: '1px solid black',
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
                <span className="text-black">{option}</span>
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
      <main className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="w-[calc(100vw-32px)] max-w-[800px] h-[600px] max-h-[calc(100dvh-32px)] min-h-0 flex flex-col mx-auto">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-black mb-4">
                Survey is now complete.
              </h2>
              <p className="text-black">
                Responses submitted anonymously.
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full bg-white flex items-center justify-center">
      <div className="w-[calc(100vw-32px)] max-w-[800px] h-[600px] max-h-[calc(100dvh-32px)] min-h-0 flex flex-col mx-auto">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {/* Content container */}
          <div className="w-full flex flex-col flex-1">
            {/* Chunk 1: Video area with number and noise */}
            <div className="h-[200px] relative z-20">
              <div className="absolute inset-0 overflow-hidden rounded-md">
                <ContentAreaVideo questionNumber={currentQuestion + 1} />
              </div>
              
              <div className="absolute top-8 left-6 z-10">
                <span className="text-sm text-white drop-shadow-md">
                  {(currentQuestion + 1).toString().padStart(2, '0')} / 10
                </span>
              </div>
              
              <NoiseOverlay />
            </div>
            
            {/* Chunk 2: Question content - Fixed spacing from video */}
            <div className="h-[200px] mt-8 px-6">
              <QuestionContent 
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

        {/* Chunk 3: Navigation buttons at bottom */}
        <div className="mt-auto">
          <div className="w-full flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="flex items-center justify-center space-x-2 w-[120px] px-6 py-2 text-black rounded-lg disabled:opacity-50 cursor-pointer border border-black"
              style={{ 
                backdropFilter: 'blur(2px)', 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                opacity: 1
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.3'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <span>←</span>
            </button>

            {currentQuestion === 9 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center justify-center space-x-2 w-[120px] px-6 py-2 text-black rounded-lg disabled:opacity-50 cursor-pointer border border-black"
                style={{ 
                  backdropFilter: 'blur(2px)', 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  opacity: 1
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.3'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(9, currentQuestion + 1))}
                className="flex items-center justify-center space-x-2 w-[120px] px-6 py-2 text-black rounded-lg cursor-pointer border border-black"
                style={{ 
                  backdropFilter: 'blur(2px)', 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  opacity: 1
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.3'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
