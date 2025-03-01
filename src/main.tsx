import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Base URL:', import.meta.env.BASE_URL);
console.log('Current Path:', window.location.pathname);
console.log('Script Path:', document.currentScript?.getAttribute('src'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
