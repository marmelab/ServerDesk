import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoginForm } from '@/components/LoginForm';
import { StoryWrapper } from '@/stories/StoryWrapper';

const meta = {
  title: 'Components/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <StoryWrapper user={null}>
        <Story />
      </StoryWrapper>
    ),
  ],
} satisfies Meta<typeof LoginForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
