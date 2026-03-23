import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { queryClient } from './lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/layout';
import CompaniesPage from '@/pages/companies';
import AgentsPage from './pages/Agents';
import { SignUpForm } from './components/sign-up-form';
import { UpdatePasswordForm } from './components/update-password-form';
import { LoginForm } from './components/LoginForm';
import DashboardPage from '@/pages/dashboard';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import TicketsPage from '@/pages/Tickets';
import { ErrorFallback } from './components/error-fallback';

export const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      errorElement: <ErrorFallback />,
      children: [
        { path: '/', element: <DashboardPage /> },
        { path: '/admin/companies', element: <CompaniesPage /> },
        { path: '/admin/agents', element: <AgentsPage /> },
        { path: '/auth/signup', element: <SignUpForm /> },
        { path: '/dashboard', element: <DashboardPage /> },
        { path: '/auth/login', element: <LoginForm /> },
        { path: '/auth/update-password', element: <UpdatePasswordForm /> },
        { path: '/auth/forgot-password', element: <ForgotPasswordForm /> },
        { path: '/admin', element: <DashboardPage /> },
        { path: '/agent', element: <DashboardPage /> },
        { path: '/tickets', element: <TicketsPage /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
