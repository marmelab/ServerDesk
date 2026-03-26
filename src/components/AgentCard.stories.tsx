import type { Meta, StoryObj } from '@storybook/react-vite';
import AgentCard from './AgentCard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const meta = {
  component: AgentCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof AgentCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    agentInfos: {
      name: 'John Doe',
      id: '1',
      email: 'john@doe.com',
      companies: [{ id: 1, name: 'acme' }],
    },
  },
};
