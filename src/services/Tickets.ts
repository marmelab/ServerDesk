import { supabase } from '@/lib/supabase';
import { TicketWithDetails } from '@/types';

export const PAGE_SIZE = 10;

export async function fetchTickets(
  companiesId?: number[] | null,
  page: number | null = null,
): Promise<{ data: TicketWithDetails[]; count: number }> {
  let query = supabase.from('tickets').select(
    `
      *, 
      company:companies(name),
      creator_user:app_user!customer_id(name),
      creator_contact:company_contacts!contact_id(name, email)
      `,
    { count: 'exact' },
  );

  if (companiesId && companiesId.length > 0) {
    query = query.in('company_id', companiesId);
  }

  query = query.order('updated_at', { ascending: false });

  if (page !== null) {
    query = query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
  }

  const { data, error, count } = await query;
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

export async function fetchTicket(
  ticketId: number,
): Promise<{ data: TicketWithDetails }> {
  const { data, error } = await supabase
    .from('tickets')
    .select(
      `
      *, 
      company:companies(name),
      creator_user:app_user!customer_id(name),
      creator_contact:company_contacts!contact_id(name, email)
      `,
    )
    .eq('id', ticketId)
    .single();
  if (error) throw error;
  if (!data) throw new Error('Ticket not found');

  const { creator_user, creator_contact, ...rest } = data;
  const baseCreator = creator_user || creator_contact;
  const transformedData: TicketWithDetails = {
    ...rest,
    creator: baseCreator
      ? {
          ...baseCreator,
          // Boolean to know if Ticket created by contact or customer_manager
          isInternal: !!creator_user,
          email: (creator_user as any)?.email ?? creator_contact?.email,
        }
      : null,
  };

  return {
    data: transformedData,
  };
}
