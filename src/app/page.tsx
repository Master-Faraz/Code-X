'use client';

import LogoutBtn from '@/components/LogoutBtn';

import { useAuthStore } from '@/store/auth';

export default function Home() {
  const { user, hydrated } = useAuthStore();

  if (!hydrated) return null; // Wait for Zustand to rehydrate
  return (
    <main className=" h-full w-full flex flex-col items-center justify-center space-y-2">
      <p>User :: {user ? user.name : 'not logged in'}</p>
      <LogoutBtn />

      <div className="h-[400px] w-[400px] bg-red-300"></div>
      <div className="h-[400px] w-[400px] bg-green-300"></div>
      <div className="h-[400px] w-[400px] bg-cyan-300"></div>
      <div className="h-[400px] w-[400px] bg-red-300"></div>
      <div className="h-[400px] w-[400px] bg-green-300"></div>
      <div className="h-[400px] w-[400px] bg-cyan-300"></div>
      <div className="h-[400px] w-[400px] bg-red-300"></div>
      <div className="h-[400px] w-[400px] bg-green-300"></div>
      <div className="h-[400px] w-[400px] bg-cyan-300"></div>
      <div className="h-[400px] w-[400px] bg-red-300"></div>
      <div className="h-[400px] w-[400px] bg-green-300"></div>
      <div className="h-[400px] w-[400px] bg-cyan-300"></div>
    </main>
  );
}
