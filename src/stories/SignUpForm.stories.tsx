import type { Meta, StoryObj } from '@storybook/react-vite';
import { SignUpForm } from '@/components/SignUpForm';
import { StoryWrapper } from './StoryWrapper';

const meta = {
  title: 'Components/SignUpForm',
  component: SignUpForm,
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
} satisfies Meta<typeof SignUpForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
