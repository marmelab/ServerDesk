import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { useCallback, useEffect, useState } from 'react';
import { useInviteManager } from '@/hooks/UseCreateToken';
import { AppUserRole } from '@/types';
import { InviteTokenDisplay } from './InviteTokenDisplay';
import { CompanyMultiSelect } from './CompanyMultiSelect';

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

  const handleGenerate = useCallback(
    async (ids: number[]) => {
      setStep('result');
      await createInvite({ company_id: ids, app_role: appRole });
    },
    [createInvite, appRole],
  );

  useEffect(() => {
    if (initialCompanyId) {
      createInvite({ company_id: [initialCompanyId], app_role: appRole });
    }
  }, [initialCompanyId, createInvite, appRole]);

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

            <Button onClick={() => handleGenerate(selectedIds)}>
              Generate Invite Link
            </Button>
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
