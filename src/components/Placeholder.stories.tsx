import type { Meta, StoryObj } from '@storybook/react-vite';

import { Placeholder } from './Placeholder';

const meta = {
  component: Placeholder,
} satisfies Meta<typeof Placeholder>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
