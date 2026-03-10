import { render, screen, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CompaniesPage from './companies';
import userEvent from '@testing-library/user-event';

let mockUser: any = null;
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('@/hooks/use_create_token', () => ({
  useInviteManager: vi.fn(() => ({
    createInvite: vi.fn(),
    isGenerating: false,
    inviteToken: 'http://localhost:5173/auth/signup?invite=mock-token-123',
    error: null,
    resetInvite: vi.fn(),
  })),
}));

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
    mockUser = { id: '1', role: 'admin', name: 'Boss' };
    const user = userEvent.setup();
    render(<CompaniesPage />, { wrapper: Wrapper });
    expect(await screen.findByText('Companies')).toBeInTheDocument();
    const inviteButton = await screen.findAllByRole('button', {
      name: /invite manager/i,
    });
    expect(inviteButton[0]).toBeInTheDocument();

    await user.click(inviteButton[0]);

    expect(
      await screen.findByRole('heading', { name: /invite link/i }),
    ).toBeInTheDocument();
    const inputInviteLink = await screen.findByDisplayValue(
      /signup\?invite=mock-token-123/i,
    );

    expect(inputInviteLink).toBeInTheDocument();
    expect(inputInviteLink).toHaveAttribute('readOnly');
  });

  it('Do not show Invite Manager button if user is not admin', async () => {
    mockUser = { id: '1', role: 'agent', name: 'Agent' };

    render(<CompaniesPage />, { wrapper: Wrapper });
    expect(await screen.findByText('Companies')).toBeInTheDocument();
    const inviteButton = screen.queryByRole('button', {
      name: /invite manager/i,
    });
    expect(inviteButton).not.toBeInTheDocument();
  });
});
