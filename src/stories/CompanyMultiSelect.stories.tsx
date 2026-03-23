import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { CompanyMultiSelect } from '../components/CompanyMultiSelect';

const meta = {
  component: CompanyMultiSelect,
} satisfies Meta<typeof CompanyMultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedIds: [0],
    onChange: fn(),
  },
};
