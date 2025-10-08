import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { checkRateLimit, getRateLimitHeaders, logRateLimitViolation } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting for admin login attempts
    const rateLimit = checkRateLimit(request, 'ADMIN_LOGIN')
    
    if (!rateLimit.allowed) {
      // Log the violation
      logRateLimitViolation(
        request.headers.get('x-forwarded-for') || 'unknown',
        'ADMIN_LOGIN',
        '/api/auth/login',
        request.headers.get('user-agent') || undefined
      )
      
      const headers = getRateLimitHeaders(
        rateLimit.allowed,
        rateLimit.remaining,
        rateLimit.resetTime,
        rateLimit.retryAfter
      )
      
      const contentType = request.headers.get('content-type') || ''
      if (contentType.includes('application/x-www-form-urlencoded')) {
        return NextResponse.redirect(new URL('/login?error=rate_limited', request.url))
      }
      
      return NextResponse.json(
        { 
          error: 'Too many login attempts. Please try again later.',
          retryAfter: rateLimit.retryAfter
        },
        { 
          status: 429,
          headers
        }
      )
    }

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
      
      const headers = getRateLimitHeaders(
        rateLimit.allowed,
        rateLimit.remaining,
        rateLimit.resetTime
      )

      // Redirect to admin page for form submissions
      if (contentType.includes('application/x-www-form-urlencoded')) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      
      return NextResponse.json({ success: true }, { headers })
    } else {
      const headers = getRateLimitHeaders(
        rateLimit.allowed,
        rateLimit.remaining,
        rateLimit.resetTime
      )
      
      if (contentType.includes('application/x-www-form-urlencoded')) {
        return NextResponse.redirect(new URL('/login?error=invalid', request.url))
      }
      
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401, headers }
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
