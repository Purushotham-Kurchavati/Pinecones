'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthButton } from './auth-button';
import { Logo } from './logo';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Community' },
  { href: '/generate', label: 'AI Generator' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Logo />
        <nav className="flex-1 ml-6">
          <ul className="flex items-center space-x-4 lg:space-x-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center justify-end">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
