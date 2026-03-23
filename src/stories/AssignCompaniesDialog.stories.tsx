import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AssignCompaniesDialog } from '../components/AssignCompaniesDialog';
import { StoryWrapper } from './StoryWrapper';

const meta = {
  title: 'Components/AssignCompaniesDialog',
  component: AssignCompaniesDialog,
  args: {
    open: true,
    onOpenChange: fn(),
    agent: {
      id: '1',
      name: 'John Doe',
      email: 'john@doe.com',
      companies: [{ id: 10, name: 'Acme' }],
    },
  },
  decorators: [
    (Story) => (
      <StoryWrapper
        mockData={{
          companies: [
            { id: 1, name: 'Acme Corp' },
            { id: 2, name: 'Globex' },
          ],
        }}
      >
        <Story />
      </StoryWrapper>
    ),
  ],
} satisfies Meta<typeof AssignCompaniesDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <AssignCompaniesDialog key={args.agent?.id} {...args} />,
  args: {
    open: true,
    onOpenChange: fn(),
    agent: {
      id: 'agent-123',
      name: 'John Doe',
      companies: [{ id: 1, name: 'Acme Corp' }],
    } as any,
  },
};

export const AgentWithoutCompanies: Story = {
  render: (args) => <AssignCompaniesDialog key={args.agent?.id} {...args} />,
  args: {
    open: true,
    onOpenChange: fn(),
    agent: {
      id: 'agent-456',
      name: 'New Agent',
      companies: [],
    } as any,
  },
};
