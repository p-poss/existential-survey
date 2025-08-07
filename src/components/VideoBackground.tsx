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
      >
        <source src="https://poss.b-cdn.net/subambient.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
