import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContext } from '@/contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';

interface StoryWrapperProps {
  children: React.ReactNode;
  mockData?: Record<string, any>;
  user?: any;
}

export function StoryWrapper({ children, mockData, user }: StoryWrapperProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  if (mockData) {
    Object.entries(mockData).forEach(([key, data]) => {
      // Inject data for given key (ex: ['agents'] ou ['companies'])
      queryClient.setQueryData([key], data);
    });
  }

  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={
            {
              user: user || null,
              isLoading: false,
              login: async () => ({}) as any,
              logout: async () => {},
            } as any
          }
        >
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>
  );
}
