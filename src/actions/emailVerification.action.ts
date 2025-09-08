// actions/emailVerification.ts
'use server';

import { generateAndStoreOtp, checkAndMarkResend, verifyOtp } from '@/lib/otpCache';
import { sendVerificationEmail } from '@/lib/emailService';
import { users } from '@/models/server/config';
import { Query } from 'node-appwrite';

// Step 1: Send OTP for email verification
export async function requestEmailVerification(email: string) {
  // Throttle resends
  const resendCheck = checkAndMarkResend(email);
  if (!resendCheck.ok) return { success: false, message: resendCheck.error };

  // Generate & cache OTP
  const otp = generateAndStoreOtp(email);

  // Send via Resend (use your UserVerificationEmail template)
  const emailRes = await sendVerificationEmail({
    to: email,
    otp,
    sub: 'Verify Your Email',
    username: email
  });

  if (!emailRes.success) {
    return { success: false, message: emailRes.error };
  }

  return { success: true };
}

// Step 2: Verify OTP and mark email as verified
export async function verifyEmailWithOtp(email: string, otp: string) {
  // Verify OTP (same logic as password reset)
  const check = verifyOtp(email, otp);
  if (!check.ok) return { success: false, message: check.error };

  try {
    // Look up user by email
    const userList = await users.list([Query.equal('email', email)]);
    if (userList.users.length === 0) {
      return { success: false, message: 'User not found' };
    }

    const userId = userList.users[0].$id;

    // Verify email using your working code
    await users.updateEmailVerification(userId, true);

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to verify email' };
  }
}
