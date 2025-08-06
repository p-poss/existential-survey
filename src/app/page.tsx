import SurveyForm from '@/components/SurveyForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Existential Survey
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Reflect on life, death, and what comes after. This anonymous survey explores 
            our deepest thoughts about mortality, legacy, and the meaning of existence.
          </p>
        </div>
        
        <SurveyForm />
      </div>
    </main>
  )
}
