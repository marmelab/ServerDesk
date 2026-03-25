import { useMemo, useState } from 'react';
import { CompanyMultiSelect } from './CompanyMultiSelect';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { AgentDetails, Company } from '@/types';
import { useUpdateAgentCompanies } from '@/hooks/useAgents';

interface AssignCompaniesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: AgentDetails;
}
export function AssignCompaniesDialog({
  open,
  onOpenChange,
  agent,
}: AssignCompaniesDialogProps) {
  const finalCompaniesId = useMemo(
    () => ((agent?.companies as Pick<Company, 'id'>[]) ?? []).map((c) => c.id),
    [agent?.companies],
  );

  const [selectedIds, setSelectedIds] = useState<number[]>(finalCompaniesId);

  const { mutate, isPending } = useUpdateAgentCompanies({
    onSuccess: () => onOpenChange(false),
  });

  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-label="Assign companies dialog">
        <DialogHeader>
          <DialogTitle>Assign companies to agent {agent.name}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="space-y-4">
          <CompanyMultiSelect
            selectedIds={selectedIds}
            onChange={setSelectedIds}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              mutate({ agentId: agent.id!, companyIds: selectedIds })
            }
            disabled={isPending || !agent.id}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
