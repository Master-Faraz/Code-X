import React from 'react';
import { useAuthStore } from '@/store/auth';
import { Button } from './ui/button';
import { toast } from 'sonner';

const LogoutBtn = () => {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      const response = logout();
      if (response === true) toast.success('Logout successfully');
      else toast.error('Logout un-successfully');
    } catch (error) {
      console.log(error);
      toast.error('Logout un-successfully');
    }

    // const response = await
  };
  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutBtn;
