import { useAuth } from '@/contexts/AuthContext';
import { useCustomers } from '@/hooks/useCustomers';
import CustomersView from '../components/customers/CustomersView';
import { useDeleteCustomer } from '@/hooks/useDeleteCustomer';
import { useState } from 'react';
import { PAGE_SIZE } from '@/services/Customers';
import { Pagination } from '@/components/Pagination';
import AddCustomerDialog from '@/components/customers/AddCustomerDialog';
import { Customer } from '@/types';
import { DeleteCustomerDialog } from '@/components/customers/DeleteCustomerDialog';
import ErrorView from '@/components/ErrorView';
import PendingView from '@/components/PendingView';
import { Placeholder } from '@/components/Placeholder';

export default function CustomersPage() {
  const user = useAuth();
  const [page, setPage] = useState<number>(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );

  const companyId = user?.user?.company_ids?.[0];
  const { data, count, isPending, error, isPlaceholderData, refetch } =
    useCustomers({ companiesId: user?.user?.company_ids, page });
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  const { mutate: deleteMutate, isPending: isPendingDeletion } =
    useDeleteCustomer();

  const handleConfirmDelete = (customerId: number) => {
    deleteMutate(customerId, {
      onSuccess: () => setCustomerToDelete(null),
    });
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

  return (
    <div className="container mx-auto py-10">
      {error && (
        <ErrorView label="Failed to load customers" refetch={refetch} />
      )}
      {isPending && <PendingView label="Loading customers" />}
      {isPlaceholderData && <Placeholder />}
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
          <DeleteCustomerDialog
            customer={customerToDelete}
            onClose={() => setCustomerToDelete(null)}
            onConfirm={handleConfirmDelete}
            isDeleting={isPendingDeletion}
          />
          <CustomersView
            customers={data}
            isPlaceholderData={isPlaceholderData}
            onDeleteCustomer={setCustomerToDelete}
            onUpdateCustomer={handleUpdate}
            renderCustomerDialog={() => (
              <AddCustomerDialog
                companyId={companyId!}
                initialCustomer={null}
              />
            )}
          />
          <Pagination
            totalPages={totalPages}
            totalCount={count ?? 0}
            currentCount={data.length}
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
