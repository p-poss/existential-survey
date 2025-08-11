export interface SurveyResponse {
  id: string
  created_at: string
  q1: string
  q2: string
  q3: string
  q4: string
  q5: string
  q6: string
  q7: string
  q8: string
  q9: string
  q10: string
  q11: string
  q12: string
  q13: string
  q1_option?: string
  completion_time?: number
}

export interface SurveyQuestion {
  id: number
  type: 'text' | 'multiple_choice'
  question: string
  options?: string[]
}


