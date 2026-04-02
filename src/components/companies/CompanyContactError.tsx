import { QueryObserverResult } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface CompanyContactErrorProps {
  errorCustomerManager: boolean;
  refetch: () => Promise<QueryObserverResult<any, any>>;
  refetchCustomerManager: () => Promise<QueryObserverResult<any, any>>;
}

export function CompanyContactError({
  errorCustomerManager,
  refetch,
  refetchCustomerManager,
}: CompanyContactErrorProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 my-2 border border-destructive/50 bg-destructive/10 rounded-lg">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle />
        <span className="text-sm font-medium">Failed to load data</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-xs border border-destructive/20 hover:bg-destructive hover:text-white"
        onClick={() => {
          errorCustomerManager ? refetchCustomerManager() : refetch();
        }}
      >
        Retry
      </Button>
    </div>
  );
}
