# AI Early Warnings - Coding Guidelines

## Project Commands
- `npm run dev` - Start development server
- `npm run build` - Build production-ready application
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Code Style Guidelines
- **TypeScript**: Use strict typing with interfaces for data structures
- **React**: Functional components with hooks (useState, useEffect, useLayoutEffect)
- **Styling**: Tailwind CSS with dark mode support
- **Imports**: Group imports by external packages, then internal modules
- **Error Handling**: Use try/catch with console.error for logging
- **Naming**: 
  - camelCase for variables, functions, methods
  - PascalCase for components, interfaces, types
  - ALL_CAPS for constants

## Component Architecture
- Small, reusable components in src/components/
- Data fetching and transformation in src/data/
- Configuration values in src/config.ts (and config.prod.ts)
- Extensive use of TypeScript interfaces for type safety

## Best Practices
- Handle dark/light mode theming consistently
- Use responsive design principles and mobile-first approach
- Implement proper error handling for API calls
- Preserve user preferences with localStorage/sessionStorage
- Use ReactDOM.createRoot for modern React rendering