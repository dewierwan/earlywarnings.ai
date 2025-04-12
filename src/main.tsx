import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

// Debug log to check the value
console.log('PostHog Key:', import.meta.env.VITE_PUBLIC_POSTHOG_KEY);

// Initialize without throwing error
const client = posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY || 'phc_eu5ZY4jalD4ocBKecOXThX4Bt8fOYIEWvuVm3kExSy5', {
  api_host: 'https://eu.i.posthog.com'
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={client}>
      <App />
    </PostHogProvider>
  </StrictMode>
);
