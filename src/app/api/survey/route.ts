import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase environment variables.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10']
    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === '') {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Prepare data for insertion
    const surveyData = {
      q1: body.q1.trim(),
      q2: body.q2.trim(),
      q3: body.q3.trim(),
      q4: body.q4.trim(),
      q5: body.q5.trim(),
      q6: body.q6.trim(),
      q7: body.q7.trim(),
      q8: body.q8.trim(),
      q9: body.q9.trim(),
      q10: body.q10.trim(),
      q9_option: body.q9_option || null,
      q10_option: body.q10_option || null,
      completion_time: body.completion_time || null
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
