import { Check, Copy, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export function InviteTokenDisplay({
  isGenerating,
  inviteToken,
}: {
  isGenerating: boolean;
  inviteToken: string | null;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (inviteToken) {
      try {
        await navigator.clipboard.writeText(inviteToken);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.message('Link copied');
      } catch (err) {
        console.error('Failed to copy!', err);
      }
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center py-6 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Generating link...</p>
      </div>
    );
  }

  if (!inviteToken) return null;

  return (
    <div className="flex items-center space-x-2">
      <Input readOnly value={inviteToken} className="font-mono text-xs" />
      <Button
        size="icon"
        onClick={handleCopy}
        disabled={!inviteToken}
        aria-label="Copy invite token"
        data-testid="button-copy"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
