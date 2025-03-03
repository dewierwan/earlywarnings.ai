import Airtable from 'airtable';
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } from '../config';

export interface Quote {
  text: string;
  author: string;
  year: number;
  url: string;
  bio: string;
  image?: string;
}

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

export async function loadQuotes(): Promise<Quote[]> {
  console.log('Config:', {
    apiKey: AIRTABLE_API_KEY?.slice(0,5) + '...',
    baseId: AIRTABLE_BASE_ID,
    tableName: AIRTABLE_TABLE_NAME
  });

  try {
    const records = await base(AIRTABLE_TABLE_NAME)
      .select({
        view: 'Grid view'
      })
      .all();
    
    console.log('Records fetched:', records.length);
    
    // Convert Airtable records to Quote objects
    const quotes = records.map(record => {
      // Handle image field which could be an attachment object or a string
      let imageUrl = '';
      const imageField = record.get('Image');
      
      if (imageField) {
        if (typeof imageField === 'string') {
          imageUrl = imageField;
        } else if (Array.isArray(imageField) && imageField.length > 0) {
          // Airtable sometimes returns attachments as an array of objects
          imageUrl = imageField[0].url || '';
        }
      }
      
      return {
        text: record.get('Quote') as string,
        author: record.get('Person') as string,
        year: Number(record.get('Year')),
        url: record.get('URL') as string,
        bio: record.get('Bio') as string,
        image: imageUrl
      };
    });
    
    // Shuffle the quotes before returning
    return shuffleArray(quotes);
  } catch (error) {
    console.error('Airtable error:', error);
    throw error;
  }
}