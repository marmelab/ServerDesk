import type { Meta, StoryObj } from '@storybook/react-vite';

import { ForgotPasswordForm } from '@/components/ForgotPasswordForm';
import { StoryWrapper } from '@/stories/StoryWrapper';

const meta = {
  title: 'Components/ForgotPasswordForm',
  component: ForgotPasswordForm,
  decorators: [
    (Story) => (
      <StoryWrapper user={null}>
        <Story />
      </StoryWrapper>
    ),
  ],
} satisfies Meta<typeof ForgotPasswordForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
