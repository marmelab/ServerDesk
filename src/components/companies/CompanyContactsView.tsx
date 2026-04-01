import { AppUser, Customer } from '@/types';
import { AccordionContent } from '../ui/accordion';
import { Button } from '../ui/button';
import { AlertCircle, Crown } from 'lucide-react';

interface CompanyContactsViewProps {
  customerManagers: AppUser[];
  customers: Customer[];
  isPending: boolean;
  error: any;
  errorCM: any;
  refetch: any;
  refetchCM: any;
}

export default function CompanyContactsView({
  customerManagers,
  customers,
  isPending,
  error,
  errorCM,
  refetch,
  refetchCM,
}: CompanyContactsViewProps) {
  return (
    <AccordionContent>
      {(error || errorCM) && (
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
              if (error) refetch();
              if (errorCM) refetchCM();
            }}
          >
            Retry
          </Button>
        </div>
      )}
      {isPending && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-1 rounded-full animate-pulse">
            Loading...
          </span>
        </div>
      )}
      {!isPending && !error && (
        <div>
          {customerManagers.map((customerManager) => (
            <div
              key={customerManager.id}
              className="flex items-center gap-3 font-semibold"
            >
              <span>{customerManager.name}</span>
              <Crown />
            </div>
          ))}
          {customers.map((customer) => (
            <div key={customer.id} className="flex gap-3 font-semibold">
              <span>{customer.name}</span>
            </div>
          ))}
        </div>
      )}
    </AccordionContent>
  );
}
