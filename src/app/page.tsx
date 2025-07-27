'use client';

import LogoutBtn from '@/components/LogoutBtn';
import { account } from '@/models/client/config';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<any>();
  const getUser = async () => {
    const curr_user = await account.getSession('current');
    setUser(curr_user);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <main className=" h-screen w-full flex flex-col items-center justify-center space-y-2">
      <p>User ::{user} </p>
      <LogoutBtn />
    </main>
  );
}
