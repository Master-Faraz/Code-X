'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';
import { Mail, Key, CheckCircle, ArrowLeft } from 'lucide-react';

// Validation Schemas
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits')
});

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

type EmailFormData = z.infer<typeof emailSchema>;
type OTPFormData = z.infer<typeof otpSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ResetPasswordForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form instances for each step
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' }
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' }
  });

  // Step 1: Send OTP
  const onSendOTP = async (data: EmailFormData) => {
    setIsLoading(true);

    setEmail(data.email);
    setOtpSent(true);
    setCurrentStep(2);

    setIsLoading(false);

    // try {
    //   // Replace with your API call
    //   const response = await fetch('/api/send-otp', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email: data.email })
    //   });

    //   if (response.ok) {
    //     setEmail(data.email);
    //     setOtpSent(true);
    //     setCurrentStep(2);
    //   } else {
    //     throw new Error('Failed to send OTP');
    //   }
    // } catch (error) {
    //   console.error('Error sending OTP:', error);
    //   emailForm.setError('email', { message: 'Failed to send OTP. Please try again.' });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // Step 2: Verify OTP
  const onVerifyOTP = async (data: OTPFormData) => {
    setIsLoading(true);

    console.log('OTP :: ' + data.otp);

    setCurrentStep(3);
    setIsLoading(false);

    // try {
    //   // Replace with your API call
    //   const response = await fetch('/api/verify-otp', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, otp: data.otp })
    //   });

    //   if (response.ok) {
    //     setCurrentStep(3);
    //   } else {
    //     throw new Error('Invalid OTP');
    //   }
    // } catch (error) {
    //   console.error('Error verifying OTP:', error);
    //   otpForm.setError('otp', { message: 'Invalid OTP. Please try again.' });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // Step 3: Reset Password
  const onResetPassword = async (data: PasswordFormData) => {
    setIsLoading(true);

    console.log('PassWord :: ' + data.password);
    console.log('C_PassWord :: ' + data.confirmPassword);

    setIsSuccess(true);
    setCurrentStep(4);
    setIsLoading(false);

    // try {
    //   // Replace with your API call
    //   const response = await fetch('/api/reset-password', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       email,
    //       password: data.password
    //     })
    //   });

    //   if (response.ok) {
    //     setIsSuccess(true);
    //     setCurrentStep(4);
    //   } else {
    //     throw new Error('Failed to reset password');
    //   }
    // } catch (error) {
    //   console.error('Error resetting password:', error);
    //   passwordForm.setError('password', { message: 'Failed to reset password. Please try again.' });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Reset your password</CardTitle>
              <CardDescription>Enter your email address and we'll send you an OTP to reset your password.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onSendOTP)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Please enter your email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Enter OTP</CardTitle>
              <CardDescription>We've sent a 6-digit code to {email}. Enter it below to verify your identity.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onVerifyOTP)} className="space-y-6 w-full ">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>One-Time Password</FormLabel>
                        <FormControl className="bg-red-300 w-full">
                          <InputOTP maxLength={6} {...field} className="w-full bg-cyan-300">
                            <InputOTPGroup className="w-1/2">
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>

                            <InputOTPGroup className="w-1/2">
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription>Please enter the 6-digit verification code.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={goBack} className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Create new password</CardTitle>
              <CardDescription>Your identity has been verified. Please create a new password for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onResetPassword)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter new password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Confirm new password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={goBack} className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Password Reset Successful!</CardTitle>
              <CardDescription>Your password has been successfully reset. You can now log in with your new password.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => (window.location.href = '/login')}>
                Go to Login
              </Button>
            </CardFooter>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        {currentStep < 4 && (
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                  >
                    {step}
                  </div>
                  <div className="text-xs mt-1 text-gray-500">
                    {step === 1 && 'Email'}
                    {step === 2 && 'Verify'}
                    {step === 3 && 'Reset'}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex mt-2">
              {[1, 2].map((step) => (
                <div key={step} className={`h-1 flex-1 mx-1 rounded ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
        )}

        {renderStepContent()}
      </div>
    </div>
  );
}
