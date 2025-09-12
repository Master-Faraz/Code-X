// lib/emailService.ts
'use server';

import PasswordResetEmail from '@/components/template/PasswordResetEmail';
import UserVerificationEmail from '@/components/template/UserVerificationEmail';
import { Resend } from 'resend';
import env from '@/app/env';

const resend = new Resend(env.resend.apiKey);

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
