import { Database } from 'supabase/types.ts';

export type Ticket = Database['public']['Tables']['tickets']['Row'];
export type TicketInsert = Database['public']['Tables']['tickets']['Insert'];
export type TicketPriority = Database['public']['Enums']['ticket_priority'];
export type TicketStatus = Database['public']['Enums']['ticket_status'];

interface PriorityOption {
  value: TicketPriority;
  label: string;
  color: string;
}

export const Priorities: PriorityOption[] = [
  { value: 'low', label: 'Low', color: 'bg-blue-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'critical', label: 'Critical', color: 'bg-red-600' },
];

export interface Company {
  id: number;
  name: string;
  created_at: string;
}

export interface AppUser {
  id: number;
  name: string;
  role: 'admin' | 'agent' | 'customer_manager' | 'customer';
}
