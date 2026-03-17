import { render, screen, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CompaniesPage from './companies';
import userEvent from '@testing-library/user-event';

const { mockSupabase } = vi.hoisted(() => {
  const companies = [
    { id: 1, name: 'acme', created_at: '2026-02-25T00:00:00Z' },
  ];

  const internalMock = {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockImplementation((newData) => {
      const dataToInsert = Array.isArray(newData) ? newData[0] : newData;
      if (dataToInsert?.name) {
        companies.push({
          id: Math.random(),
          name: dataToInsert.name,
          created_at: new Date().toISOString(),
        });
      }
      return Object.assign(
        Promise.resolve({ data: dataToInsert, error: null }),
        internalMock,
      );
    }),
    select: vi.fn().mockImplementation((columns) => {
      if (columns === 'token') return internalMock;
      return Promise.resolve({ data: companies, error: null });
    }),
    single: vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ data: { token: 'mock-token-123' }, error: null }),
      ),
    match: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
  };

  return { mockSupabase: internalMock, mockCompanies: companies };
});

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));

const { mockState } = vi.hoisted(() => ({
  mockState: { user: null as any },
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockState.user,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, gcTime: 0 } },
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('CompaniesPage', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });
  it('renders the list of companies', async () => {
    render(<CompaniesPage />, { wrapper: Wrapper });

    expect(await screen.findByText('acme')).toBeInTheDocument();
    expect(screen.getByText('Companies')).toBeInTheDocument();
  });

  it('opens dialog and adds a new company to the list', async () => {
    const user = userEvent.setup();
    render(<CompaniesPage />, { wrapper: Wrapper });
    const buttonAddCompany = await screen.findByRole('button', {
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

  it('Show Invite Manager button only if user is admin', async () => {
    mockState.user = { id: '1', role: 'admin', name: 'Boss' };
    const user = userEvent.setup();
    render(<CompaniesPage />, { wrapper: Wrapper });
    expect(await screen.findByText('Companies')).toBeInTheDocument();
    const inviteButton = await screen.findAllByRole('button', {
      name: /invite manager/i,
    });
    expect(inviteButton[0]).toBeInTheDocument();

    await user.click(inviteButton[0]);

    expect(
      await screen.findByRole('heading', { name: /invite /i }),
    ).toBeInTheDocument();
    const inputInviteLink = await screen.findByDisplayValue(
      /signup\?invite=mock-token-123/i,
    );

    expect(inputInviteLink).toBeInTheDocument();
    expect(inputInviteLink).toHaveAttribute('readOnly');
  });

  it('Do not show Invite Manager button if user is not admin', async () => {
    mockState.user = { id: '1', role: 'agent', name: 'Agent' };

    render(<CompaniesPage />, { wrapper: Wrapper });
    expect(await screen.findByText('Companies')).toBeInTheDocument();
    const inviteButton = screen.queryByRole('button', {
      name: /invite manager/i,
    });
    expect(inviteButton).not.toBeInTheDocument();
  });
});
