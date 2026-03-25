import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentDetails, CompanyJson } from '@/types';
import { useState } from 'react';
import { Button } from './ui/button';
import { AssignCompaniesDialog } from '@/components/companies/AssignCompaniesDialog';

export default function AgentCard({
  agentInfos,
}: {
  agentInfos: AgentDetails;
}) {
  const [isAssignCompaniesOpen, setIsAssignCompaniesOpen] = useState(false);

  return (
    <Card
      key={agentInfos.id}
      className="group relative flex flex-col gap-2 overflow-hidden pt-0"
      data-testid="agent-card"
    >
      <CardHeader className="flex-1 pt-4">
        <CardTitle className="text-2xl font-semibold text-balance">
          {agentInfos.name}
        </CardTitle>
        <CardDescription>{agentInfos.email}</CardDescription>
      </CardHeader>

      <CardFooter className="flex flex-row flex-wrap gap-2 pt-4">
        {(agentInfos.companies as CompanyJson[])?.length > 0 ? (
          (agentInfos.companies as CompanyJson[]).map((company) => (
            <Badge
              key={company.name}
              variant="secondary"
              className="whitespace-nowrap"
            >
              {company.name}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">
            No companies assigned
          </span>
        )}
        <Button
          className="group-hover:bg-primary group-hover:text-primary-foreground w-full cursor-pointer"
          onClick={() => setIsAssignCompaniesOpen(true)}
        >
          Assign companies
          <svg
            className="ms-2 size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Button>
      </CardFooter>
      <AssignCompaniesDialog
        open={isAssignCompaniesOpen}
        onOpenChange={setIsAssignCompaniesOpen}
        agent={agentInfos}
      />
    </Card>
  );
}
