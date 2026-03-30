import { Customer } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import CustomerSummary from '@/components/customers/CustomerSummary';
import AddCustomerDialog from '@/components/customers/AddCustomerDialog';

interface CustomersViewProps {
  customers: Customer[];
  companyId: number;
  isPending: boolean;
  error: any;
  isPlaceholderData: boolean;
  refetch: any;
  onDeleteCustomer: any;
  onUpdateCustomer: any;
}

export default function CustomersView({
  customers,
  companyId,
  isPending,
  error,
  isPlaceholderData,
  refetch,
  onDeleteCustomer,
  onUpdateCustomer,
}: CustomersViewProps) {
  return (
    <div className="container mx-auto py-10">
      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-semibold italic">
            Failed to load tickets
          </h3>
          <Button variant="outline" className="mt-6" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}
      {!isPending && !error && (
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="Customers"
            description="View and manage all customers."
          >
            <AddCustomerDialog companyId={companyId} />
          </PageHeader>
          <div className="rounded-md border bg-card">
            {isPlaceholderData && (
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-1 rounded-full animate-pulse">
                  Updating...
                </span>
              </div>
            )}
            <Table
              className={
                isPlaceholderData
                  ? 'opacity-50 transition-opacity'
                  : 'transition-opacity'
              }
            >
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <CustomerSummary
                    key={customer.id}
                    customer={customer}
                    onSelect={onUpdateCustomer}
                    onDelete={onDeleteCustomer}
                  />
                ))}
                {customers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p className="text-lg font-medium">
                          No customers found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      ;
    </div>
  );
}
