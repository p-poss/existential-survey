import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateSurveySubmission, hasMinimumData } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // Gracefully handle missing Supabase configuration in production
    if (!supabase) {
      return NextResponse.json(
        { success: true, id: null, note: 'Supabase not configured; response accepted without persistence' },
        { status: 201 }
      )
    }

    const rawBody = await request.json()
    
    // Validate and sanitize all input data
    const validatedData = validateSurveySubmission(rawBody)
    
    // Check if submission has minimum meaningful content
    if (!hasMinimumData(validatedData)) {
      return NextResponse.json(
        { error: 'Please provide at least one answer' },
        { status: 400 }
      )
    }

    // Prepare data for insertion (already validated and sanitized)
    const surveyData = {
      q1: validatedData.q1,
      q2: validatedData.q2,
      q3: validatedData.q3,
      q4: validatedData.q4,
      q5: validatedData.q5,
      q6: validatedData.q6,
      q7: validatedData.q7,
      q8: validatedData.q8,
      q9: validatedData.q9,
      q10: validatedData.q10,
      q11: validatedData.q11,
      q12: validatedData.q12,
      q13: validatedData.q13,
      q1_option: validatedData.q1_option || null,
      completion_time: validatedData.completion_time,
      // Login window metadata (validated)
      login_age: validatedData.login_age,
      login_location: validatedData.login_location
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('survey_responses')
      .insert([surveyData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save survey response' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, id: data?.[0]?.id },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase environment variables.' },
        { status: 500 }
      )
    }

    // Get all survey responses (for admin dashboard)
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch survey responses' },
        { status: 500 }
      )
    }

    return NextResponse.json({ responses: data })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
