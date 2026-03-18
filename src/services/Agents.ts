import { supabase } from '@/lib/supabase';
import { AgentDetails } from '@/types';

export async function fetchAgents(): Promise<AgentDetails[]> {
  const { data, error } = await supabase.from('agent_details').select('*');
  if (error) {
    throw error;
  }
  return data || [];
}
