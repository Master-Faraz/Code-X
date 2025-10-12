'use server';

import { generateAndStoreOtp, checkAndMarkResend, verifyOtp } from '@/lib/otpCache';
import { sendVerificationEmail } from '@/lib/emailService';
import { users } from '@/models/server/config';
import { Query } from 'node-appwrite';
import { handleServerError } from '@/utils/errorHandler';
import { createSuccessResponse } from '@/utils/responseHandler';

export async function requestUserVerificationEmail(email: string) {
  try {
    const resendCheck = checkAndMarkResend(email);
    if (!resendCheck.success)
      return handleServerError(resendCheck.error?.message || 'Resend check failed', resendCheck.error, 'requestUserVerificationEmail');

    const otp = generateAndStoreOtp(email).data;
    const emailRes = await sendVerificationEmail({
      to: email,
      otp,
      sub: 'Verify Your Email',
      username: email
    });

    if (!emailRes.success) return handleServerError('Failed to send verification email', emailRes.error, 'requestUserVerificationEmail');

    return createSuccessResponse('Verification email sent successfully');
  } catch (err) {
    return handleServerError('Unexpected server error', err, 'requestUserVerificationEmail');
  }
}

export async function verifyUserEmailWithOtp(email: string, otp: string) {
  try {
    const check = verifyOtp(email, otp);
    if (!check.success) return handleServerError('Invalid or expired OTP', undefined, 'verifyUserEmailWithOtp');

    const userList = await users.list([Query.equal('email', email)]);
    if (userList.users.length === 0) return handleServerError('User not found', undefined, 'verifyUserEmailWithOtp');

    const userId = userList.users[0].$id;
    await users.updateEmailVerification(userId, true);

    return createSuccessResponse('User email verified successfully');
  } catch (err) {
    return handleServerError('Failed to verify user email', err, 'verifyUserEmailWithOtp');
  }
}
