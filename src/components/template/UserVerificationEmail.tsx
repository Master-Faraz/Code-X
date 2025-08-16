import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Img, Button, Hr, Heading, Row, Column, Preview } from '@react-email/components';

interface UserVerificationEmailProps {
  username: string;
  otp: string;
}

export default function UserVerificationEmail({ username = 'User', otp = '123456' }: UserVerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your account with this OTP: {otp}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/936b6c40-492d-426d-ae56-412da21b5751.png"
              width="120"
              height="120"
              alt="Email Verification"
              style={logo}
            />
            <Heading style={title}>Verify Your Account</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hello {username},</Text>

            <Text style={paragraph}>
              Welcome! To complete your account setup, please verify your email address using the verification code below:
            </Text>

            {/* OTP Display */}
            <Section style={otpSection}>
              <Text style={otpLabel}>Your Verification Code:</Text>
              <Text style={otpCode}>{otp}</Text>
            </Section>

            <Text style={paragraph}>
              This code will expire in <strong>10 minutes</strong> for your security.
            </Text>

            <Text style={paragraph}>If you didn't create an account, please ignore this email or contact our support team.</Text>

            <Hr style={divider} />

            {/* Security Notice */}
            <Section style={securitySection}>
              <Text style={securityTitle}>🔒 Security Notice</Text>
              <Text style={securityText}>Never share this code with anyone. Our team will never ask for your verification code.</Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Best regards,
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

// Styles
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
  color: '#1f2937',
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
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '2px dashed #e5e7eb',
  margin: '24px 0'
};

const otpLabel = {
  fontSize: '14px',
  color: '#6b7280',
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
  border: '2px solid #3b82f6',
  display: 'inline-block'
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px 0'
};

const securitySection = {
  backgroundColor: '#fef3c7',
  padding: '16px 20px',
  borderRadius: '6px',
  borderLeft: '4px solid #f59e0b',
  margin: '24px 0'
};

const securityTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#92400e',
  margin: '0 0 8px'
};

const securityText = {
  fontSize: '14px',
  color: '#92400e',
  margin: '0',
  lineHeight: '1.4'
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
