import type { Meta, StoryObj } from '@storybook/react-vite';
import { UpdatePasswordForm } from '@/components/UpdatePasswordForm';
import { StoryWrapper } from '@/stories/StoryWrapper';

const meta = {
  title: 'Components/UpdatePasswordForm',
  component: UpdatePasswordForm,
  decorators: [
    (Story) => (
      <StoryWrapper user={null}>
        <Story />
      </StoryWrapper>
    ),
  ],
} satisfies Meta<typeof UpdatePasswordForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
