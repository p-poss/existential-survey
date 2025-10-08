import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { validateEmailSubmission } from '@/lib/validation'
import { checkRateLimit, getRateLimitHeaders, logRateLimitViolation } from '@/lib/rate-limit'

// Initialize Resend only if API key is available
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting for email sending
    const rateLimit = checkRateLimit(request, 'EMAIL_SENDING')
    
    if (!rateLimit.allowed) {
      // Log the violation
      logRateLimitViolation(
        request.headers.get('x-forwarded-for') || 'unknown',
        'EMAIL_SENDING',
        '/api/email',
        request.headers.get('user-agent') || undefined
      )
      
      const headers = getRateLimitHeaders(
        rateLimit.allowed,
        rateLimit.remaining,
        rateLimit.resetTime,
        rateLimit.retryAfter
      )
      
      return NextResponse.json(
        { 
          error: 'Too many email requests. Please try again later.',
          retryAfter: rateLimit.retryAfter
        },
        { 
          status: 429,
          headers
        }
      )
    }

    // Check if Resend is configured
    const resend = getResend()
    if (!resend) {
      const headers = getRateLimitHeaders(
        rateLimit.allowed,
        rateLimit.remaining,
        rateLimit.resetTime
      )
      
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500, headers }
      )
    }

    const rawBody = await request.json()
    
    // Validate and sanitize email and form data
    const { email, formData } = validateEmailSubmission(rawBody)

    if (!email || !formData) {
      return NextResponse.json(
        { error: 'Valid email and form data are required' },
        { status: 400 }
      )
    }

    // Import survey questions to get the question text
    const { surveyQuestions } = await import('@/data/questions')

    // Format the email content with questions and answers
    let emailContent = '<h2>Your Survey Answers</h2><br>'
    
    surveyQuestions.forEach((question) => {
      const answerKey = `q${question.id}` as keyof typeof formData
      const optionKey = `${answerKey}_option` as keyof typeof formData
      const answer = formData[answerKey] || 'No answer provided'
      const option = formData[optionKey] || ''
      
      emailContent += `<h3>${question.question}</h3>`
      if (option && answer === 'Something else (write in)') {
        emailContent += `<p><strong>Answer:</strong> ${option}</p>`
      } else {
        emailContent += `<p><strong>Answer:</strong> ${answer}</p>`
      }
      emailContent += '<br>'
    })

    // Add completion time if available
    if (formData.completion_time && formData.completion_time > 0) {
      emailContent += `<p><strong>Completion Time:</strong> ${formData.completion_time} seconds</p><br>`
    }

    // Add login metadata if available
    if (formData.login_age || formData.login_location) {
      emailContent += '<h3>Additional Information</h3>'
      if (formData.login_age) {
        emailContent += `<p><strong>Age:</strong> ${formData.login_age}</p>`
      }
      if (formData.login_location) {
        emailContent += `<p><strong>Location:</strong> ${formData.login_location}</p>`
      }
      emailContent += '<br>'
    }

    emailContent += '<p><em>Thank you for completing the survey!</em></p>'

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: [email],
      subject: 'Your Survey Answers - 13 Questions To Contemplate Before We Die',
      html: emailContent,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    const headers = getRateLimitHeaders(
      rateLimit.allowed,
      rateLimit.remaining,
      rateLimit.resetTime
    )

    return NextResponse.json(
      { success: true, id: data?.id },
      { status: 200, headers }
    )

  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
