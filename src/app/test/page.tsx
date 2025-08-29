'use client';
// import resetPassword from '@/actions/passwordReset.action';
import SendTestEmail from '@/actions/sendTestEmail.action';
// import SendTestEmail from '@/action/sendOTPEmail';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const page = () => {
  const [count, setCount] = useState(0);
  console.log('re-reder');
  useEffect(() => {
    if (count >= 100) return;

    const interval = setInterval(() => {
      setCount((prev) => Math.min(prev + 1, 100));
    }, 50);
    return () => clearInterval(interval); // cleanup
  });

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
    <div className="mt-32">
      <h1>Test Page</h1>
      <Button onClick={handleClick}>Send email</Button>
      <Button onClick={handleResetPassword}>Reset password</Button>
      <div className="flex flex-col items-center justify-center space-y-3">
        <span>Progress Bar</span>
        <div className={` relative flex items-center justify-center w-[${1000}px] h-[20px] border-2 border-black rounded-2xl z-20`}>
          {/* Background layer */}
          <div
            className="absolute inset-0 bg-emerald-400 rounded-2xl transition-all duration-200  z-1 overflow-hidden"
            style={{ width: `${count}%` }}
          />
          {/* Foreground content */}
          <span className="relative z-10">{count}%</span>
        </div>
      </div>
    </div>
  );
};

export default page;




