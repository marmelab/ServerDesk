import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import App from './App';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './components/error-fallback';
import { queryClient } from './lib/query-client';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => queryClient.resetQueries()}
    >
      <AuthProvider>
        <App />
        <Toaster position="bottom-right" richColors />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
