'use client';
import SendTestEmail from '@/actions/SendTestEmail';
// import SendTestEmail from '@/action/sendOTPEmail';
import { Button } from '@/components/ui/button';

const page = () => {
  const handleClick = async () => {
    // You can also add loading states here
    const res = await SendTestEmail({});
    console.log('Email sent from server action!');
    console.log(res);
  };
  return (
    <div className="mt-32">
      <h1>Test Page</h1>
      <Button onClick={handleClick}>Send email</Button>
    </div>
  );
};

export default page;
