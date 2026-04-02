import type { Meta, StoryObj } from '@storybook/react-vite';

import CompanyContactPending from './CompanyContactPending';

const meta = {
  component: CompanyContactPending,
} satisfies Meta<typeof CompanyContactPending>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
