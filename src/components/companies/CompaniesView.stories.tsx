import type { Meta, StoryObj } from '@storybook/react-vite';

import CompaniesView from './CompaniesView';
import { Button } from '../ui/button';

const meta = {
  component: CompaniesView,
} satisfies Meta<typeof CompaniesView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    companies: [
      {
        id: 1,
        name: 'acme',
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'uncharted',
        created_at: new Date().toISOString(),
      },
    ],
    isPlaceholderData: false,
    isAdmin: true,
    onAssign: () => {},
    renderAddCompanyDialog: () => <Button>Add Company (Mock)</Button>,
  },
};

export const Placeholder: Story = {
  args: {
    ...Default.args,
    isPlaceholderData: true,
  },
};
