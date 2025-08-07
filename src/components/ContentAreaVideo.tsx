'use client'

import { useState, useEffect, useRef } from 'react'

interface ContentAreaVideoProps {
  questionNumber: number
}

export default function ContentAreaVideo({ questionNumber }: ContentAreaVideoProps) {
  const [videoTimes, setVideoTimes] = useState<{ [key: number]: number }>({})
  const [lastQuestion, setLastQuestion] = useState(questionNumber)
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set())

  // Video sources mapping
  const videoSources = {
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

  // Calculate video range (±2 from current question)
  const minVideo = Math.max(1, questionNumber - 2)
  const maxVideo = Math.min(10, questionNumber + 2)
  const currentVideoSource = videoSources[questionNumber as keyof typeof videoSources] || videoSources[1]

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

  // Manage video loading/unloading
  useEffect(() => {
    const newLoadedVideos = new Set<number>()
    
    // Load videos in range
    for (let i = minVideo; i <= maxVideo; i++) {
      newLoadedVideos.add(i)
    }
    
    setLoadedVideos(newLoadedVideos)
  }, [minVideo, maxVideo])

  // Restore video position when question changes
  useEffect(() => {
    if (questionNumber !== lastQuestion) {
      setLastQuestion(questionNumber)
      
      const video = videoRefs.current[questionNumber]
      if (video && videoTimes[questionNumber] !== undefined) {
        video.currentTime = videoTimes[questionNumber]
      }
    }
  }, [questionNumber, lastQuestion, videoTimes])

  // Create video element
  const createVideoElement = (videoNum: number) => {
    const isCurrentVideo = videoSources[videoNum as keyof typeof videoSources] === currentVideoSource
    const shouldLoad = loadedVideos.has(videoNum)
    
    if (!shouldLoad) return null

    return (
      <video 
        key={`video-${videoNum}`}
        ref={(el) => {
          videoRefs.current[videoNum] = el
          // Only restore position once when video is first created
          if (el && videoTimes[videoNum] !== undefined && !el.dataset.restored) {
            el.currentTime = videoTimes[videoNum]
            el.dataset.restored = 'true'
          }
        }}
        autoPlay
        muted
        loop
        playsInline
        className={`w-full h-full object-cover ${isCurrentVideo ? 'block' : 'hidden'}`}
        onTimeUpdate={() => handleTimeUpdate(videoNum)}
      >
        <source src={videoSources[videoNum as keyof typeof videoSources]} type="video/mp4" />
      </video>
    )
  }

  return (
    <div className="w-full h-full overflow-hidden rounded-md">
      {Array.from({ length: 10 }, (_, i) => i + 1).map(videoNum => 
        createVideoElement(videoNum)
      )}
    </div>
  )
}
