import React from 'react';
import { useAuthStore } from '@/store/auth';
import { Button } from './ui/button';
import { toast } from 'sonner';

const LogoutBtn = () => {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      const response = await logout();

      if (response.success) toast.success('Logout successfully');
      else throw response.error;
    } catch (error: any) {
      // console.log(error);
      toast.error(error?.message || 'Logout Unsuccessfull');
    }

    // const response = await
  };
  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutBtn;
