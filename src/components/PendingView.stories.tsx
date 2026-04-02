import type { Meta, StoryObj } from '@storybook/react-vite';

import PendingView from './PendingView';

const meta = {
  component: PendingView,
} satisfies Meta<typeof PendingView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'label',
  },
};
