import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
if (!POSTHOG_KEY) {
  throw new Error('PostHog key is not defined in environment variables');
}

// Create the client instance with explicit token
const client = posthog.init(POSTHOG_KEY, {
  api_host: 'https://eu.i.posthog.com'
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={client}>
      <App />
    </PostHogProvider>
  </StrictMode>
);
