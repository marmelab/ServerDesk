import type { Meta, StoryObj } from '@storybook/react-vite';
import MessageThreadView from './MessageThreadView';
import { withMockAuth } from '@/lib/decorator';

const meta = {
  component: MessageThreadView,
  parameters: {
    layout: 'centered',
  },
  decorators: [withMockAuth('admin')],
} satisfies Meta<typeof MessageThreadView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ticket: {
      id: 2109,
      description: 'Original ticket description text here...',
      created_at: '2026-03-25T14:27:25Z',
      company: { name: 'acme' },
      creator: {
        name: 'John Doe',
        email: 'john@doe.com',
      },
    } as any,
    messages: [
      {
        id: 1,
        text: 'Hello, I have an issue with my export.',
        sender: { name: 'Jean-Claude', role: 'customer' },
        created_at: new Date().toISOString(),
        contact_id: null,
        updated_at: new Date().toISOString(),
        sender_id: null,
        ticket_id: 2109,
      },
      {
        id: 2,
        text: 'I am looking into it right now!',
        sender: { name: 'Agent Smith', role: 'agent' },
        created_at: new Date().toISOString(),
        contact_id: null,
        updated_at: new Date().toISOString(),
        sender_id: null,
        ticket_id: 2109,
      },
    ],
    isPending: false,
    error: null,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    messages: [],
    isPending: true,
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
    messages: [],
    error: 'Error',
  },
};
