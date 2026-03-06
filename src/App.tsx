import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/layout';
import CompaniesPage from '@/pages/companies';
import { SignUpForm } from './components/sign-up-form';
import { UpdatePasswordForm } from './components/update-password-form';
import { LoginForm } from './components/login-form';
import DashboardPage from '@/pages/dashboard';
import { ForgotPasswordForm } from './components/forgot-password-form';

const queryClient = new QueryClient();

export const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: '/', element: <DashboardPage /> },
        { path: '/admin/companies', element: <CompaniesPage /> },
        { path: '/auth/signup', element: <SignUpForm /> },
        { path: '/dashboard', element: <DashboardPage /> },
        { path: '/auth/login', element: <LoginForm /> },
        { path: '/auth/update-password', element: <UpdatePasswordForm /> },
        { path: '/auth/forgot-password', element: <ForgotPasswordForm /> },
        { path: '/admin', element: <DashboardPage /> },
        { path: '/agent', element: <DashboardPage /> },
        { path: '/tickets', element: <DashboardPage /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
