import type { Meta, StoryObj } from '@storybook/react-vite';
import { DashboardCard } from './DashboardCard';
import { User } from 'lucide-react';

const meta = {
  component: DashboardCard,
} satisfies Meta<typeof DashboardCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <User />,
    count: 0,
    label: 'label',
    singularLabel: 'singularTitle',
  },
};

export const Singular: Story = {
  args: {
    ...Default.args,
    count: 1,
  },
};
