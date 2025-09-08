// lib/emailService.ts
'use server';

import PasswordResetEmail from '@/components/template/PasswordResetEmail';
import UserVerificationEmail from '@/components/template/UserVerificationEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailPayload {
  to: string;
  sub?: string;
  username?: string;
  otp?: string;
}

export async function sendForgotPasswordEmail({ to, sub = 'Reset Password', username = 'User', otp = '' }: EmailPayload) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: sub,
      react: PasswordResetEmail({ username, otp })
    });

    if (error) {
      return { success: false, error: error.message || error };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown email error' };
  }
}

export async function sendVerificationEmail({ to, sub = 'Verify your account', username = 'User', otp = '' }: EmailPayload) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: sub,
      react: UserVerificationEmail({ username, otp })
    });

    if (error) {
      return { success: false, error: error.message || error };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown email error' };
  }
}
