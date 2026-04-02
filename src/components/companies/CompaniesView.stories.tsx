import type { Meta, StoryObj } from '@storybook/react-vite';

import CompaniesView from './CompaniesView';

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
        tickets: [{ status: 'open' }],
      },
      {
        id: 2,
        name: 'uncharted',
        created_at: new Date().toISOString(),
        tickets: [{ status: 'open' }],
      },
    ],
    isPlaceholderData: false,
    isAdmin: true,
    onAssign: () => {},
  },
};
