import type { Meta, StoryObj } from '@storybook/react-vite';

import CustomersView from './CustomersView';
import { Button } from '@/components/ui/button';

const meta = {
  component: CustomersView,
} satisfies Meta<typeof CustomersView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    customers: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@doe.com',
        company_id: 123,
        created_at: new Date().toISOString(),
      },
      {
        id: 1,
        name: 'Other',
        email: 'other@doe.com',
        company_id: 123,
        created_at: new Date().toISOString(),
      },
    ],
    isPlaceholderData: false,
    onDeleteCustomer: () => 'Customer deleted',
    onUpdateCustomer: () => 'Customer updated',
    renderCustomerDialog: () => <Button>Add Customer (Mock)</Button>,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isPlaceholderData: true,
  },
};

export const NoCustomers: Story = {
  args: {
    ...Default.args,
    customers: [],
  },
};
