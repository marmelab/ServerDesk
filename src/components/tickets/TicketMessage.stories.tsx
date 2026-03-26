import type { Meta, StoryObj } from '@storybook/react-vite';

import TicketMessage from './TicketMessage';

const meta = {
  component: TicketMessage,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TicketMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'message',
    role: null,
    id: 0,
    created_at: '3/25/2026',
    name: 'name',
  },
};
