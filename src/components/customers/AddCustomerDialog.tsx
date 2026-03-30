import { useCreateCustomer } from '@/hooks/useCreateCustomer';
import { useCustomerForm } from '@/hooks/useCustomerForm';
import AddCustomerDialogView from './AddCustomerDialogView';
import { Customer } from '@/types';
import { useUpdateCustomer } from '@/hooks/useUpdateCustomer';

interface AddCustomerDialogProps {
  companyId: number;
  initialCustomer: Customer | null;
  onClose?: () => void;
  onSubmit?: () => void;
}

export default function AddCustomerDialog({
  companyId,
  initialCustomer,
  onClose,
  onSubmit,
}: AddCustomerDialogProps) {
  const { mutateAsync: addCustomer } = useCreateCustomer();
  const { mutateAsync: updateCustomer } = useUpdateCustomer();

  const form = useCustomerForm({
    companyId,
    initialCustomer,
    handleCustomer: initialCustomer ? updateCustomer : addCustomer,
  });

  return (
    <AddCustomerDialogView
      form={form}
      isUpdate={!!initialCustomer}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
