import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function clearAllUsers(supabaseAdmin: any) {
  let hasMore = true;
  let page = 1;

  while (hasMore) {
    const {
      data: { users },
      error: listError,
    } = await supabaseAdmin.auth.admin.listUsers({
      page: page,
      perPage: 50,
    });

    if (listError) throw listError;
    if (!users || users.length === 0) {
      hasMore = false;
      break;
    }

    const deletePromises = users.map((user: any) =>
      supabaseAdmin.auth.admin.deleteUser(user.id),
    );

    await Promise.all(deletePromises);

    // Default length is 50
    if (users.length < 50) {
      hasMore = false;
    } else {
      page++;
    }
  }
}
