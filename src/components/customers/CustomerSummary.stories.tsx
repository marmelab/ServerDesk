import type { Meta, StoryObj } from '@storybook/react-vite';
import CustomerSummary from './CustomerSummary';
import { Table, TableBody } from '../ui/table';

const meta = {
  component: CustomerSummary,
  decorators: [
    (Story) => (
      <Table>
        <TableBody>
          <Story />
        </TableBody>
      </Table>
    ),
  ],
} satisfies Meta<typeof CustomerSummary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    customer: {
      id: 1,
      name: 'John Doe',
      email: 'john@doe.com',
      company_id: 123,
      created_at: new Date().toISOString(),
    },
    onDelete: (id) => console.log('Delete ID:', id),
    onUpdate: (customer) => console.log('User updated:', customer.name),
  },
};
