import React from 'react';
import { useAuthStore } from '@/store/auth';
import { Button } from './ui/button';

const LogoutBtn = () => {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logout successfully');
    } catch (error) {
      console.log(error);
    }

    // const response = await
  };
  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutBtn;
