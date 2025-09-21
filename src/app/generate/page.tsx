'use client';

import { GenerateForm } from '@/components/generate-form';

export default function GeneratePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">AI Product Description Generator</h1>
        <p className="text-muted-foreground mt-2">
          Create compelling product titles and descriptions with the power of AI.
        </p>
      </div>
      <GenerateForm />
    </div>
  );
}
