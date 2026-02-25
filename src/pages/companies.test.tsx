import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import CompaniesPage from './companies';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () =>
        Promise.resolve({
          data: [{ id: 1, name: 'acme', created_at: '2026-02-25T00:00:00Z' }],
          error: null,
        }),
    }),
  },
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('CompaniesPage', () => {
  it('renders the list of companies', async () => {
    render(<CompaniesPage />, { wrapper: Wrapper });

    expect(await screen.findByText('acme')).toBeInTheDocument();
    expect(screen.getByText('Companies')).toBeInTheDocument();
  });
});
