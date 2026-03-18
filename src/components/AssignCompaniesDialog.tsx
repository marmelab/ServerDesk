import { useEffect, useState } from 'react';
import { CompanyMultiSelect } from './CompanyMultiSelect';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface AssignCompaniesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string | null;
  initialCompanies: number[];
}

export function AssignCompaniesDialog({
  open,
  onOpenChange,
  agentId,
  initialCompanies,
}: AssignCompaniesDialogProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (open) {
      setSelectedIds(initialCompanies);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-label="Assign companies dialog">
        <DialogHeader>
          <DialogTitle>Assign companies to agent {agentId}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="space-y-4">
          <CompanyMultiSelect
            selectedIds={selectedIds}
            onChange={setSelectedIds}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
