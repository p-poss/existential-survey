'use client'

import { useState } from 'react'
import SurveyForm from "@/components/SurveyForm"
import VideoBackground from "@/components/VideoBackground"
import ContentAreaVideo from "@/components/ContentAreaVideo"

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0)

  return (
    <main className="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <VideoBackground />
      <div className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden">
        <div className="min-h-screen flex items-center justify-center py-8 px-4 relative">
          <ContentAreaVideo questionNumber={currentQuestion + 1} />
          
          {/* Content positioned within the video area */}
          <div className="absolute inset-4 flex items-center justify-center">
            <div className="w-full max-w-[1200px] h-full max-h-[800px] flex flex-col justify-between relative z-20 p-8">
              
              {/* Top Group: Title and Subtitle */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg min-h-[2rem] leading-tight">Questions To Contemplate</h1>
                <p className="text-lg text-gray-200 max-w-3xl mx-auto leading-normal drop-shadow-md">
                  This survey is anonymous and for the purpose of a design research experiment.
                </p>
              </div>
              
              {/* Bottom Group: Survey Content */}
              <div>
                <SurveyForm currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} />
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </main>
  )
}
