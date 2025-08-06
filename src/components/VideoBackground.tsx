'use client'

export default function VideoBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <video 
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        onLoadStart={() => console.log('BG: Video load started')}
        onCanPlay={() => console.log('BG: Video can play')}
        onPlay={() => console.log('BG: Video playing')}
        onError={(e) => console.log('BG: Video error:', e)}
      >
        <source src="https://poss.b-cdn.net/subambient.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
