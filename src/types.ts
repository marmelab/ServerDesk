import { Database } from 'supabase/types.ts';

// Tickets
export type Ticket = Database['public']['Tables']['tickets']['Row'];
export type TicketInsert = Database['public']['Tables']['tickets']['Insert'];
export type TicketPriority = Database['public']['Enums']['ticket_priority'];
export type TicketStatus = Database['public']['Enums']['ticket_status'];

interface PriorityOption {
  value: TicketPriority;
  label: string;
  color: string;
}
// For Tailwind : bg-green-500, bg-amber-500, bg-orange-500, bg-red-600
export const Priorities: PriorityOption[] = [
  { value: 'low', label: 'Low', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'critical', label: 'Critical', color: 'bg-red-600' },
];

interface StatusOption {
  value: TicketStatus;
  label: string;
  color: string;
}
// For Tailwind : bg-teal-500, bg-blue-500, bg-gray-600
export const Statuses: StatusOption[] = [
  { value: 'open', label: 'Open', color: 'bg-teal-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  {
    value: 'waiting_on_customer',
    label: 'Waiting on Customer',
    color: 'bg-amber-500',
  },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-600' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-600' },
];

// Companies
export type Company = Database['public']['Tables']['companies']['Row'];
export type CompanyInsert = Database['public']['Tables']['companies']['Insert'];

// User
export type AppUser = Database['public']['Tables']['app_user']['Row'];

export type AppUserRole = Database['public']['Enums']['app_role'];
