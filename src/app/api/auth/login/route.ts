import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    let password: string
    
    // Handle both JSON and form data
    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await request.json()
      password = body.password
    } else {
      // Handle form data
      const formData = await request.formData()
      password = formData.get('password') as string
    }
    
    // Get admin password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD || 'existential2024'
    
    // Simple password check
    if (password === adminPassword) {
      // Create a simple session token (in production, use JWT or similar)
      const sessionToken = Buffer.from(`admin_${Date.now()}_${Math.random()}`).toString('base64')
      
      // Set secure HTTP-only cookie
      const cookieStore = await cookies()
      cookieStore.set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      })
      
      // Redirect to admin page for form submissions
      if (contentType.includes('application/x-www-form-urlencoded')) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      
      return NextResponse.json({ success: true })
    } else {
      if (contentType.includes('application/x-www-form-urlencoded')) {
        return NextResponse.redirect(new URL('/login?error=invalid', request.url))
      }
      
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
