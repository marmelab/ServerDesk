import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { supabase } from '@/lib/supabase';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SignUpForm } from './sign-up-form';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      signUp: vi.fn(),
    },
  },
}));

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe('SignupPage with Invite Token', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Show error when invalid token', async () => {
    const mockSupabase = vi.mocked(supabase.from);
    mockSupabase.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Token already used or invalid' },
      }),
    } as any);

    renderWithProviders(
      <MemoryRouter initialEntries={['/auth/signup?invite=wrong-token']}>
        <SignUpForm />
      </MemoryRouter>,
    );

    const errorMessage = await screen.findByText(/invalid token/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('Show signup with valid token', async () => {
    const user = userEvent.setup();

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'invite_tokens') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          gt: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              id: 'invit-123',
              metadata: { company_id: [1], app_role: 'customer_manager' },
              token: 'invit-123',
            },
            error: null,
          }),
        } as any;
      }
      if (table === 'companies') {
        return {
          select: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          then: (resolve: any) =>
            resolve({
              data: [{ name: 'acme' }],
              error: null,
            }),
        } as any;
      }

      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      } as any;
    });

    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: {} },
      error: null,
    } as any);

    // Simulate URL with token
    renderWithProviders(
      <MemoryRouter initialEntries={['/auth/signup?invite=invit-123']}>
        <Routes>
          <Route path="/auth/signup" element={<SignUpForm />} />
        </Routes>
      </MemoryRouter>,
    );

    const roleInput = await screen.findByLabelText(/role/i);
    await waitFor(
      () => {
        expect(roleInput).toHaveValue('Customer Manager');
      },
      { timeout: 2000 },
    );

    await user.type(screen.getByLabelText(/name/i), 'new-manager');
    await user.type(screen.getByLabelText(/email/i), 'new-manager@test.com');
    await user.type(screen.getByLabelText(/^password/i), '123456');
    await user.type(screen.getByLabelText(/repeat password/i), '123456');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(supabase.auth.signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'new-manager@test.com',
        password: '123456',
        options: expect.objectContaining({
          data: expect.objectContaining({
            name: 'new-manager',
            invite_token: 'invit-123',
          }),
          emailRedirectTo: expect.stringContaining('/auth/login'),
        }),
      }),
    );

    expect(
      await screen.findByText(/thank you for signing up/i),
    ).toBeInTheDocument();
  });
});
