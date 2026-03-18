import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { InviteDialog } from '@/components/InviteDialog';
import { fetchAgents } from '@/services/Agents';

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

  const handleOpenInvite = () => {
    setIsInviteOpen(true);
  };

  if (isPending)
    return <p className="text-muted-foreground p-10">Loading...</p>;

  const Header = (
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
  );

  return (
    <div className="container mx-auto py-10">
      {!queryError && (
        <div className="mx-auto max-w-7xl">
          {Header}
          {agents.length === 0 ? (
            <h2>No agents yet. Click 'Invite Agent' to get started.</h2>
          ) : (
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
                    <CardDescription>{agent.email}</CardDescription>
                  </CardHeader>

                  <CardFooter className="flex flex-row flex-wrap gap-2 pt-4">
                    {((agent.company_names as string[]) || []).map(
                      (companyName) => (
                        <Badge
                          key={companyName}
                          variant="secondary"
                          className="whitespace-nowrap"
                        >
                          {companyName}
                        </Badge>
                      ),
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
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
