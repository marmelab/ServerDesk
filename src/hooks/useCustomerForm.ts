import { Customer } from '@/types';
import { useForm } from '@tanstack/react-form';

interface UseCustomerFormProps {
  companyId: number;
  initialCustomer: Customer | null;
  handleCustomer: (vars: any) => Promise<void>;
}

export const useCustomerForm = ({
  companyId,
  initialCustomer,
  handleCustomer,
}: UseCustomerFormProps) => {
  return useForm({
    defaultValues: {
      name: initialCustomer ? initialCustomer.name : '',
      email: initialCustomer ? initialCustomer.email : '',
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await handleCustomer({
          ...value,
          company_id: companyId,
          id: initialCustomer?.id,
        });
        formApi.reset();
      } catch (error) {
        // Error is handled
        console.error(error);
      }
    },
  });
};
