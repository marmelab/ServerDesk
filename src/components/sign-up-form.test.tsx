import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { supabase } from '@/lib/supabase';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SignUpForm } from './sign-up-form';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      signUp: vi.fn(),
    },
  },
}));

describe('SignupPage with Invite Token', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Show error when invalid token', async () => {
    const mockSupabase = vi.mocked(supabase.from);
    mockSupabase.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi
        .fn()
        .mockResolvedValue({
          data: null,
          error: { message: 'Token already used or invalid' },
        }),
    } as any);

    render(
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
          is: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'invit-123',
              company_id: '1',
              token: 'invit-123',
              companies: { name: 'acme' },
            },
            error: null,
          }),
        } as any;
      }
      return {} as any;
    });

    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: {} },
      error: null,
    } as any);

    // Simulate URL with token
    render(
      <MemoryRouter initialEntries={['/auth/signup?invite=invit-123']}>
        <Routes>
          <Route path="/auth/signup" element={<SignUpForm />} />
        </Routes>
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText(/name/i), 'new-manager');
    await user.type(screen.getByLabelText(/email/i), 'new-manager@test.com');
    await user.type(screen.getByLabelText(/^password/i), '123456');
    await user.type(screen.getByLabelText(/repeat password/i), '123456');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'new-manager@test.com',
      password: '123456',
      options: expect.objectContaining({
        data: expect.objectContaining({
          name: 'new-manager',
          company_id: '1',
          invite_token: 'invit-123',
        }),
      }),
    });

    expect(
      await screen.findByText(/thank you for signing up/i),
    ).toBeInTheDocument();
  });
});
