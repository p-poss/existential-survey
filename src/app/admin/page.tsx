import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import AdminDashboard from '@/components/AdminDashboard'

export default async function AdminPage() {
  // Check authentication
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/login')
  }

  return (
    <main className="relative z-10 min-h-screen bg-gray-50 py-8">
      <AdminDashboard />
    </main>
  )
}
