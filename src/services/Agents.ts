import { supabase } from '@/lib/supabase';
import { AgentDetails } from '@/types';

export async function fetchAgents(): Promise<AgentDetails[]> {
  const { data, error } = await supabase.from('agent_details').select('*');
  if (error) {
    throw error;
  }
  return data || [];
}

export async function updateAgentCompanies(
  agentId: string,
  companyIds: number[],
) {
  await supabase.from('user_companies').delete().eq('user_id', agentId);

  if (companyIds.length > 0) {
    const inserts = companyIds.map((id) => ({
      user_id: agentId,
      company_id: id,
    }));
    const { error } = await supabase.from('user_companies').insert(inserts);
    if (error) throw error;
  }
}
