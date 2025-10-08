import { NextRequest } from 'next/server'

// Rate limiting configuration
export const RATE_LIMITS = {
  // Survey submission limits
  SURVEY_SUBMISSION: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 3, // 3 submissions per 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes block
  },
  // Email sending limits
  EMAIL_SENDING: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 5, // 5 emails per hour
    blockDurationMs: 2 * 60 * 60 * 1000, // 2 hours block
  },
  // Admin login limits
  ADMIN_LOGIN: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5, // 5 login attempts per 15 minutes
    blockDurationMs: 60 * 60 * 1000, // 1 hour block
  },
  // General API limits
  API_GENERAL: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxAttempts: 20, // 20 requests per 5 minutes
    blockDurationMs: 15 * 60 * 1000, // 15 minutes block
  }
} as const

// In-memory store for rate limiting (in production, use Redis)
interface RateLimitEntry {
  count: number
  resetTime: number
  blockedUntil?: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Get client identifier for rate limiting
 */
function getClientId(request: NextRequest): string {
  // Try to get real IP from headers (for production with proxy)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
  
  // Include user agent for additional fingerprinting
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Create a simple hash of IP + User Agent for better tracking
  return `${ip}-${userAgent.slice(0, 50)}`
}

/**
 * Check if request is rate limited
 */
export function checkRateLimit(
  request: NextRequest,
  limitType: keyof typeof RATE_LIMITS
): { allowed: boolean; remaining: number; resetTime: number; retryAfter?: number } {
  const clientId = getClientId(request)
  const limit = RATE_LIMITS[limitType]
  const now = Date.now()
  
  // Create unique key for this client + limit type
  const key = `${clientId}-${limitType}`
  
  const entry = rateLimitStore.get(key)
  
  // If no entry exists, create one
  if (!entry) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + limit.windowMs
    })
    
    return {
      allowed: true,
      remaining: limit.maxAttempts - 1,
      resetTime: now + limit.windowMs
    }
  }
  
  // Check if currently blocked
  if (entry.blockedUntil && entry.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.blockedUntil - now) / 1000)
    }
  }
  
  // Check if window has expired
  if (entry.resetTime < now) {
    // Reset the counter
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + limit.windowMs
    })
    
    return {
      allowed: true,
      remaining: limit.maxAttempts - 1,
      resetTime: now + limit.windowMs
    }
  }
  
  // Check if limit exceeded
  if (entry.count >= limit.maxAttempts) {
    // Block the client
    entry.blockedUntil = now + limit.blockDurationMs
    rateLimitStore.set(key, entry)
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil(limit.blockDurationMs / 1000)
    }
  }
  
  // Increment counter
  entry.count++
  rateLimitStore.set(key, entry)
  
  return {
    allowed: true,
    remaining: limit.maxAttempts - entry.count,
    resetTime: entry.resetTime
  }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(
  allowed: boolean,
  remaining: number,
  resetTime: number,
  retryAfter?: number
): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': '1', // Will be overridden by specific limits
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString()
  }
  
  if (retryAfter) {
    headers['Retry-After'] = retryAfter.toString()
  }
  
  return headers
}

/**
 * Log rate limit violations for monitoring
 */
export function logRateLimitViolation(
  clientId: string,
  limitType: string,
  endpoint: string,
  userAgent?: string
): void {
  console.warn(`Rate limit exceeded: ${clientId} - ${limitType} - ${endpoint}`, {
    clientId,
    limitType,
    endpoint,
    userAgent,
    timestamp: new Date().toISOString()
  })
}
