/**
 * Validation and sanitization utilities for survey data
 * Provides invisible protection against malicious inputs
 */

// Maximum lengths for different field types
const VALIDATION_LIMITS = {
  TEXT_QUESTION: 500,      // Survey text questions
  LOCATION: 100,           // Location field
  EMAIL: 100,              // Email field
  AGE_MIN: 18,             // Minimum age
  AGE_MAX: 118,            // Maximum age
  COMPLETION_TIME_MIN: 0,  // Minimum completion time (seconds)
  COMPLETION_TIME_MAX: 3600, // Maximum completion time (1 hour)
} as const;

/**
 * Sanitizes text input by removing dangerous HTML/JavaScript
 * and limiting length
 */
export function sanitizeText(input: any, maxLength: number = VALIDATION_LIMITS.TEXT_QUESTION): string {
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
export function validateAge(input: any): number | null {
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
export function validateCompletionTime(input: any): number {
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
export function validateLocation(input: any): string | null {
  if (!input) {
    return null;
  }

  const sanitized = sanitizeText(input, VALIDATION_LIMITS.LOCATION);
  return sanitized || null;
}

/**
 * Validates and sanitizes email input
 */
export function validateEmail(input: any): string | null {
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
export function validateSurveySubmission(rawData: any): ValidatedSurveyData {
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
  for (let i = 1; i <= 13; i++) {
    const fieldName = `q${i}` as keyof ValidatedSurveyData;
    (validated as any)[fieldName] = sanitizeText(rawData[fieldName]);
  }

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
export function validateEmailSubmission(rawData: any): { email: string | null; formData: ValidatedSurveyData } {
  const email = validateEmail(rawData.email);
  const formData = validateSurveySubmission(rawData.formData || {});

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
