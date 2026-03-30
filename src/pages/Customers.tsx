import { useAuth } from '@/contexts/AuthContext';
import { useCustomers } from '@/hooks/useCustomers';
import CustomersView from './CustomersView';
import { useDeleteCustomer } from '@/hooks/useDeleteCustomer';
import { useState } from 'react';
import { PAGE_SIZE } from '@/services/Customers';
import { PageHelper } from '@/components/PageHelper';
import { Button } from '@/components/ui/button';
import AddCustomerDialog from '@/components/customers/AddCustomerDialog';
import { Customer } from '@/types';

export default function CustomersPage() {
  const user = useAuth();
  const [page, setPage] = useState<number>(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const companyId = user?.user?.company_ids?.[0];
  const {
    customers,
    totalCount,
    isPending,
    error,
    isPlaceholderData,
    refetch,
  } = useCustomers(companyId, page);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const { mutate: deleteMutate } = useDeleteCustomer();

  const handleDelete = (customerId: number) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteMutate(customerId);
    }
  };

  const handleUpdate = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  if (!user || !user.user || user.user.company_ids.length === 0) {
    return (
      <p className="text-muted-foreground p-10">
        You have no companies assigned, please contact administrator.
      </p>
    );
  }

  if (isPending) {
    return <p className="text-muted-foreground p-10">Loading...</p>;
  }

  return (
    <div className="container mx-auto py-10">
      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-semibold italic">
            Failed to load customers
          </h3>
          <Button variant="outline" className="mt-6" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}
      {!isPending && !error && (
        <div className="mx-auto max-w-7xl">
          {selectedCustomer && (
            <AddCustomerDialog
              companyId={selectedCustomer.company_id}
              initialCustomer={selectedCustomer}
              onClose={() => setSelectedCustomer(null)}
              onSubmit={() => setSelectedCustomer(null)}
            />
          )}
          <CustomersView
            customers={customers}
            isPlaceholderData={isPlaceholderData}
            onDeleteCustomer={handleDelete}
            onUpdateCustomer={handleUpdate}
            renderCustomerDialog={() => (
              <AddCustomerDialog
                companyId={companyId!}
                initialCustomer={null}
              />
            )}
          />
          <PageHelper
            totalPages={totalPages}
            totalCount={totalCount}
            currentCount={customers.length}
            page={page}
            isPlaceholderData={isPlaceholderData}
            pageSize={PAGE_SIZE}
            setPage={setPage}
            label="customers"
          />
        </div>
      )}
    </div>
  );
}
