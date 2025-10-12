'use server';

import { generateAndStoreOtp, checkAndMarkResend, verifyOtp } from '@/lib/otpCache';
import { sendVerificationEmail } from '@/lib/emailService';
import { users } from '@/models/server/config';
import { Query } from 'node-appwrite';
import { handleServerError } from '@/utils/errorHandler';
import { createSuccessResponse } from '@/utils/responseHandler';

// Step 1: Send OTP for email verification
export async function requestEmailVerification(email: string) {
  try {
    const resendCheck = checkAndMarkResend(email);
    if (!resendCheck.success) return handleServerError(resendCheck.message, undefined, 'requestEmailVerification');

    const otp = generateAndStoreOtp(email).data;
    const emailRes = await sendVerificationEmail({
      to: email,
      otp,
      sub: 'Verify Your Email',
      username: email
    });

    if (!emailRes.success) return handleServerError('Failed to send verification email', emailRes.error, 'requestEmailVerification');

    return createSuccessResponse('Verification email sent successfully');
  } catch (err) {
    return handleServerError('Unexpected server error', err, 'requestEmailVerification');
  }
}

// Step 2: Verify OTP and mark email as verified
export async function verifyEmailWithOtp(email: string, otp: string) {
  try {
    const check = verifyOtp(email, otp);
    if (!check.success) return handleServerError('Invalid or expired OTP', undefined, 'verifyEmailWithOtp');

    const userList = await users.list([Query.equal('email', email)]);
    if (userList.users.length === 0) return handleServerError('User not found', undefined, 'verifyEmailWithOtp');

    const userId = userList.users[0].$id;
    await users.updateEmailVerification(userId, true);

    return createSuccessResponse('Email verified successfully');
  } catch (err) {
    return handleServerError('Failed to verify email', err, 'verifyEmailWithOtp');
  }
}
