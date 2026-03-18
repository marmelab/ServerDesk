import { Copy, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function InviteTokenDisplay({
  isGenerating,
  inviteToken,
}: {
  isGenerating: boolean;
  inviteToken: string | null;
}) {
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
        onClick={() => navigator.clipboard.writeText(inviteToken)}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}
