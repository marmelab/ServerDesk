import type { Meta, StoryObj } from '@storybook/react-vite';
import { UpdatePasswordForm } from '@/components/UpdatePasswordForm';

const meta = {
  title: 'Components/UpdatePasswordForm',
  component: UpdatePasswordForm,
} satisfies Meta<typeof UpdatePasswordForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
