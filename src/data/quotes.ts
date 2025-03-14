import Airtable from 'airtable';
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } from '../config';

export interface Quote {
  text: string;
  author: string;
  year: number;
  url: string;
  bio: string;
  image: string; // Changed from optional to required
  group: string;
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
function extractImageUrl(imageField: unknown): string {
  if (!imageField) return '';
  
  if (typeof imageField === 'string') {
    return imageField;
  } else if (Array.isArray(imageField) && imageField.length > 0) {
    // Airtable sometimes returns attachments as an array of objects
    const attachment = imageField[0] as { url?: string };
    return attachment.url || '';
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
        view: 'Grid view',
        returnFieldsByFieldId: true
      })
      .all();
    
    // Log the first record's fields to see what's available
    if (records.length > 0) {
      console.log('First record field names:', Object.keys(records[0].fields));
      // Uncomment to see full details: console.log('First record fields sample:', records[0].fields);
    }
    
    // Define field ID constants
    const FIELD_IDS = {
      QUOTE: 'fldCxgQmS602iTuI5',
      NAME: 'fldAew6lQ99g5qscS',
      URL: 'fldqmfM3I3P9QoxjJ',
      YEAR: 'fldKmiOa6DI3Z5pyy',
      BIO: 'fldap1YTquRRffQg2',
      GROUP: 'fldiEEAaSd9DCjUFA',
      IMAGE: 'fldjcaetyXZolccCc'
    };

    // Convert Airtable records to Quote objects and filter out incomplete quotes
    const quotes = records
      .map(record => {
        // Get the year and make sure it's a valid number
        const yearValue = record.fields[FIELD_IDS.YEAR];
        const year = yearValue ? Number(yearValue) : NaN;
        
        // Get group value directly from field ID
        let group: string = record.fields[FIELD_IDS.GROUP] as string || 'Uncategorized';
        if (typeof group === 'string') {
          group = group.trim();
        } else if (Array.isArray(group) && group.length > 0) {
          group = String(group[0]).trim();
        }
        
        // For debugging the first record only
        if (records.indexOf(record) === 0) {
          console.log(`First record - Available fields:`, Object.keys(record.fields));
        }
        
        const quote = {
          text: record.fields[FIELD_IDS.QUOTE] as string,
          author: record.fields[FIELD_IDS.NAME] as string,
          year: year,
          url: record.fields[FIELD_IDS.URL] as string,
          bio: record.fields[FIELD_IDS.BIO] as string,
          image: extractImageUrl(record.fields[FIELD_IDS.IMAGE]),
          group: group
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
    
    // Debug group distribution
    const groupCounts = new Map<string, number>();
    quotes.forEach(quote => {
      const group = quote.group || 'Uncategorized';
      groupCounts.set(group, (groupCounts.get(group) || 0) + 1);
    });
    
    console.log('Group distribution:');
    Array.from(groupCounts.entries()).forEach(([group, count]) => {
      console.log(`- ${group}: ${count} quotes`);
    });
    
    // Normalize group names by collecting all unique groups first
    const uniqueGroups = Array.from(new Set(quotes.map(q => q.group.toLowerCase())));
    
    // Create a mapping of normalized group names (lowercase) to their canonical form
    const groupMap = new Map<string, string>();
    
    uniqueGroups.forEach(normalizedGroup => {
      // Find the first occurrence of this group (case-insensitive) and use its original casing
      const canonicalGroup = quotes.find(q => q.group.toLowerCase() === normalizedGroup)?.group || normalizedGroup;
      groupMap.set(normalizedGroup, canonicalGroup);
    });
    
    // Normalize group names in all quotes
    const normalizedQuotes = quotes.map(quote => ({
      ...quote,
      group: groupMap.get(quote.group.toLowerCase()) || 'Uncategorized'
    }));
    
    // Shuffle the quotes before returning
    return shuffleArray(normalizedQuotes);
  } catch (error) {
    console.error('Error loading quotes from Airtable:', error);
    throw new Error('Failed to load quotes. Please try again later.');
  }
}