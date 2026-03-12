import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { handleSupabaseError } from '@/lib/error_handler';

export const UpdatePasswordForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const { mutate: updatePassword, isPending } = useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) handleSupabaseError(error);
    },
    onSuccess: () => {
      navigate('/Dashboard');
    },
  });

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    updatePassword(password);
  };

  return (
    <div
      className={cn(
        'flex min-h-full justify-center px-6 py-12 lg:px-8',
        className,
      )}
      {...props}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="New password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isPending}
              >
                {isPending ? 'Saving...' : 'Save new password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
