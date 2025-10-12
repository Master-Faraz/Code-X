'use server';

import { generateAndStoreOtp, checkAndMarkResend, verifyOtp, attemptsCache, otpCache } from '@/lib/otpCache';
import { sendForgotPasswordEmail } from '@/lib/emailService';
import { users } from '@/models/server/config';
import { Query } from 'node-appwrite';
import { handleServerError } from '@/utils/errorHandler';
import { createSuccessResponse } from '@/utils/responseHandler';

// Step 1: Request a new OTP
export async function requestPasswordReset(email: string) {
  try {
    const resendCheck = checkAndMarkResend(email);
    if (!resendCheck.success) return handleServerError(resendCheck.message, undefined, 'requestPasswordReset');

    const otp = generateAndStoreOtp(email).data;
    const emailRes = await sendForgotPasswordEmail({
      to: email,
      otp,
      sub: 'Your Reset OTP',
      username: email
    });

    if (!emailRes.success) return handleServerError('Failed to send reset OTP email', emailRes.error, 'requestPasswordReset');

    return createSuccessResponse('Reset OTP sent successfully');
  } catch (err) {
    return handleServerError('Unexpected error during password reset request', err, 'requestPasswordReset');
  }
}

// Step 2: Verify the OTP and update password
export async function verifyAndResetPassword(email: string, otp: string, newPassword: string) {
  try {
    const check = verifyOtp(email, otp);
    if (!check.success) return handleServerError('Invalid or expired OTP', undefined, 'verifyAndResetPassword');

    const userList = await users.list([Query.equal('email', email)]);
    if (userList.users.length === 0) return handleServerError('User not found', undefined, 'verifyAndResetPassword');

    const userId = userList.users[0].$id;
    await users.updatePassword(userId, newPassword);

    return createSuccessResponse('Password reset successfully');
  } catch (err) {
    return handleServerError('Failed to reset password', err, 'verifyAndResetPassword');
  }
}

// Step 3: Verify OTP only (without deleting it)
export async function verifyOtpOnly(email: string, otp: string) {
  try {
    const now = Date.now();
    const attempt = attemptsCache.get(email) ?? { count: 0, blockedUntil: 0 };

    if (attempt.blockedUntil > now) {
      const wait = Math.ceil((attempt.blockedUntil - now) / 1000);
      return handleServerError(`Too many attempts. Try again in ${wait}s.`, undefined, 'verifyOtpOnly');
    }

    const rec = otpCache.get(email);
    if (!rec || rec.expires < now || rec.otp !== otp) {
      attempt.count++;
      if (attempt.count >= 3) {
        attempt.blockedUntil = now + 2 * 60_000;
        attempt.count = 0;
      }
      attemptsCache.set(email, attempt);
      return handleServerError('Invalid or expired OTP', undefined, 'verifyOtpOnly');
    }

    return createSuccessResponse('OTP verified successfully');
  } catch (err) {
    return handleServerError('Error verifying OTP', err, 'verifyOtpOnly');
  }
}
