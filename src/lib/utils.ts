import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

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

export function getInitials(name: string | undefined | null): string {
  if (!name) return 'U';

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export interface UseResourceData<TData, TResponse = TData> {
  data: TData;
  count?: number;
  isPending: boolean;
  error: Error | null;
  isPlaceholderData: boolean;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<TResponse, Error>>;
}
