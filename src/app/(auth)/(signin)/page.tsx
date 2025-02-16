import { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AuthSwitcher from '@/features/auth/components/auth-switcher';
import LottieAnimation from '@/components/lottie/LottieAnimation';
import WeclomeAnimation from '@/components/lottie/welcome/content-moderation.json';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function AuthenticationPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Login
      </Link>
      {/* Left side */}
      <div className="relative hidden h-full flex-col bg-primary p-10 text-primary-foreground lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        {/* Logo section */}
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          XPOS ERP
        </div>
        {/* Centered Lottie Animation */}
        <div className="relative z-20 flex flex-grow items-center justify-center">
          <div className="w-full max-w-md">
            <LottieAnimation animationData={WeclomeAnimation} />
          </div>
        </div>
        {/* Footer section */}
        <div className="relative z-20">
          <blockquote className="space-y-2">
            {/* <FooterText /> */}
          </blockquote>
        </div>
      </div>
      {/* Right side */}
      <div className="flex h-full items-center justify-center lg:p-8">
        <div className="w-full max-w-md">
          <AuthSwitcher />
        </div>
      </div>
    </div>
  );
}
