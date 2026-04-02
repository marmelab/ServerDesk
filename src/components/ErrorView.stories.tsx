import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import ErrorView from './ErrorView';

const meta = {
  component: ErrorView,
} satisfies Meta<typeof ErrorView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'label',
    refetch: fn(),
  },
};
