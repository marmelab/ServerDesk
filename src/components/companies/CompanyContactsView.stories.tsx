import type { Meta, StoryObj } from '@storybook/react-vite';

import CompanyContactsView from './CompanyContactsView';
import { Accordion, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { fn } from 'storybook/test';

const meta = {
  component: CompanyContactsView,
  decorators: [
    (Story) => (
      <Accordion type="single" collapsible className="w-full max-w-md">
        <AccordionItem value="Test" className="border-b px-4 last:border-b-0">
          <AccordionTrigger className="flex-1 font-semibold py-4" />
          <Story />
        </AccordionItem>
      </Accordion>
    ),
  ],
} satisfies Meta<typeof CompanyContactsView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    customerManagers: [{ id: '1', name: 'John Doe', role: 'customer_manager' }],
    customers: [
      {
        id: 1,
        name: 'Customer1',
        email: 'customer1@test.com',
        company_id: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Customer2',
        email: 'customer2@test.com',
        company_id: 1,
        created_at: new Date().toISOString(),
      },
    ],
    isPending: false,
    error: null,
    errorCM: null,
    refetch: fn(),
    refetchCM: fn(),
  },
};

export const IsPending: Story = {
  args: {
    ...Default.args,
    isPending: true,
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
    error: { name: 'Error', message: 'An error arrived' },
  },
};
