import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { type AgentDetails } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { InviteDialog } from '@/components/InviteDialog';

async function fetchAgents(): Promise<AgentDetails[]> {
  const { data, error } = await supabase.from('agent_details').select('*');
  if (error) {
    throw error;
  }
  return data || [];
}

export default function AgentsPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const {
    data: agents = [],
    isPending,
    error: queryError,
  } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });

  const handleOpenInvite = async () => {
    setIsInviteOpen(true);
  };

  if (isPending)
    return <p className="text-muted-foreground p-10">Loading...</p>;

  return (
    <div className="container mx-auto py-10">
      {!isPending && !queryError && (
        <div className="mx-auto max-w-7xl">
          <header className="flex w-full items-center justify-between mb-12">
            <div className="flex flex-col gap-1 text-left">
              <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
                Agents
              </h2>
              <p className="text-muted-foreground">
                Manage agents and their company assignments
              </p>
            </div>
            <Button
              className="group-hover:bg-primary group-hover:text-primary-foreground w-fit cursor-pointer"
              onClick={() => handleOpenInvite()}
            >
              <UserPlus className="ms-2 size-4" />
              Invite Agent
            </Button>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card
                key={agent.id}
                className="group relative flex flex-col gap-2 overflow-hidden pt-0"
              >
                <CardHeader className="flex-1 pt-4">
                  <CardTitle className="text-2xl font-semibold text-balance">
                    {agent.name}
                  </CardTitle>
                </CardHeader>

                <CardFooter className="flex-col items-start space-y-4 pt-4"></CardFooter>
              </Card>
            ))}
            {agents.length === 0 && <h2>No agents found.</h2>}
          </div>

          <InviteDialog
            open={isInviteOpen}
            onOpenChange={setIsInviteOpen}
            initialCompanyId={null}
            appRole={'agent'}
          />
        </div>
      )}
    </div>
  );
}
