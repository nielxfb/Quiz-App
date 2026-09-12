import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '@/hooks/use-auth';
import { ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Register() {
  const navigate = useNavigate();
  const register = useRegister();
  const login = useLogin();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await register.mutateAsync({ username, email, password });
      await login.mutateAsync({ email, password });
      navigate('/', { replace: true });
    } catch {
      // surfaced via errorMessage below
    }
  }

  const failure = register.error ?? login.error;
  const errorMessage =
    failure instanceof ApiError
      ? failure.status === 409
        ? 'That email is already registered.'
        : failure.message
      : failure
        ? 'Something went wrong. Please try again.'
        : null;

  const isSubmitting = register.isPending || login.isPending;

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Sign up to start taking quizzes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMessage && <p className="text-destructive text-sm">{errorMessage}</p>}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <p className="text-muted-foreground mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-foreground underline underline-offset-4">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
