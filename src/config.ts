import { FALLBACK_API_KEY, FALLBACK_BASE_ID, FALLBACK_TABLE_NAME } from './config.prod';

// Use environment variables with fallbacks for development/production
export const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || FALLBACK_API_KEY;
export const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || FALLBACK_BASE_ID;
export const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME || FALLBACK_TABLE_NAME;

// Validate configuration
if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
  throw new Error('Missing required Airtable configuration. Check your environment variables.');
}