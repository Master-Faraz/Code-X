'use client';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  // Getting the session
  const { session } = useAuthStore();

  const router = useRouter(); //.   Using the lagacy router here

  useEffect(() => {
    if (session) router.push('/');
  }, [session, router]);

  //   if session then we don't require the auth page
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
