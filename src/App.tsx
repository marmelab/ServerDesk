import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/layout';
import CompaniesPage from '@/pages/companies';
import HomePage from './pages/home';
import { SignUpForm } from './components/sign-up-form';
import { UpdatePasswordForm } from './components/update-password-form';
import { LoginForm } from './components/login-form';
import DashboardPage from '@/pages/dashboard';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/companies', element: <CompaniesPage /> },
      { path: '/auth/signup', element: <SignUpForm /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/auth/updatepassword', element: <UpdatePasswordForm /> },
      { path: '/auth/login', element: <LoginForm /> },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
