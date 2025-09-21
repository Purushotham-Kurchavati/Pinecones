import { SignupForm } from '@/components/signup-form';

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-headline font-bold">Join the Community</h1>
          <p className="text-muted-foreground mt-2">Create an account to share your craft and connect with others.</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
