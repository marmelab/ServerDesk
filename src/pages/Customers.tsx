import { useAuth } from '@/contexts/AuthContext';
import { useCustomers } from '@/hooks/useCustomers';
import CustomersView from './CustomersView';
import { useDeleteCustomer } from '@/hooks/useDeleteCustomer';
import { useState } from 'react';
import { PAGE_SIZE } from '@/services/Customers';
import { PageHelper } from '@/components/PageHelper';

export default function CustomersPage() {
  const user = useAuth();
  const [page, setPage] = useState<number>(0);

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

  if (!user || !user.user || user.user.company_ids.length === 0)
    return (
      <p className="text-muted-foreground p-10">
        You have no companies assigned, please contact administrator...
      </p>
    );

  if (isPending)
    return <p className="text-muted-foreground p-10">Loading...</p>;

  return (
    <>
      <CustomersView
        customers={customers}
        companyId={companyId!}
        isPending={isPending}
        error={error}
        isPlaceholderData={isPlaceholderData}
        refetch={refetch}
        onDeleteCustomer={handleDelete}
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
    </>
  );
}
