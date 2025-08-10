'use client'

export default function VideoBackground() {
  return (
    <div className="fixed inset-0 w-[100vw] h-[100dvh] overflow-hidden z-0" aria-hidden>
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
