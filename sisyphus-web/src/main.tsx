import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/i18n/config.ts';
import '@/styles/index.css';
import { Toaster } from '@/components/ui/sonner.tsx';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './app/App.tsx';
import { queryClient } from './lib/react-query.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </QueryClientProvider>
    {/* Toaster를 하단에 두지 않으면 렌더링 될 때 html이 화면 전체를 덮어버림 */}
    <Toaster />
  </StrictMode>,
);
