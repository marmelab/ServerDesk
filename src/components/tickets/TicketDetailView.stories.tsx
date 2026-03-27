import type { Meta, StoryObj } from '@storybook/react-vite';

import TicketDetailView from './TicketDetailView';
import { useForm } from '@tanstack/react-form';
import { Drawer } from '../ui/drawer';
import MessageThreadView from './MessageThreadView';
import { Message } from '@/types';

const meta = {
  component: TicketDetailView,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Drawer open={true} direction="right">
        <Story />
      </Drawer>
    ),
  ],
} satisfies Meta<typeof TicketDetailView>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockTicket = {
  id: 1,
  subject: 'Ticket subject',
  description: 'Ticket description.',
  created_at: new Date().toISOString(),
  updated_at: null,
  priority: 'high' as const,
  status: 'open' as const,
  company_id: 1,
  contact_id: null,
  customer_id: null,
  company: { name: 'acme' },
  creator: {
    name: 'John Doe',
    email: 'john@doe.com',
    isInternal: true,
  },
};

const mockMessage: Message = {
  id: 1,
  text: 'First message.',
  created_at: new Date().toISOString(),
  updated_at: null,
  contact_id: null,
  sender_id: 'customer_manager',
  ticket_id: 1,
};

const mockUser = {
  id: 'user_123',
  email: 'agent@support.com',
  role: 'agent' as const,
  company_ids: [1],
  name: 'John Doe',
};

export const Default: Story = {
  render: (args) => {
    const form = useForm({
      defaultValues: {
        text: '',
        status: 'open',
      },
    });
    return (
      <TicketDetailView
        {...args}
        ticket={args.ticket}
        form={form}
        user={args.user}
        isPending={args.isPending ?? false}
        error={args.error ?? null}
      >
        <MessageThreadView
          ticket={mockTicket!}
          messages={[
            {
              ...mockMessage,
              sender: { name: 'John Doe', role: 'customer_manager' },
            },
            {
              ...mockMessage,
              id: 2,
              text: 'second message',
              sender: { name: 'Agent', role: 'agent' },
            },
          ]}
          isPending={false}
          error={null}
        />
      </TicketDetailView>
    );
  },
  args: {
    ticket: mockTicket,
    form: undefined,
    user: mockUser,
    isPending: false,
    error: null,
  },
};

export const AsCustomerManager: Story = {
  render: Default.render,
  args: {
    ...Default.args,
    user: {
      id: 'cust_456',
      email: 'client@acme.com',
      role: 'customer_manager',
      company_ids: [1],
    } as any,
  },
};

export const NoMessages: Story = {
  render: (args) => {
    const form = useForm({
      defaultValues: {
        text: '',
        status: 'open',
      },
    });
    return (
      <TicketDetailView
        {...args}
        ticket={args.ticket}
        form={form}
        user={args.user}
        isPending={args.isPending ?? false}
        error={args.error ?? null}
      >
        <MessageThreadView
          ticket={mockTicket!}
          messages={[]}
          isPending={false}
          error={null}
        />
      </TicketDetailView>
    );
  },
  args: {
    ...Default.args,
  },
};

export const Loading: Story = {
  render: Default.render,
  args: {
    ...Default.args,
    ticket: undefined,
    isPending: true,
  },
};

export const Error: Story = {
  render: Default.render,
  args: {
    ...Default.args,
    error: true,
  },
};
