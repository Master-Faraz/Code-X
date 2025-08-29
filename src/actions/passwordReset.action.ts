// actions/passwordReset.ts
'use server';

import { generateAndStoreOtp, checkAndMarkResend, verifyOtp, attemptsCache, otpCache } from '@/lib/otpCache';
import { sendOtpEmail } from '@/lib/emailService';
import { users } from '@/models/server/config';
import { Query } from 'node-appwrite';
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
export async function verifyAndResetPassword(email: string, otp: string, newPassword: string): Promise<VerifyResult> {
  // Verify OTP & enforce lockouts
  const check = verifyOtp(email, otp);
  if (!check.ok) return { success: false, error: check.error };

  //

  // Update user password via Admin API -> Server config node-appwrite
  try {
    // Look up user by email for their userID
    const userList = await users.list([Query.equal('email', email)]);

    if (userList.users.length === 0) {
      return { success: false, error: 'User not found' };
    }

    const userId = userList.users[0].$id;

    // update the password
    await users.updatePassword(userId, newPassword);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update password' };
  }
}

// Add a separate OTP verification function that doesn't delete the OTP
export async function verifyOtpOnly(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
  const now = Date.now();
  const attempt = attemptsCache.get(email) ?? { count: 0, blockedUntil: 0 };

  // Check lockout
  if (attempt.blockedUntil > now) {
    const wait = Math.ceil((attempt.blockedUntil - now) / 1000);
    return { success: false, error: `Too many attempts. Try again in ${wait}s.` };
  }

  const rec = otpCache.get(email);
  if (!rec || rec.expires < now || rec.otp !== otp) {
    attempt.count++;
    if (attempt.count >= 3) {
      attempt.blockedUntil = now + 2 * 60_000;
      attempt.count = 0;
    }
    attemptsCache.set(email, attempt);
    return { success: false, error: 'Invalid or expired OTP.' };
  }

  // DON'T delete the OTP here - just verify it exists and is valid
  return { success: true };
}
