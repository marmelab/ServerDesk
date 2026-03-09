import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import CompaniesPage from './companies';
import userEvent from '@testing-library/user-event';

let mockCompanies = [
  { id: 1, name: 'acme', created_at: '2026-02-25T00:00:00Z' },
];

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockImplementation(() =>
        Promise.resolve({
          data: mockCompanies,
          error: null,
        }),
      ),
      insert: vi.fn((newData) => {
        const record = Array.isArray(newData) ? newData[0] : newData;
        const newEntry = {
          id: Math.random(),
          name: record.name,
          created_at: new Date().toISOString(),
        };

        mockCompanies.push(newEntry);
        return Promise.resolve({ data: [newEntry], error: null });
      }),
    })),
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

  it('opens dialog and adds a new company to the list', async () => {
    const user = userEvent.setup();
    render(<CompaniesPage />, { wrapper: Wrapper });
    const buttonAddCompany = screen.getByRole('button', {
      name: /add company/i,
    });
    await user.click(buttonAddCompany);

    const inputCompanyName = await screen.findByRole('textbox', {
      name: /company/i,
    });
    expect(inputCompanyName).toBeInTheDocument();

    await user.type(inputCompanyName, 'New company');
    expect(inputCompanyName).toHaveValue('New company');

    const buttonInsertCompany = await screen.findByRole('button', {
      name: /add/i,
    });
    await user.click(buttonInsertCompany);

    expect(await screen.findByText('New company')).toBeInTheDocument();

    // Verify dialog is closed
    const dialogTitle = screen.queryByText(/add a new company/i);
    expect(dialogTitle).not.toBeInTheDocument();
  });
});
