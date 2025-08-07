'use client'

import { useState } from 'react'
import SurveyForm from '@/components/SurveyForm'

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0)

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Full-screen video background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="/globe.svg"
        >
          <source src="/background-video.mp4" type="video/mp4" />
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Existential Survey
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Reflect on life, death, and what comes after. This anonymous survey explores 
              our deepest thoughts about mortality, legacy, and the meaning of existence.
            </p>
          </div>
          
          <SurveyForm currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} />
        </div>
      </div>
    </main>
  )
}
