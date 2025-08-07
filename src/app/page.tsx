'use client'

import { useState } from 'react'
import SurveyForm from "@/components/SurveyForm"
import ContentAreaVideo from "@/components/ContentAreaVideo"
import NoiseOverlay from "@/components/NoiseOverlay"

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0)

  return (
    <main className="fixed inset-0 w-full h-full overflow-hidden bg-white">
      <div className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden">
        <div className="min-h-screen flex items-center justify-center py-8 px-4 relative">
          {/* Content positioned within the video area */}
          <div className="absolute inset-4 flex items-center justify-center">
            <div className="w-full max-w-[800px] h-full max-h-[600px] relative z-20 p-8">
              
              {/* Video Background */}
              <div className="absolute inset-0 overflow-hidden rounded-md">
                <ContentAreaVideo questionNumber={currentQuestion + 1} />
              </div>
              
              {/* Centered Survey Content */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <SurveyForm currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} />
              </div>
              
              {/* Noise Overlay */}
              <NoiseOverlay />
              
            </div>
          </div>
          
        </div>
      </div>
    </main>
  )
}
