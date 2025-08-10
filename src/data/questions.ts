import { SurveyQuestion } from '@/lib/supabase'

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: 1,
    type: 'multiple_choice',
    question: 'Is this life:',
    options: [
      'A test',
      "God's plan",
      'A simulation',
      'Something else (write in)'
    ]
  },
  {
    id: 2,
    type: 'text',
    question: 'What would you want written on your tombstone?'
  },
  {
    id: 3,
    type: 'text',
    question: 'Where do you want your remains to go?'
  },
  {
    id: 4,
    type: 'text',
    question: 'What comes after death?'
  },
  {
    id: 5,
    type: 'text',
    question: 'Who do you want to speak at your funeral?'
  },
  {
    id: 6,
    type: 'text',
    question: 'How do you want to be remembered by those who live on?'
  },
  {
    id: 7,
    type: 'text',
    question: 'If you died today, what experience would you most regret missing out on?'
  },
  {
    id: 8,
    type: 'text',
    question: 'Which possessions would you like to pass on?'
  },
  {
    id: 9,
    type: 'text',
    question: 'At what age do you think you will die?'
  },
  {
    id: 10,
    type: 'text',
    question: 'If money weren’t a concern, what would you work on?'
  },
  {
    id: 11,
    type: 'text',
    question: "What do you consider your life’s purpose?"
  },
  {
    id: 12,
    type: 'text',
    question: 'What are you most proud of?'
  },
  {
    id: 13,
    type: 'text',
    question: 'What question is missing?'
  }
]
