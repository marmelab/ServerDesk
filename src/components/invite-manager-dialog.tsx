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
    error: string | null;
}

export function InviteManagerDialog({
    inviteToken,
    open,
    onOpenChange,
    isGenerating,
    error,
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
                    ) : error ? (
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                            <p className="text-sm text-destructive font-medium">Error</p>
                            <p className="text-xs text-destructive/80">{error}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 w-full"
                                onClick={() => onOpenChange(false)}
                            >
                                Close
                            </Button>
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
