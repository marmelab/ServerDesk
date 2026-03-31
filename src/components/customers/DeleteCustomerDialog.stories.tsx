import type { Meta, StoryObj } from '@storybook/react-vite';

import { DeleteCustomerDialog } from './DeleteCustomerDialog';

const meta = {
  component: DeleteCustomerDialog,
} satisfies Meta<typeof DeleteCustomerDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    customer: { id: 1, name: 'John Doe' } as any,
    onClose: () => console.log('Closed'),
    onConfirm: (id) => console.log('Deleting customer ID:', id),
    isDeleting: false,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isDeleting: true,
  },
};
