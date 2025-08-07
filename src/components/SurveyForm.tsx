'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { surveyQuestions } from '@/data/questions'

interface FormData {
  q1: string
  q2: string
  q3: string
  q4: string
  q5: string
  q6: string
  q7: string
  q8: string
  q9: string
  q10: string
  q9_option?: string
  q10_option?: string
}

export default function SurveyForm({ currentQuestion, setCurrentQuestion }: { currentQuestion: number; setCurrentQuestion: (question: number) => void }) {
  
  const [formData, setFormData] = useState<FormData>({
    q1: '', q2: '', q3: '', q4: '', q5: '',
    q6: '', q7: '', q8: '', q9: '', q10: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(Date.now())

  const currentQ = surveyQuestions[currentQuestion]

  const handleInputChange = (value: string, option?: string) => {
    const fieldName = `q${currentQ.id}` as keyof FormData
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
      ...(option && { [`${fieldName}_option`]: option })
    }))
  }

  const handleNext = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-6 text-center"
      >
        <div className="bg-green-50 bg-opacity-95 backdrop-blur-sm border border-green-200 rounded-lg p-8 shadow-xl min-h-[20rem]">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Thank you for your responses!
          </h2>
          <p className="text-green-700">
            Your survey has been submitted successfully.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="w-[600px] mx-auto p-4">
      {/* Question Counter */}
      <div className="mb-8 text-left">
        <span className="text-sm text-white drop-shadow-md">
          {(currentQuestion + 1).toString().padStart(2, '0')} / {surveyQuestions.length.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-transparent rounded-md mb-6 min-h-[20rem]"
        >
          <h2 className="text-lg font-semibold mb-4 min-h-[2.5rem] flex items-start leading-tight text-white drop-shadow-lg">
            {currentQ.question}
          </h2>

          {currentQ.type === 'text' ? (
            <textarea
              value={formData[`q${currentQ.id}` as keyof FormData] as string}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full border-0 rounded-lg focus:ring-0 focus:outline-none focus:border-0 resize-none bg-transparent"
              style={{ outline: 'none', color: 'white' }}
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
                        backdropFilter: 'blur(2px)', 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        opacity: formData[`q${currentQ.id}` as keyof FormData] === option ? 0.3 : 1
                      }}
                    />
                    <input
                      type="radio"
                      name={`q${currentQ.id}`}
                      value={option}
                      checked={formData[`q${currentQ.id}` as keyof FormData] === option}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="text-white drop-shadow-md">{option}</span>
                </label>
              ))}
              
              {/* Custom input for "Something else (write in)" option */}
              {(formData[`q${currentQ.id}` as keyof FormData] === 'Something else (write in)') && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={formData[`q${currentQ.id}_option` as keyof FormData] as string || ''}
                    onChange={(e) => handleInputChange(formData[`q${currentQ.id}` as keyof FormData] as string, e.target.value)}
                    placeholder="Please specify..."
                    className="w-full border-0 rounded-lg focus:ring-0 focus:outline-none focus:border-0 bg-transparent"
                    style={{ outline: 'none', color: 'white' }}
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center justify-center space-x-2 w-[120px] px-6 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backdropFilter: 'blur(2px)', 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            opacity: 1
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.3'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >

          <span style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)' }}>Back</span>
        </button>

        {currentQuestion === surveyQuestions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center justify-center space-x-2 w-[120px] px-6 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backdropFilter: 'blur(2px)', 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              opacity: 1
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.3'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            
            <span style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)' }}>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center justify-center space-x-2 w-[120px] px-6 py-2 text-white rounded-lg"
            style={{ 
              backdropFilter: 'blur(2px)', 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              opacity: 1
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.3'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <span style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)' }}>Skip</span>
            
          </button>
        )}
      </div>
    </div>
  )
}
