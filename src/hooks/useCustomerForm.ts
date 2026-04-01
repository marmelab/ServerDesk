import { Customer } from '@/types';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

interface UseCustomerFormProps {
  companyId: number;
  initialCustomer: Customer | null;
  handleCustomer: (vars: any) => Promise<void>;
}

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
});

export type UserSchema = z.infer<typeof customerSchema>;

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
    validators: {
      onChange: customerSchema,
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
