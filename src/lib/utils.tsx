import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function clearAllUsers(supabaseAdmin: any) {
  while (true) {
    const {
      data: { users },
      error: listError,
    } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 50,
    });

    if (listError) throw listError;
    if (!users || users.length === 0) break;

    await Promise.all(
      users.map((user: any) => supabaseAdmin.auth.admin.deleteUser(user.id)),
    );
  }
}

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}
