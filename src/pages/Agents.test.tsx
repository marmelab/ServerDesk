import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import AgentsPage from './Agents';

// For shadcn components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const { mockSupabase } = vi.hoisted(() => {
  const agents = [
    {
      id: '1',
      name: 'AgentTest',
      email: 'agent@test.com',
      role: 'agent',
      company_names: ['looney'],
    },
  ];
  const companies = [
    { id: 1, name: 'acme' },
    { id: 2, name: 'looney' },
  ];

  const internalMock = {
    from: vi.fn((table) => ({
      select: vi.fn().mockImplementation(() => {
        if (table === 'agent_details') {
          return Promise.resolve({ data: agents, error: null });
        }
        if (table === 'companies') {
          return Promise.resolve({ data: companies, error: null });
        }
        return Promise.resolve({ data: [], error: null });
      }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { token: 'mock-token-123' },
            error: null,
          }),
        }),
      }),
      eq: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
    })),
  };

  return { mockSupabase: internalMock };
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

describe('AgentsPage', () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    cleanup();
    vi.clearAllMocks();
  });
  it('renders the list of agents', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AgentsPage />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('AgentTest')).toBeInTheDocument();
    expect(await screen.findByText('looney')).toBeInTheDocument();
    expect(screen.getByText('Agents')).toBeInTheDocument();
  });

  it('opens dialog and invite agent', async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={queryClient}>
        <AgentsPage />
      </QueryClientProvider>,
    );
    const buttonInviteAgent = await screen.findByRole('button', {
      name: /invite agent/i,
    });
    await user.click(buttonInviteAgent);

    const selectTrigger = await screen.findByText(/select companies/i);
    await user.click(selectTrigger);

    const companyOption = await screen.findByText('acme');
    await user.click(companyOption);

    const buttonGenerateLink = await screen.findByRole('button', {
      name: /generate/i,
    });
    await user.click(buttonGenerateLink);

    const inputInviteLink = await screen.findByDisplayValue(
      /signup\?invite=mock-token-123/i,
    );

    expect(inputInviteLink).toBeInTheDocument();
    expect(inputInviteLink).toHaveAttribute('readOnly');

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText(/generate/i)).not.toBeInTheDocument();
    });
  });
});
