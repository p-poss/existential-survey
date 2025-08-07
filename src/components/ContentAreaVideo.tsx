'use client'

import { useState, useEffect, useRef, useMemo } from 'react'

interface ContentAreaVideoProps {
  questionNumber: number
}

export default function ContentAreaVideo({ questionNumber }: ContentAreaVideoProps) {
  const [videoTimes, setVideoTimes] = useState<{ [key: number]: number }>({})
  const [lastQuestion, setLastQuestion] = useState(questionNumber)
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})

  // Calculate which videos should be loaded based on current question
  const getVideoRange = (currentQ: number) => {
    const min = Math.max(1, currentQ - 2)
    const max = Math.min(10, currentQ + 2)
    return { min, max }
  }

  // Determine which video to show based on question number
  const getVideoSource = (questionNum: number) => {
    const videoMap: { [key: number]: string } = {
      1: 'https://poss.b-cdn.net/puffco-peak-use.mp4',
      2: 'https://poss.b-cdn.net/puffco-peak-clear.mp4',
      3: 'https://poss.b-cdn.net/subambient-preview.mp4',
      4: 'https://poss.b-cdn.net/puffco-peak-intro-preview.mp4',
      5: 'https://poss.b-cdn.net/puffco-peak-clear-preview.mp4',
      6: 'https://poss.b-cdn.net/arktura-zund.mp4',
      7: 'https://poss.b-cdn.net/vapor-install-preview.mp4',
      8: 'https://poss.b-cdn.net/forest-foundry-preview.mp4',
      9: 'https://poss.b-cdn.net/vapor-punch.mp4',
      10: 'https://poss.b-cdn.net/courtside-hero.mp4'
    }
    return videoMap[questionNum] || videoMap[1]
  }

  const currentVideoSource = getVideoSource(questionNumber)
  const { min: minVideo, max: maxVideo } = getVideoRange(questionNumber)

  // Memoize the video range to prevent unnecessary re-renders
  const videoRange = useMemo(() => {
    return { min: minVideo, max: maxVideo }
  }, [minVideo, maxVideo])

  // Handle video time updates
  const handleTimeUpdate = (videoNum: number) => {
    const video = videoRefs.current[videoNum]
    if (video) {
      setVideoTimes(prev => ({
        ...prev,
        [videoNum]: video.currentTime
      }))
    }
  }

  // Only restore video position when question actually changes
  useEffect(() => {
    if (questionNumber !== lastQuestion) {
      setLastQuestion(questionNumber)
      
      // Restore position for the current video
      const video = videoRefs.current[questionNumber]
      if (video && videoTimes[questionNumber] !== undefined) {
        video.currentTime = videoTimes[questionNumber]
      }
    }
  }, [questionNumber, lastQuestion, videoTimes])

  // Create video element for a specific question
  const createVideoElement = (videoNum: number) => {
    const isCurrentVideo = getVideoSource(videoNum) === currentVideoSource
    const shouldLoad = videoNum >= videoRange.min && videoNum <= videoRange.max
    
    if (!shouldLoad) return null

    return (
      <video 
        key={`video-${videoNum}`}
        ref={(el) => {
          videoRefs.current[videoNum] = el
          // Only restore position when video is first created, not on every render
          if (el && videoTimes[videoNum] !== undefined && !el.dataset.positionRestored) {
            el.currentTime = videoTimes[videoNum]
            el.dataset.positionRestored = 'true'
          }
        }}
        autoPlay
        muted
        loop
        playsInline
        className={`w-full h-full object-cover ${isCurrentVideo ? 'block' : 'hidden'}`}
        onTimeUpdate={() => handleTimeUpdate(videoNum)}
        onLoadStart={() => console.log(`Content Video ${videoNum}: load started`)}
        onCanPlay={() => console.log(`Content Video ${videoNum}: can play`)}
        onPlay={() => console.log(`Content Video ${videoNum}: playing`)}
        onError={(e) => console.log(`Content Video ${videoNum}: error:`, e)}
      >
        <source src={getVideoSource(videoNum)} type="video/mp4" />
      </video>
    )
  }

  return (
    <div className="absolute inset-4 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-[1200px] h-full max-h-[800px] overflow-hidden rounded-lg">
        
        {/* Dynamically create video elements for the current range */}
        {Array.from({ length: 10 }, (_, i) => i + 1).map(videoNum => 
          createVideoElement(videoNum)
        )}

      </div>
    </div>
  )
}
