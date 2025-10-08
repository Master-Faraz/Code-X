import React from 'react';
import { useAuthStore } from '@/store/auth';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';

const LogoutBtn = () => {
  const logout = useAuthStore(state => state.logout);


  const handleLogout = async () => {
    try {
      const response = await logout();

      if (response.success) toast.success('Logout successfully');
      else throw response.error;
    } catch (error: any) {
      // console.log(error);
      toast.error(error?.message || 'Logout Unsuccessfull');
    }

  };
  return (
    <div>
      <Button onClick={handleLogout} className="flex space-x-1">
        <span>Logout</span>
        <LogOut />
      </Button>
    </div>
  );
};

export default LogoutBtn;
