import { Database, Enums, Tables } from 'supabase/types.ts';

// User
export type AppUser = Tables<'app_user'>;

interface AppRoleOption {
  value: AppUserRole;
  label: string;
}

export const AppRoles: AppRoleOption[] = [
  { value: 'admin', label: 'Administrator' },
  { value: 'agent', label: 'Agent' },
  { value: 'customer_manager', label: 'Customer Manager' },
  { value: 'customer', label: 'Customer' },
];

export type AppUserRole = Enums<'app_role'>;

// Tickets
export type Ticket = Tables<'tickets'>;
export type TicketInsert = Database['public']['Tables']['tickets']['Insert'];
export type TicketPriority = Database['public']['Enums']['ticket_priority'];
export type TicketStatus = Database['public']['Enums']['ticket_status'];
export type TicketWithDetails = Ticket & {
  company: { name: string } | null;
  creator: { name: string; email: string; isInternal: boolean } | null;
};

export type Message = Tables<'messages'>;
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
export type MessageWithDetails = Message & {
  sender: { name: string; role: AppUserRole | null } | null;
};

interface PriorityOption {
  value: TicketPriority;
  label: string;
  color: string;
}
// For Tailwind : bg-green-500, bg-amber-500, bg-orange-500, bg-red-600
export const PRIORITY_MAP: Record<TicketPriority, PriorityOption> = {
  low: { value: 'low', label: 'Low', color: 'bg-green-500' },
  medium: { value: 'medium', label: 'Medium', color: 'bg-amber-500' },
  high: { value: 'high', label: 'High', color: 'bg-orange-500' },
  critical: { value: 'critical', label: 'Critical', color: 'bg-red-600' },
};

interface StatusOption {
  value: TicketStatus;
  label: string;
  color: string;
}
// For Tailwind : bg-teal-500, bg-blue-500, bg-gray-600
export const STATUS_MAP: Record<TicketStatus, StatusOption> = {
  open: { value: 'open', label: 'Open', color: 'bg-teal-500' },
  in_progress: {
    value: 'in_progress',
    label: 'In Progress',
    color: 'bg-blue-500',
  },
  waiting_on_customer: {
    value: 'waiting_on_customer',
    label: 'Waiting on Customer',
    color: 'bg-amber-500',
  },
  resolved: { value: 'resolved', label: 'Resolved', color: 'bg-green-500' },
  closed: { value: 'closed', label: 'Closed', color: 'bg-gray-500' },
};

// Companies
export type Company = Tables<'companies'>;
export type CompanyInsert = Database['public']['Tables']['companies']['Insert'];

export type AgentDetails = Tables<'agent_details'>;

export type CompanyJson = { id: number; name: string };

export type InviteToken = Tables<'invite_tokens'>;
export type InviteTokenInsert =
  Database['public']['Tables']['invite_tokens']['Insert'];

export type CompanyContacts = Tables<'company_contacts'>;

export type Customer = Tables<'company_contacts'>;
export type CustomerInsert =
  Database['public']['Tables']['company_contacts']['Insert'];
