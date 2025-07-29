'use client';

import LogoutBtn from '@/components/LogoutBtn';

import { useAuthStore } from '@/store/auth';

export default function Home() {
  const { user, hydrated } = useAuthStore();

  if (!hydrated) return null; // Wait for Zustand to rehydrate
  return (
    <main className=" h-screen w-full flex flex-col items-center justify-center space-y-2">
      <p>User :: {user ? user.name : 'not logged in'}</p>
      <LogoutBtn />
    </main>
  );
}
