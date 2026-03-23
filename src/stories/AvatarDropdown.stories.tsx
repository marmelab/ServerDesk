import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthContext } from '@/contexts/AuthContext';
import { AvatarDropdown } from '../components/AvatarDropdown';

const meta = {
  component: AvatarDropdown,
  decorators: [
    (Story) => (
      <AuthContext.Provider
        value={
          {
            user: { name: 'John Doe', email: 'john@doe.com' },
            isAuthenticated: true,
            isInitialLoading: false,
          } as any
        }
      >
        <div className="flex justify-end p-10">
          <Story />
        </div>
      </AuthContext.Provider>
    ),
  ],
} satisfies Meta<typeof AvatarDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
