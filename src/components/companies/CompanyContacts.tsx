import { useCustomers } from '@/hooks/useCustomers';
import CompanyContactsView from './CompanyContactsView';
import { useCustomerManagers } from '@/hooks/useCustomerManagers';

interface CompanyContactsProps {
  companyId: number;
}

export default function CompanyContacts({ companyId }: CompanyContactsProps) {
  const { customers, isPending, error, refetch } = useCustomers({
    companiesId: [companyId],
  });
  const {
    customerManagers,
    isPending: isPendingCM,
    error: errorCM,
    refetch: refetchCM,
  } = useCustomerManagers(companyId);

  return (
    <CompanyContactsView
      customerManagers={customerManagers}
      customers={customers}
      isPending={isPending && isPendingCM}
      error={error}
      errorCM={errorCM}
      refetch={refetch}
      refetchCM={refetchCM}
    />
  );
}
