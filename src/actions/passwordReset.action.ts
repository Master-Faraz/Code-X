// actions/passwordReset.ts
'use server';

import { generateAndStoreOtp, checkAndMarkResend, verifyOtp } from '@/lib/otpCache';
import { sendOtpEmail } from '@/lib/emailService';
import { users } from '@/models/server/config';
// import { adminUsers } from '@/lib/serverConfig';

interface RequestResult {
  success: boolean;
  error?: string;
}
interface VerifyResult {
  success: boolean;
  error?: string;
}

/**
 * Step 1: Request a new OTP
 */
export async function requestPasswordReset(email: string): Promise<RequestResult> {
  // Throttle resends
  const resendCheck = checkAndMarkResend(email);
  if (!resendCheck.ok) return { success: false, error: resendCheck.error };

  // Generate & cache OTP
  const otp = generateAndStoreOtp(email);

  // Send via Resend
  const emailRes = await sendOtpEmail({ to: email, otp, sub: 'Your Reset OTP', username: email });
  if (!emailRes.success) {
    return { success: false, error: emailRes.error };
  }

  return { success: true };
}

/**
 * Step 2: Verify the OTP and update password
 */
export async function verifyAndResetPassword(email: string, otp: string, newPassword: string, userId: string): Promise<VerifyResult> {
  // Verify OTP & enforce lockouts
  const check = verifyOtp(email, otp);
  if (!check.ok) return { success: false, error: check.error };

  // Update user password via Admin API -> Server config node-appwrite
  try {
    await users.updatePassword(userId, newPassword);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update password' };
  }
}
