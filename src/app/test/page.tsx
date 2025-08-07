'use client'

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Simple Video Test</h1>
      
      <div className="mb-8 bg-red-500" style={{width: '800px', height: '400px', position: 'relative'}}>
        <video 
          autoPlay
          muted
          loop
          playsInline
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
          onLoadStart={() => console.log('SIMPLE: Video load started')}
          onCanPlay={() => console.log('SIMPLE: Video can play')}
          onPlay={() => console.log('SIMPLE: Video started playing')}
          onError={(e) => console.log('SIMPLE: Video error:', e)}
        >
          <source src="https://poss.b-cdn.net/subambient.mp4" type="video/mp4" />
        </video>
      </div>

      <p>Red background = container. If video loads, it should cover the red.</p>
      <p>Check console (F12) for messages.</p>
    </div>
  )
}
