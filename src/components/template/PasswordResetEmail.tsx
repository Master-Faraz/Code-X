import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Img, Button, Hr, Heading, Row, Column, Preview } from '@react-email/components';

interface PasswordResetEmailProps {
  username: string;
  otp: string;
}

export default function PasswordResetEmail({ username = 'User', otp = '123456' }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password with this OTP: {otp}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/db76cefc-616d-4a49-b5f9-41c99942d6d1.png"
              width="120"
              height="120"
              alt="Password Reset"
              style={logo}
            />
            <Heading style={title}>Reset Your Password</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hello {username},</Text>

            <Text style={paragraph}>
              We received a request to reset your password. If you made this request, use the verification code below to proceed:
            </Text>

            {/* OTP Display */}
            <Section style={otpSection}>
              <Text style={otpLabel}>Your Reset Code:</Text>
              <Text style={otpCode}>{otp}</Text>
            </Section>

            <Text style={paragraph}>
              This code will expire in <strong>15 minutes</strong> for your security.
            </Text>

            {/* Alert Section */}
            <Section style={alertSection}>
              <Text style={alertTitle}>⚠️ Important Security Notice</Text>
              <Text style={alertText}>
                If you didn't request a password reset, please ignore this email. Your account remains secure, and no changes have been
                made.
              </Text>
            </Section>

            <Hr style={divider} />

            {/* Tips Section */}
            <Section style={tipsSection}>
              <Text style={tipsTitle}>💡 Password Security Tips:</Text>
              <Text style={tipsText}>
                • Use a unique password for your account
                <br />
                • Include uppercase, lowercase, numbers, and symbols
                <br />
                • Make it at least 12 characters long
                <br />• Never share your password with anyone
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Stay secure,
              <br />
              The Security Team
            </Text>
            <Text style={footerCopyright}>© 2025 Your Company. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles (similar to verification email but with red theme for security)
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
};

const header = {
  padding: '32px 32px 0',
  textAlign: 'center' as const
};

const logo = {
  margin: '0 auto 24px',
  borderRadius: '8px'
};

const title = {
  fontSize: '28px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#dc2626',
  margin: '0 0 32px'
};

const content = {
  padding: '0 32px'
};

const greeting = {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#1f2937',
  fontWeight: '600',
  margin: '0 0 16px'
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#4b5563',
  margin: '0 0 16px'
};

const otpSection = {
  textAlign: 'center' as const,
  padding: '32px 24px',
  backgroundColor: '#fef2f2',
  borderRadius: '8px',
  border: '2px dashed #fca5a5',
  margin: '24px 0'
};

const otpLabel = {
  fontSize: '14px',
  color: '#991b1b',
  margin: '0 0 8px',
  fontWeight: '500'
};

const otpCode = {
  fontSize: '36px',
  fontWeight: '700',
  color: '#1f2937',
  letterSpacing: '8px',
  fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
  margin: '0',
  padding: '16px 24px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '2px solid #dc2626',
  display: 'inline-block'
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px 0'
};

const alertSection = {
  backgroundColor: '#fef3c7',
  padding: '16px 20px',
  borderRadius: '6px',
  borderLeft: '4px solid #f59e0b',
  margin: '24px 0'
};

const alertTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#92400e',
  margin: '0 0 8px'
};

const alertText = {
  fontSize: '14px',
  color: '#92400e',
  margin: '0',
  lineHeight: '1.4'
};

const tipsSection = {
  backgroundColor: '#f0f9ff',
  padding: '16px 20px',
  borderRadius: '6px',
  borderLeft: '4px solid #3b82f6',
  margin: '24px 0'
};

const tipsTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1e40af',
  margin: '0 0 8px'
};

const tipsText = {
  fontSize: '14px',
  color: '#1e40af',
  margin: '0',
  lineHeight: '1.6'
};

const footer = {
  padding: '32px 32px 0',
  textAlign: 'center' as const
};

const footerText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0 0 16px',
  lineHeight: '1.4'
};

const footerCopyright = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '0'
};
