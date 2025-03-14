# AI Early Warnings

A curated collection of quotes about AI risks and safety concerns from researchers, industry leaders, and experts. This responsive web application displays quotes in an elegant masonry layout with dark mode support.

![AI Early Warnings Screenshot](https://placehold.co/600x400?text=AI+Early+Warnings+Screenshot)

## Features

- Responsive masonry layout
- Dark mode / light mode toggle
- Quote detail view with author information
- Mobile-friendly design
- Integration with Airtable for content management

## Technology Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Airtable API for data storage

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ai-safety-quotes.git
   cd ai-safety-quotes
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `src/config.ts` file with your Airtable credentials:
   ```typescript
   export const AIRTABLE_API_KEY = 'your_api_key';
   export const AIRTABLE_BASE_ID = 'your_base_id';
   export const AIRTABLE_TABLE_NAME = 'your_table_name';
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Build for production:
   ```
   npm run build
   ```

## Airtable Schema

The Airtable base should have the following fields:
- Quote (text)
- Person (text)
- Year (number)
- URL (url)
- Bio (text)
- Image (attachment)

## License

MIT