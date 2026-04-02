import { useCustomers } from '@/hooks/useCustomers';
import CompanyContactsView from './CompanyContactsView';
import { useCustomerManagers } from '@/hooks/useCustomerManagers';

interface CompanyContactsProps {
  companyId: number;
}

export default function CompanyContacts({ companyId }: CompanyContactsProps) {
  const { data, isPending, error, refetch } = useCustomers({
    companiesId: [companyId],
  });
  const {
    data: dataCM,
    isPending: isPendingCM,
    error: errorCM,
    refetch: refetchCM,
  } = useCustomerManagers(companyId);

  return (
    <CompanyContactsView
      customerManagers={dataCM}
      customers={data}
      isPending={isPending && isPendingCM}
      error={error}
      errorCM={errorCM}
      refetch={refetch}
      refetchCM={refetchCM}
    />
  );
}
