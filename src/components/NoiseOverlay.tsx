'use client'

import { useEffect, useRef } from 'react'

export default function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.offsetWidth
        canvas.height = container.offsetHeight
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Noise animation variables
    let animationId: number
    let time = 0

    // Generate animated noise
    const animateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        // Generate noise value (0-255)
        const noise = Math.random() * 255
        
        // Add more obvious animation based on time
        const animatedNoise = (noise + Math.sin(time * 0.05) * 50) % 255
        
        // Set RGBA values (colored noise)
        data[i] = (animatedNoise + Math.sin(time * 0.02) * 30) % 255     // R (red variation)
        data[i + 1] = (animatedNoise + Math.cos(time * 0.03) * 40) % 255 // G (green variation)
        data[i + 2] = (animatedNoise + Math.sin(time * 0.01) * 50) % 255 // B (blue variation)
        data[i + 3] = 100           // A (more visible opacity)
      }

      ctx.putImageData(imageData, 0, 0)
      time++
      animationId = requestAnimationFrame(animateNoise)
    }

    animateNoise()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30 rounded-md"
      style={{
        mixBlendMode: 'normal',
        opacity: 0.8
      }}
    />
  )
} 