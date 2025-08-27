// app/reset-password/page.tsx
'use client';

import { useState } from 'react';
// import { requestPasswordReset, verifyAndResetPassword } from '@/actions/passwordReset';
import { Button } from '@/components/ui/button';
import { requestPasswordReset, verifyAndResetPassword } from '@/actions/passwordReset.action';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRequest() {
    setError(null);
    const res = await requestPasswordReset(email);
    if (res.success) {
      setStep('verify');
      setMessage('OTP sent!');
    } else setError(res.error!);
  }

  async function handleVerify() {
    setError(null);
    const res = await verifyAndResetPassword(email, password);
    if (res.success) setMessage('Password reset successful!');
    else setError(res.error!);
  }

  return (
    <div className="p-6 max-w-md mx-auto mt-36 pt-36">
      {step === 'request' ? (
        <>
          <h2>Request OTP</h2>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={handleRequest}>Send OTP</Button>
        </>
      ) : (
        <>
          <h2>Enter OTP & New Password</h2>
          <input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleVerify}>Reset Password</Button>
        </>
      )}
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
