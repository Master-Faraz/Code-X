'use client';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  // Getting the session
  const { session, hydrated } = useAuthStore();

  const router = useRouter();

  // If there is session then no need to be in register and login page. Hydrated used to avoid flickering
  useEffect(() => {
    if (hydrated && session) router.push('/');
  }, [hydrated, session, router]);

  // Prevent any UI rendering until hydration is complete
  if (!hydrated) return null;

  // If session exists after hydration, block auth page
  if (session) return null;

  //   If no session then load the children
  return (
    <div className=" w-full h-screen flex items-center justify-center">
      {children}
      <Toaster position="top-right" richColors={true} />
    </div>
  );
};

export default AuthLayout;
