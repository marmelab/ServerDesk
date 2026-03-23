import type { Meta, StoryObj } from '@storybook/react-vite';
import { SignUpForm } from '@/components/SignUpForm';

const meta = {
  title: 'Components/SignUpForm',
  component: SignUpForm,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SignUpForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
