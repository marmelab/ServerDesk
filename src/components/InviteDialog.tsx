import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
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
  const { createInvite, isGenerating, inviteToken, reset } = useInviteManager();

  const [selectedIds, setSelectedIds] = useState<number[]>(
    initialCompanyId ? [initialCompanyId] : [],
  );
  const [step, setStep] = useState<'selection' | 'result'>('selection');

  useEffect(() => {
    if (!open) {
      reset();
      setStep('selection');
      setSelectedIds(initialCompanyId ? [initialCompanyId] : []);
    } else if (initialCompanyId) {
      handleGenerate([initialCompanyId]);
    }
  }, [open, initialCompanyId]);

  const handleGenerate = async (ids: number[]) => {
    setStep('result');
    await createInvite({ company_id: ids, app_role: appRole });
  };

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
