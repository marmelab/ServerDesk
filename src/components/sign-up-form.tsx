import { useState } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { Link, useSearchParams } from 'react-router-dom';
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
import { useInviteToken } from '@/hooks/use_invite_token';
import { useMutation } from '@tanstack/react-query';
import { handleSupabaseError } from '@/lib/error_handler';
import { toast } from 'sonner';

export const SignUpForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const [searchParam] = useSearchParams();
  const inviteToken = searchParam.get('invite');

  const { inviteData, inviteValidating, inviteError } =
    useInviteToken(inviteToken);

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: async () => {
      if (password !== repeatPassword) {
        throw new Error('Passwords do not match');
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/ServerDesk/auth/login`,
          data: {
            name: name,
            company_id: inviteData?.company_id,
            invite_token: inviteToken,
          },
        },
      });
      if (error) handleSupabaseError(error);
    },
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (error: any) => {
      if (error.code === 'user_already_exists' || error.status === 400) {
        toast.error('This email is already taken.');
        return;
      }

      const genericMessage = handleSupabaseError(error);
      toast.error(genericMessage);
    },
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    signUp();
  };

  if (inviteValidating) {
    return <div className="flex justify-center p-12">Verifying token...</div>;
  }

  if (inviteToken && inviteError) {
    return (
      <div
        className={cn('flex min-h-full justify-center px-6 py-12', className)}
      >
        <Card className="w-full max-w-sm border-red-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">
              Invalid Token
            </CardTitle>
            <CardDescription>{inviteError}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex min-h-full justify-center px-6 py-12 lg:px-8',
        className,
      )}
      {...props}
    >
      {success ? (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">
              Thank you for signing up!
            </CardTitle>
            <CardDescription>Check your email to confirm</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You&apos;ve successfully signed up. Please check your email to
              confirm your account before signing in.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <CardDescription>Create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="user"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {inviteToken && (
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      type="text"
                      required
                      value={inviteData?.companies.name}
                      disabled={true}
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="repeat-password">Repeat Password</Label>
                  </div>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isPending}
                >
                  {isPending ? 'Creating an account...' : 'Sign up'}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link to="/auth/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
