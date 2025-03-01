import Airtable from 'airtable';
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } from '../config';

export interface Quote {
  text: string;
  author: string;
  year: number;
  url: string;
  bio: string;
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

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
    console.log('First record:', records[0]?.fields);

    return records.map(record => ({
      text: record.get('Quote') as string,
      author: record.get('Person') as string,
      year: Number(record.get('Year')),
      url: record.get('URL') as string,
      bio: record.get('Bio') as string
    }));
  } catch (error) {
    console.error('Airtable error:', error);
    throw error;
  }
}