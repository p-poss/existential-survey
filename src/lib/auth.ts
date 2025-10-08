import { cookies } from 'next/headers'

/**
 * Check if user is authenticated as admin
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value
    
    if (!sessionToken) {
      return false
    }
    
    // Simple validation - in production, verify JWT signature
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8')
    return decoded.startsWith('admin_')
  } catch (error) {
    console.error('Auth check error:', error)
    return false
  }
}

/**
 * Get admin session info
 */
export async function getSessionInfo(): Promise<{ isAdmin: boolean; sessionId?: string }> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value
    
    if (!sessionToken) {
      return { isAdmin: false }
    }
    
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8')
    if (decoded.startsWith('admin_')) {
      return { isAdmin: true, sessionId: sessionToken }
    }
    
    return { isAdmin: false }
  } catch (error) {
    console.error('Session info error:', error)
    return { isAdmin: false }
  }
}
