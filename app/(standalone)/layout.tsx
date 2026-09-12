import Link from 'next/link';
import React from 'react';
import { UserButton } from '@/features/auth/components/user-button';
import { KinetixLogo } from '@/components/kinetix-logo';

interface StandaloneLayoutProps {
    children: React.ReactNode;
}

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
  return (
    <main className='min-h-screen bg-[#09090B] text-[#E4E1E6]'>
        <div className='mx-auto max-w-screen-2xl px-4'>
            <nav className='flex justify-between items-center h-[73px] border-b border-white/[0.06]'>
                <Link href="/" className="flex items-center">
                    <KinetixLogo size={28} />
                </Link>
                <UserButton />
            </nav>
            <div className='flex flex-col items-center justify-center py-8 px-4'>
              {children}
            </div>
        </div>
    </main>
  );
};

export default StandaloneLayout;