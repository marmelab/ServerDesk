import { Button } from '@/components/ui/button';

export function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold tracking-tight">
        Something went wrong
      </h2>
      <p className="text-muted-foreground max-w-md">
        {error?.message || 'An unexpected error crashed the application.'}
      </p>
      <div className="flex gap-2">
        <Button onClick={resetErrorBoundary}>Try again</Button>
        <Button variant="outline" onClick={() => (window.location.href = '/')}>
          Go to Home
        </Button>
      </div>
    </div>
  );
}
