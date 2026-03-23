import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthContext } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { fn } from 'storybook/test';

const meta = {
  title: 'Components/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <AuthContext.Provider
        value={
          {
            user: null,
            isLoading: false,
            login: fn(async () => ({ id: '1', role: 'admin' }) as any),
            logout: fn(),
          } as any
        }
      >
        <div className="flex justify-end p-10">
          <Story />
        </div>
      </AuthContext.Provider>
    ),
  ],
} satisfies Meta<typeof LoginForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
