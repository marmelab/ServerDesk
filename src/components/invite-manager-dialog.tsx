import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { Copy } from 'lucide-react';

interface InviteManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteToken: string | null;
  isGenerating: boolean;
}

export function InviteManagerDialog({
  inviteToken,
  open,
  onOpenChange,
  isGenerating,
}: InviteManagerDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (inviteToken) {
      navigator.clipboard.writeText(inviteToken);
      setCopied(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Link</DialogTitle>
          <DialogDescription>Copy and send this invite link.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Generating link...
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input
                  readOnly
                  value={inviteToken || ''}
                  className="font-mono text-xs"
                />
              </div>
              <Button size="icon" onClick={handleCopy} disabled={!inviteToken}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
