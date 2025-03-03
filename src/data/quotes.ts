import Airtable from 'airtable';
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } from '../config';

export interface Quote {
  text: string;
  author: string;
  year: number;
  url: string;
  bio: string;
  image: string; // Changed from optional to required
}

// Initialize Airtable base
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

/**
 * Shuffles an array using the Fisher-Yates (Knuth) shuffle algorithm
 * @param array The array to shuffle
 * @returns A new shuffled array
 */
function shuffleArray<T>(array: T[]): T[] {
  // Create a copy of the array to avoid mutating the original
  const shuffled = [...array];
  
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Extract image URL from Airtable field which could be in different formats
 */
function extractImageUrl(imageField: any): string {
  if (!imageField) return '';
  
  if (typeof imageField === 'string') {
    return imageField;
  } else if (Array.isArray(imageField) && imageField.length > 0) {
    // Airtable sometimes returns attachments as an array of objects
    return imageField[0].url || '';
  }
  
  return '';
}

/**
 * Load quotes from Airtable and return them in a shuffled order
 */
export async function loadQuotes(): Promise<Quote[]> {
  try {
    const records = await base(AIRTABLE_TABLE_NAME)
      .select({
        view: 'Grid view'
      })
      .all();
    
    // Convert Airtable records to Quote objects and filter out incomplete quotes
    const quotes = records
      .map(record => {
        // Get the year and make sure it's a valid number
        const yearValue = record.get('Year');
        const year = yearValue ? Number(yearValue) : NaN;
        
        const quote = {
          text: record.get('Quote') as string,
          author: record.get('Person') as string,
          year: year,
          url: record.get('URL') as string,
          bio: record.get('Bio') as string,
          image: extractImageUrl(record.get('Image'))
        };
        
        return quote;
      })
      // Filter out quotes with missing fields
      .filter(quote => 
        Boolean(quote.text) && 
        Boolean(quote.author) && 
        !isNaN(quote.year) && // Check that year is a valid number
        Boolean(quote.url) && 
        Boolean(quote.bio) && 
        Boolean(quote.image)
      );
    
    console.log(`Filtered out ${records.length - quotes.length} quotes with missing fields.`);
    console.log(`Displaying ${quotes.length} complete quotes.`);
    
    // Shuffle the quotes before returning
    return shuffleArray(quotes);
  } catch (error) {
    console.error('Error loading quotes from Airtable:', error);
    throw new Error('Failed to load quotes. Please try again later.');
  }
}