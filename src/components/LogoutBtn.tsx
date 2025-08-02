import React from 'react';
import { useAuthStore } from '@/store/auth';
import { Button } from './ui/button';
import { toast } from 'sonner';
import Image from 'next/image';

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
  return (
    <div>
      <Button onClick={handleLogout} className="flex space-x-1">
        <span>Logout</span>
        <Image src="/images/navbar/logout.svg" alt="Message" height={24} width={24} className="-mt-1" />
      </Button>
    </div>
  );
};

export default LogoutBtn;
