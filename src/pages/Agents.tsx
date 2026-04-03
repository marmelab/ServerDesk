import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { InviteDialog } from '@/components/InviteDialog';
import AgentCard from '@/components/AgentCard';
import { PageHeader } from '@/components/PageHeader';
import { useAgents } from '@/hooks/useAgents';
import ErrorView from '@/components/ErrorView';
import PendingView from '@/components/PendingView';
import { Placeholder } from '@/components/Placeholder';

export default function AgentsPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const {
    data: agents = [],
    isPending,
    error: queryError,
    refetch,
    isPlaceholderData,
  } = useAgents();

  const handleOpenInvite = () => {
    setIsInviteOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      {queryError && (
        <ErrorView label="Failed to load agents" refetch={refetch} />
      )}
      {isPending && <PendingView label="Loading agents" />}
      {isPlaceholderData && <Placeholder />}
      {!isPending && !queryError && (
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="Agents"
            description="Manage agents and their company assignments"
          >
            <Button
              className="group-hover:bg-primary group-hover:text-primary-foreground w-fit cursor-pointer"
              onClick={() => handleOpenInvite()}
            >
              <UserPlus className="ms-2 size-4" />
              Invite Agent
            </Button>
          </PageHeader>
          {agents.length === 0 ? (
            <h2>No agents yet. Click 'Invite Agent' to get started.</h2>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agentInfos={agent} />
              ))}
            </div>
          )}
          <InviteDialog
            key={isInviteOpen ? `open` : 'closed'}
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
