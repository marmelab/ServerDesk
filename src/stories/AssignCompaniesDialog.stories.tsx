import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { AssignCompaniesDialog } from '../components/AssignCompaniesDialog';

const meta = {
  title: 'Components/AssignCompaniesDialog',
  component: AssignCompaniesDialog,
} satisfies Meta<typeof AssignCompaniesDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    agent: {
      id: 'agent-123',
      name: 'John Doe',
      email: 'john@doe.com',
      companies: [{ id: 1, name: 'Acme' }],
    },
    onOpenChange: fn(),
  },
};
