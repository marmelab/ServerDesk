import { QueryObserverResult } from '@tanstack/react-query';
import { Button } from './ui/button';

interface ErrorViewProps {
  label: string;
  refetch: () => Promise<QueryObserverResult<any, any>>;
}

export default function ErrorView({ label, refetch }: ErrorViewProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h3 className="text-xl font-semibold italic">{label}</h3>
      <Button variant="outline" className="mt-6" onClick={() => refetch()}>
        Try again
      </Button>
    </div>
  );
}
