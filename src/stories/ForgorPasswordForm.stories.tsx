import type { Meta, StoryObj } from '@storybook/react-vite';

import { ForgotPasswordForm } from '@/components/ForgotPasswordForm';

const meta = {
  component: ForgotPasswordForm,
} satisfies Meta<typeof ForgotPasswordForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
