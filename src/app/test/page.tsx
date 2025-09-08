'use client';
// import resetPassword from '@/actions/passwordReset.action';
import SendTestEmail from '@/actions/sendTestEmail.action';
import UserVerificationActionTest from '@/actions/userVerification.action';
// import SendTestEmail from '@/action/sendOTPEmail';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const page = () => {


  const handleClick = async () => {
    // You can also add loading states here
    const res = await SendTestEmail({ to: 'farazali9028@gmail.com', username: 'faraz', sub: 'Reset Password', otp: '123456' });
    console.log('Email sent from server action!');
    console.log(res);
  };

  const handleResetPassword = async () => {
    // const res = await ResetPassword('farazali9028@gmail.com');
    console.log('');
  };

  return (
    <div className="mt-32 flex flex-col items-center justify-center h-full w-full space-y-6">
      <h1>Test Page</h1>
      <Button onClick={handleClick}>Send email</Button>
      <Button onClick={handleResetPassword}>Reset password</Button>

      <Button onClick={async () => {
        const response = await UserVerificationActionTest()
        console.log(response)
      }}> Verify user</Button>



    </div>
  );
};

export default page;




