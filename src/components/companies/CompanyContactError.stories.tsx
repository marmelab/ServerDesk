import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { CompanyContactError } from './CompanyContactError';

const meta = {
  component: CompanyContactError,
} satisfies Meta<typeof CompanyContactError>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    errorCustomerManager: true,
    refetch: fn(),
    refetchCustomerManager: fn(),
  },
};
