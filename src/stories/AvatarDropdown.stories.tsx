import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthContext } from '@/contexts/AuthContext';
import { AvatarDropdown } from '../components/AvatarDropdown';
import { StoryWrapper } from './StoryWrapper';

const meta = {
  title: 'Components/AvatarDropDown',
  component: AvatarDropdown,
  decorators: [
    (Story) => (
      <StoryWrapper>
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
      </StoryWrapper>
    ),
  ],
} satisfies Meta<typeof AvatarDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
