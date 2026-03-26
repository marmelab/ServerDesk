import { supabase } from '@/lib/supabase';
import { TicketWithDetails } from '@/types';

export const PAGE_SIZE = 10;

export async function fetchTickets(
  page: number,
): Promise<{ data: TicketWithDetails[]; count: number }> {
  const { data, error, count } = await supabase
    .from('tickets')
    .select(
      `
      *, 
      company:companies(name),
      creator_user:app_user!customer_id(name),
      creator_contact:company_contacts!contact_id(name, email)
      `,
      { count: 'exact' },
    )
    .order('updated_at', { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
  if (error) throw error;

  const transformedData: TicketWithDetails[] = (data || []).map(
    (ticket: any) => {
      const { creator_user, creator_contact, ...rest } = ticket;

      const baseCreator = creator_user || creator_contact;
      return {
        ...rest,
        creator: baseCreator
          ? {
              ...baseCreator,
              // Boolean to know if Ticket created by contact or customer_manager
              isInternal: !!creator_user,
              email: creator_user?.auth_user?.email ?? creator_contact?.email,
            }
          : null,
      };
    },
  );

  return {
    data: transformedData,
    count: count || 0,
  };
}
