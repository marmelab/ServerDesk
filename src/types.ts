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
