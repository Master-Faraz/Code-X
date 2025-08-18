'use server';

import EmailTemplate from '@/components/EmailTemplate';
import PasswordResetEmail from '@/components/template/PasswordResetEmail';
import UserVerificationEmail from '@/components/template/UserVerificationEmail';
// import VerificationEmail from '@/components/template/VerificationTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// enum EmailType {
//   userVerification = 'verification',
//   resetPassword = 'otp'
// }

interface EmailPayload {
  // type?: EmailType;
  to?: string;
  sub?: string;
  username?: string;
  otp?: string;
}

export default async function sendTestEmail({
  to = 'farazali9028@gmail.com',
  sub = 'test',
  otp = '147852',
  username = 'user'
}: EmailPayload) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: to,
      subject: sub,
      // react: EmailTemplate({ firstName: 'faraz' })
      react: PasswordResetEmail({ username: username, otp: otp })
      // react: UserVerificationEmail({ username: 'Faraz', otp: '192015' })
    });

    if (error) {
      return { error: error.message || error };
      // return { error }; // must be plain object
    }

    return { data }; // plain object only
  } catch (error: any) {
    return { error: error.message || 'Unknown error' };
  }
}
