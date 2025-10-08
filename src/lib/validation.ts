/**
 * Validation and sanitization utilities for survey data
 * Provides invisible protection against malicious inputs
 */

// Type for raw input data (what we receive from the client)
interface RawSurveyData {
  [key: string]: unknown;
  q1?: unknown;
  q2?: unknown;
  q3?: unknown;
  q4?: unknown;
  q5?: unknown;
  q6?: unknown;
  q7?: unknown;
  q8?: unknown;
  q9?: unknown;
  q10?: unknown;
  q11?: unknown;
  q12?: unknown;
  q13?: unknown;
  q1_option?: unknown;
  completion_time?: unknown;
  login_age?: unknown;
  login_location?: unknown;
  email?: unknown;
  formData?: unknown;
}

// Maximum lengths for different field types
const VALIDATION_LIMITS = {
  TEXT_QUESTION: 500,      // Survey text questions
  LOCATION: 100,           // Location field
  EMAIL: 100,              // Email field
  AGE_MIN: 13,             // Minimum age (more inclusive)
  AGE_MAX: 118,            // Maximum age
  COMPLETION_TIME_MIN: 0,  // Minimum completion time (seconds)
  COMPLETION_TIME_MAX: 3600, // Maximum completion time (1 hour)
} as const;

/**
 * Sanitizes text input by removing dangerous HTML/JavaScript
 * and limiting length
 */
export function sanitizeText(input: unknown, maxLength: number = VALIDATION_LIMITS.TEXT_QUESTION): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '')
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove dangerous HTML attributes
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove object and embed tags
    .replace(/<(object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '')
    // Remove SQL injection attempts
    .replace(/['";]/g, '')
    // Trim whitespace and limit length
    .trim()
    .substring(0, maxLength);
}

/**
 * Validates and sanitizes age input
 */
export function validateAge(input: unknown): number | null {
  if (input === null || input === undefined || input === '') {
    return null;
  }

  const num = Number(input);
  
  // Check if it's a valid number and within reasonable range
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }

  // Round to nearest integer
  const age = Math.round(num);
  
  // Check age bounds
  if (age >= VALIDATION_LIMITS.AGE_MIN && age <= VALIDATION_LIMITS.AGE_MAX) {
    return age;
  }
  
  return null;
}

/**
 * Validates and sanitizes completion time
 */
export function validateCompletionTime(input: unknown): number {
  if (input === null || input === undefined || input === '') {
    return 0;
  }

  const num = Number(input);
  
  if (isNaN(num) || !isFinite(num)) {
    return 0;
  }

  const time = Math.round(num);
  
  if (time >= VALIDATION_LIMITS.COMPLETION_TIME_MIN && time <= VALIDATION_LIMITS.COMPLETION_TIME_MAX) {
    return time;
  }
  
  return 0;
}

/**
 * Validates and sanitizes location input
 */
export function validateLocation(input: unknown): string | null {
  if (!input) {
    return null;
  }

  const sanitized = sanitizeText(input, VALIDATION_LIMITS.LOCATION);
  return sanitized || null;
}

/**
 * Validates and sanitizes email input
 */
export function validateEmail(input: unknown): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const sanitized = input.trim().toLowerCase().substring(0, VALIDATION_LIMITS.EMAIL);
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (emailRegex.test(sanitized)) {
    return sanitized;
  }
  
  return null;
}

/**
 * Validates survey response data structure
 */
export interface ValidatedSurveyData {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
  q9: string;
  q10: string;
  q11: string;
  q12: string;
  q13: string;
  q1_option?: string;
  completion_time: number;
  login_age: number | null;
  login_location: string | null;
}

/**
 * Validates and sanitizes entire survey submission
 */
export function validateSurveySubmission(rawData: RawSurveyData): ValidatedSurveyData {
  // Initialize with empty values
  const validated: ValidatedSurveyData = {
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: '',
    q9: '',
    q10: '',
    q11: '',
    q12: '',
    q13: '',
    completion_time: 0,
    login_age: null,
    login_location: null,
  };

  // Validate each question (q1-q13)
  validated.q1 = sanitizeText(rawData.q1);
  validated.q2 = sanitizeText(rawData.q2);
  validated.q3 = sanitizeText(rawData.q3);
  validated.q4 = sanitizeText(rawData.q4);
  validated.q5 = sanitizeText(rawData.q5);
  validated.q6 = sanitizeText(rawData.q6);
  validated.q7 = sanitizeText(rawData.q7);
  validated.q8 = sanitizeText(rawData.q8);
  validated.q9 = sanitizeText(rawData.q9);
  validated.q10 = sanitizeText(rawData.q10);
  validated.q11 = sanitizeText(rawData.q11);
  validated.q12 = sanitizeText(rawData.q12);
  validated.q13 = sanitizeText(rawData.q13);

  // Validate Q1 option (write-in text)
  if (rawData.q1_option) {
    validated.q1_option = sanitizeText(rawData.q1_option);
  }

  // Validate metadata
  validated.completion_time = validateCompletionTime(rawData.completion_time);
  validated.login_age = validateAge(rawData.login_age);
  validated.login_location = validateLocation(rawData.login_location);

  return validated;
}

/**
 * Validates email submission data
 */
export function validateEmailSubmission(rawData: RawSurveyData): { email: string | null; formData: ValidatedSurveyData } {
  const email = validateEmail(rawData.email);
  const formData = validateSurveySubmission((rawData.formData as RawSurveyData) || {});

  return { email, formData };
}

/**
 * Checks if submission has minimum required data
 */
export function hasMinimumData(data: ValidatedSurveyData): boolean {
  // Check if at least one question has meaningful content
  const hasContent = Object.keys(data).some(key => {
    if (key === 'completion_time' || key === 'login_age' || key === 'login_location' || key === 'q1_option') {
      return false;
    }
    return data[key as keyof ValidatedSurveyData] && 
           String(data[key as keyof ValidatedSurveyData]).trim().length > 0;
  });

  return hasContent;
}
