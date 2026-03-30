import { useCreateCustomer } from '@/hooks/useCreateCustomer';
import { useCustomerForm } from '@/hooks/useCustomerForm';
import AddCustomerDialogView from './AddCustomerDialogView';

interface AddCustomerDialogProps {
  companyId: number;
}

export default function AddCustomerDialog({
  companyId,
}: AddCustomerDialogProps) {
  const { mutateAsync: addCustomer } = useCreateCustomer();

  const form = useCustomerForm({
    companyId: companyId,
    addCustomer,
  });

  return <AddCustomerDialogView form={form} />;
}
