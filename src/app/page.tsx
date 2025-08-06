import SurveyForm from "@/components/SurveyForm"
import VideoBackground from "@/components/VideoBackground"

export default function Home() {
  return (
    <main className="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <VideoBackground />
      <div className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden">
        <div className="min-h-screen flex items-center justify-center py-8 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">Questions To Contemplate</h1>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                Take time to reflect on life, death, and what comes after. This survey is anonymous and was created as a design research experiment.
              </p>            </div>
            <SurveyForm />
          </div>
        </div>
      </div>
    </main>
  )
}
