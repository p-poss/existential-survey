'use client'

export default function DebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Video Debug Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl mb-2">Direct Video Test:</h2>
        <video 
          controls 
          width="500" 
          height="300"
          onLoadStart={() => console.log('Video load started')}
          onCanPlay={() => console.log('Video can play')}
          onError={(e) => console.log('Video error:', e)}
        >
          <source src="https://poss.b-cdn.net/subambient.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="mb-4">
        <h2 className="text-xl mb-2">URL Test:</h2>
        <a 
          href="https://poss.b-cdn.net/subambient.mp4" 
          target="_blank" 
          className="text-blue-500 underline"
        >
          Test video URL directly
        </a>
      </div>

      <div>
        <h2 className="text-xl mb-2">Console:</h2>
        <p>Check browser console (F12) for video loading messages</p>
      </div>
    </div>
  )
}
