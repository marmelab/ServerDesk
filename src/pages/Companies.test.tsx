import { render, screen, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CompaniesPage from './Companies';
import userEvent from '@testing-library/user-event';
import { TicketStatus } from '@/types';

const { mockSupabase, mockState, utils } = vi.hoisted(() => {
  interface MockTicket {
    status: TicketStatus;
  }

  const internalState = {
    companies: [
      {
        id: 1,
        name: 'acme',
        created_at: '2026-02-25T00:00:00Z',
        tickets: [] as MockTicket[],
      },
    ],
    user: null as any,
  };

  const supabaseMock = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockImplementation(function (this: any, newData) {
      const dataToInsert = Array.isArray(newData) ? newData[0] : newData;
      const newEntry = {
        id: Math.random(),
        name: dataToInsert?.name || 'New Company',
        created_at: new Date().toISOString(),
        tickets: [],
      };
      internalState.companies.push(newEntry);
      return this;
    }),
    single: vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ data: { token: 'mock-token-123' }, error: null }),
      ),
    then: vi.fn().mockImplementation(function (this: any, onFulfilled) {
      const result = {
        data: [...internalState.companies],
        count: internalState.companies.length,
        error: null,
      };
      return Promise.resolve(result).then(onFulfilled);
    }),
  };

  return {
    mockSupabase: supabaseMock,
    mockState: internalState,
    utils: {
      reset: () => {
        internalState.companies = [
          {
            id: 1,
            name: 'acme',
            created_at: '2026-02-25T00:00:00Z',
            tickets: [],
          },
        ];
        internalState.user = null;
      },
    },
  };
});

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockState.user,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

let queryClient: QueryClient;

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('CompaniesPage', () => {
  beforeEach(() => {
    utils.reset();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
    });
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

    expect(
      await screen.findByText('New company', {}, { timeout: 3000 }),
    ).toBeInTheDocument();

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
      name: /assign/i,
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

  it('show correct status', async () => {
    mockState.companies[0].tickets = [
      { status: 'open' },
      { status: 'open' },
      { status: 'closed' },
    ];

    render(<CompaniesPage />, { wrapper: Wrapper });

    const openBadge = await screen.findByText(/open/i);
    expect(openBadge).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
