import { useForm } from '@tanstack/react-form';

interface UseCustomerFormProps {
  companyId: number;
  addCustomer: (vars: any) => Promise<void>;
}

export const useCustomerForm = ({
  companyId,
  addCustomer,
}: UseCustomerFormProps) => {
  return useForm({
    defaultValues: {
      name: '',
      email: '',
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await addCustomer({
          ...value,
          companyId: companyId,
        });
        formApi.reset();
      } catch (error) {
        // Error is handled
        console.error(error);
      }
    },
  });
};
