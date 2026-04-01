import { FullUser, AuthContext } from '@/contexts/AuthContext';
import { AppUserRole } from '@/types';
import { Decorator } from '@storybook/react-vite';

export const withMockAuth = (userType: AppUserRole): Decorator => {
  const MockAuthDecorator = (Story: any) => {
    const mockUser: FullUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@doe.com',
      role: userType,
      company_ids: [],
    };

    const mockContextValue = {
      user: mockUser,
      isLoading: false,
      login: async () => {
        console.log('Mock Login');
        return mockUser;
      },
      logout: async () => {
        console.log('Mock Logout');
      },
    };

    return (
      <AuthContext.Provider value={mockContextValue}>
        <Story />
      </AuthContext.Provider>
    );
  };

  return MockAuthDecorator;
};
