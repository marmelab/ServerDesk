import { useCustomers } from '@/hooks/useCustomers';
import CompanyContactsView from './CompanyContactsView';
import { useCustomerManagers } from '@/hooks/useCustomerManagers';
import { AccordionContent } from '../ui/accordion';
import { CompanyContactError } from './CompanyContactError';
import CompanyContactPending from './CompanyContactPending';

interface CompanyContactsProps {
  companyId: number;
}

export default function CompanyContacts({ companyId }: CompanyContactsProps) {
  const { data, isPending, error, refetch } = useCustomers({
    companiesId: [companyId],
  });
  const {
    data: dataCM,
    isPending: isPendingCustomerManager,
    error: errorCustomerManager,
    refetch: refetchCustomerManager,
  } = useCustomerManagers(companyId);

  return (
    <AccordionContent>
      {(error || errorCustomerManager) && (
        <CompanyContactError
          errorCustomerManager={!!errorCustomerManager}
          refetch={refetch}
          refetchCustomerManager={refetchCustomerManager}
        />
      )}
      {(isPending || isPendingCustomerManager) && <CompanyContactPending />}
      {!isPending && !error && (
        <CompanyContactsView customerManagers={dataCM} customers={data} />
      )}
    </AccordionContent>
  );
}
