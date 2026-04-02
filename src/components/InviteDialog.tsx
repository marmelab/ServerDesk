import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { useCallback, useEffect, useState } from 'react';
import { useInviteManager } from '@/hooks/useCreateToken';
import { AppUserRole } from '@/types';
import { InviteTokenDisplay } from './InviteTokenDisplay';
import { CompanyMultiSelect } from './companies/CompanyMultiSelect';

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCompanyId: number | null;
  appRole: AppUserRole;
}

export function InviteDialog({
  open,
  onOpenChange,
  initialCompanyId,
  appRole,
}: InviteDialogProps) {
  const { createInvite, isGenerating, inviteToken } = useInviteManager();

  const [selectedIds, setSelectedIds] = useState<number[]>(
    initialCompanyId ? [initialCompanyId] : [],
  );
  const [step, setStep] = useState<'selection' | 'result'>(
    initialCompanyId ? 'result' : 'selection',
  );

  const handleGenerate = useCallback(async () => {
    setStep('result');
    await createInvite({ company_id: selectedIds, app_role: appRole });
  }, [createInvite, appRole, selectedIds]);

  useEffect(() => {
    if (open && initialCompanyId) {
      createInvite({ company_id: [initialCompanyId], app_role: appRole });
    }
  }, [open, initialCompanyId, appRole, createInvite]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-label="Invite dialog">
        <DialogHeader>
          <DialogTitle>
            Invite {appRole === 'agent' ? 'Agent' : 'Customer Manager'}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        {step === 'selection' && !initialCompanyId ? (
          <div className="space-y-4">
            <CompanyMultiSelect
              selectedIds={selectedIds}
              onChange={setSelectedIds}
            />

            <Button onClick={handleGenerate}>Generate Invite Link</Button>
          </div>
        ) : (
          <InviteTokenDisplay
            isGenerating={isGenerating}
            inviteToken={inviteToken}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
