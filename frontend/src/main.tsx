import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { LearnMateProvider } from './context/LearnMateContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LearnMateProvider>
      <App />
    </LearnMateProvider>
  </StrictMode>,
);
