import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, appUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  return (
    <div>
      <h1>Dashboard of {appUser?.role}</h1>
    </div>
  );
}
