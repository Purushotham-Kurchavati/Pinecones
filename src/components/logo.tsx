import { PineCone } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <PineCone className="h-6 w-6 text-primary" />
      <span className="font-bold font-headline text-lg hidden sm:inline-block">
        Pinecones
      </span>
    </Link>
  );
}
