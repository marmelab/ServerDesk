import { useMemo, useState } from 'react';
import { CompanyMultiSelect } from './CompanyMultiSelect';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateAgentCompanies } from '@/services/Agents';
import { AgentDetails } from '@/types';

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
    () =>
      ((agent?.companies as { id: number; name: string }[]) ?? []).map(
        (c) => c.id,
      ),
    [agent?.id],
  );

  const [currentAgentId, setCurrentAgentId] = useState<string | null>(
    agent?.id,
  );
  const [selectedIds, setSelectedIds] = useState<number[]>(finalCompaniesId);

  const queryClient = useQueryClient();

  const { mutate: handleSave, isPending } = useMutation({
    mutationFn: () => {
      if (!agent?.id) throw new Error('Agent ID is required');
      return updateAgentCompanies(agent.id, selectedIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      onOpenChange(false);
      toast.success('Companies assigned successfully!');
    },
  });

  if (currentAgentId != agent.id) {
    setCurrentAgentId(agent.id);
    setSelectedIds(finalCompaniesId);
  }

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
            onClick={() => handleSave()}
            disabled={isPending || !agent.id}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
