import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import TicketsPage from './Tickets';

const mockUser: any = {
  id: '1',
  email: 'test@test.com',
  role: 'customer_manager',
  company_ids: [1],
};
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

const mockTickets = [
  {
    id: 1,
    created_at: '2026-02-25T00:00:00Z',
    updated_at: '2026-02-25T00:00:00Z',
    company_id: 1,
    subject: 'First Ticket',
    description: 'First ticket description',
    customer_id: '1',
    status: 'open',
    priority: 'medium',
  },
];

vi.mock('@/lib/supabase', () => {
  const mockFrom = {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    then: vi.fn().mockImplementation((onFulfilled) => {
      return Promise.resolve(
        onFulfilled({
          data: mockTickets,
          error: null,
          count: mockTickets.length,
        }),
      );
    }),

    insert: vi.fn().mockImplementation((newData) => {
      const record = Array.isArray(newData) ? newData[0] : newData;
      const newEntry = {
        ...record,
        id: Math.random(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'open',
      };

      mockTickets.push(newEntry);
      return Promise.resolve({ data: [newEntry], error: null });
    }),
  };

  return {
    supabase: {
      from: vi.fn(() => mockFrom),
    },
  };
});

function Wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('TicketsPage', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });
  it('renders the list of tickets', async () => {
    render(<TicketsPage />, { wrapper: Wrapper });

    expect(await screen.findByText('First Ticket')).toBeInTheDocument();
    expect(screen.getByText('Tickets')).toBeInTheDocument();
  });

  it('opens dialog and adds a new ticket to the list', async () => {
    mockUser.role = 'customer_manager';
    const user = userEvent.setup();
    render(<TicketsPage />, { wrapper: Wrapper });
    const buttonAddTicket = await screen.findByRole('button', {
      name: /add ticket/i,
    });
    await user.click(buttonAddTicket);

    const inputTicketSubject = await screen.findByRole('textbox', {
      name: /subject/i,
    });
    expect(inputTicketSubject).toBeInTheDocument();

    await user.type(inputTicketSubject, 'Second Ticket');
    expect(inputTicketSubject).toHaveValue('Second Ticket');

    const inputTicketDescription = await screen.findByRole('textbox', {
      name: /description/i,
    });
    expect(inputTicketDescription).toBeInTheDocument();

    await user.type(inputTicketDescription, 'Second Ticket Description');
    expect(inputTicketDescription).toHaveValue('Second Ticket Description');

    const selectTicketPriority = await screen.findByRole('combobox', {
      name: /priority/i,
    });
    expect(selectTicketPriority).toBeInTheDocument();

    await user.click(selectTicketPriority);
    const optionLow = await screen.findByRole('option', { name: /low/i });
    await user.click(optionLow);
    expect(selectTicketPriority).toHaveTextContent(/low/i);

    const buttonInsertTicket = await screen.findByRole('button', {
      name: /add/i,
    });
    await user.click(buttonInsertTicket);

    const newTicket = await screen.findByText(
      'Second Ticket',
      {},
      { timeout: 3000 },
    );
    expect(newTicket).toBeInTheDocument();

    // Verify dialog is closed
    await waitFor(() => {
      expect(screen.queryByText(/add a new ticket/i)).not.toBeInTheDocument();
    });
  }, 10000);
});
