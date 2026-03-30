import { useAuth } from '@/contexts/AuthContext';
import { useCustomers } from '@/hooks/useCustomers';
import CustomersView from './CustomersView';
import { useDeleteCustomer } from '@/hooks/useDeleteCustomer';
import { useUpdateCustomer } from '@/hooks/useUpdateCustomer';
import { Customer } from '@/types';

export default function CustomersPage() {
  const user = useAuth();

  const companyId = user?.user?.company_ids?.[0];
  const { customers, isPending, error, isPlaceholderData, refetch } =
    useCustomers(companyId);
  const { mutate: deleteMutate } = useDeleteCustomer();
  const { mutate: updateMutate } = useUpdateCustomer();

  const handleDelete = (customerId: number) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteMutate(customerId);
    }
  };

  const handleUpdate = (customer: Customer) => {
    updateMutate(customer);
  };

  if (!user || !user.user || user.user.company_ids.length === 0)
    return (
      <p className="text-muted-foreground p-10">
        You have no companies assigned, please contact administrator...
      </p>
    );

  if (isPending)
    return <p className="text-muted-foreground p-10">Loading...</p>;

  return (
    <CustomersView
      customers={customers}
      companyId={companyId!}
      isPending={isPending}
      error={error}
      isPlaceholderData={isPlaceholderData}
      refetch={refetch}
      onDeleteCustomer={handleDelete}
      onUpdateCustomer={handleUpdate}
    />
  );
}
