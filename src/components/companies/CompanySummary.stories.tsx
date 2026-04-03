import type { Meta, StoryObj } from '@storybook/react-vite';
import CompanySummary from './CompanySummary';
import { Accordion } from '../ui/accordion';

const meta = {
  component: CompanySummary,
  decorators: [
    (Story) => (
      <Accordion type="single" collapsible className="w-full max-w-md">
        <Story />
      </Accordion>
    ),
  ],
} satisfies Meta<typeof CompanySummary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    company: {
      id: 1,
      name: 'acme',
      created_at: new Date().toISOString(),
      tickets: [{ status: 'open' }],
    },
    onAssign: () => {},
    isAdmin: true,
  },
};

export const NotAdmin: Story = {
  args: {
    ...Default.args,
    isAdmin: false,
  },
};
