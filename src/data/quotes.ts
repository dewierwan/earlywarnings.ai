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
  priority?: string; // Changed back to string for single select field
}

// Initialize Airtable base
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

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
 * Load quotes from Airtable
 */
export async function loadQuotes(): Promise<Quote[]> {
  try {
    const records = await base(AIRTABLE_TABLE_NAME)
      .select({
        view: 'Grid view',
        returnFieldsByFieldId: true
      })
      .all();
    
    // Define field ID constants
    const FIELD_IDS = {
      QUOTE: 'fldCxgQmS602iTuI5',
      NAME: 'fldAew6lQ99g5qscS',
      URL: 'fldqmfM3I3P9QoxjJ',
      YEAR: 'fldKmiOa6DI3Z5pyy',
      BIO: 'fldap1YTquRRffQg2',
      GROUP: 'fldiEEAaSd9DCjUFA',
      IMAGE: 'fldjcaetyXZolccCc',
      PRIORITY: 'fldRB1gLcKIIE7DNB'
    };

    // Convert Airtable records to Quote objects and filter out incomplete quotes
    const quotes = records
      .map(record => {
        // Get the year and make sure it's a valid number
        const yearValue = record.fields[FIELD_IDS.YEAR];
        const year = yearValue ? Number(yearValue) : NaN;
        
        // Get group value directly from field ID
        const groupField = record.fields[FIELD_IDS.GROUP];
        let group = 'Uncategorized';
        
        if (typeof groupField === 'string') {
          group = groupField.trim();
        } else if (Array.isArray(groupField) && groupField.length > 0) {
          group = String(groupField[0]).trim();
        }
        
        // Process priority as a string value
        const priorityField = record.fields[FIELD_IDS.PRIORITY];
        let priority: string | undefined = undefined;
        
        if (priorityField !== undefined && priorityField !== null) {
          priority = String(priorityField);
        }
        
        // For debugging
        if (records.indexOf(record) === 0) {
          console.log('First record priority:', {
            raw: priorityField,
            parsed: priority,
            type: typeof priority
          });
        }
        
        return {
          text: record.fields[FIELD_IDS.QUOTE] as string,
          author: record.fields[FIELD_IDS.NAME] as string,
          year,
          url: record.fields[FIELD_IDS.URL] as string,
          bio: record.fields[FIELD_IDS.BIO] as string,
          image: extractImageUrl(record.fields[FIELD_IDS.IMAGE]),
          group,
          priority
        };
      })
      // Filter out quotes with missing fields
      .filter(quote => 
        Boolean(quote.text) && 
        Boolean(quote.author) && 
        !isNaN(quote.year) && 
        Boolean(quote.url) && 
        Boolean(quote.bio) && 
        Boolean(quote.image)
      );
    
    // Normalize groups
    const normalizedQuotes = normalizeGroups(quotes);
    
    return normalizedQuotes;
  } catch (error) {
    console.error('Error loading quotes from Airtable:', error);
    throw new Error('Failed to load quotes. Please try again later.');
  }
}

/**
 * Normalize group names across quotes
 */
function normalizeGroups(quotes: Quote[]): Quote[] {
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
  return quotes.map(quote => ({
    ...quote,
    group: groupMap.get(quote.group.toLowerCase()) || 'Uncategorized'
  }));
}