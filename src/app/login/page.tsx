import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-headline font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to continue to the Pinecones community.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
