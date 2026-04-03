import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { queryClient } from './lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/layout';
import CompaniesPage from '@/pages/Companies';
import AgentsPage from './pages/Agents';
import { SignUpForm } from './components/SignUpForm';
import { UpdatePasswordForm } from './components/UpdatePasswordForm';
import { LoginForm } from './components/LoginForm';
import DashboardPage from '@/pages/Dashboard';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import TicketsPage from '@/pages/Tickets';
import { ErrorFallback } from './components/ErrorFallback';
import CustomersPage from './pages/Customers';
import { TicketsFiltersProvider } from './contexts/TicketsFiltersContext';

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
        {
          path: '/tickets',
          element: (
            <TicketsFiltersProvider>
              <TicketsPage />
            </TicketsFiltersProvider>
          ),
        },
        { path: '/customers', element: <CustomersPage /> },
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
