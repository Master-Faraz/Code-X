'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '../ui/form';
import CustomFormField, { FormFieldType } from '../CustomFormField';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useState } from 'react';
import { requestPasswordReset, verifyAndResetPassword, verifyOtpOnly } from '@/actions/passwordReset.action';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  otp: z.string().min(6, { message: 'Your one-time password must be 6 characters.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string(),
  isOTPVerified: z.boolean()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

const ResetPasswordForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      otp: '',
      password: '',
      confirmPassword: '',
      isOTPVerified: false
    }
  });

  const handleEmailSubmit = async () => {
    setLoading(true);

    try {
      if (step === 1) {
        const valid = await form.trigger('email');
        if (!valid) return;

        const res = await requestPasswordReset(form.getValues('email'));
        toast.success(res.message);
        setStep(2);
      }

      if (step === 2) {
        const valid = await form.trigger('otp');
        if (!valid) return;

        const res = await verifyOtpOnly(form.getValues('email'), form.getValues('otp'));
        toast.success(res.message);

        form.setValue('isOTPVerified', true);
        setStep(3);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong');
      console.error('[RESET PASSWORD ERROR]', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const passwordValid = await form.trigger(['password', 'confirmPassword']);
      if (!passwordValid) return;

      if (!values.isOTPVerified) throw new Error('OTP not verified');

      const res = await verifyAndResetPassword(values.email, values.otp, values.password);
      toast.success(res.message);
    } catch (error: any) {
      toast.error(error?.message || 'Password reset failed');
      console.error('[PASSWORD RESET ERROR]', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col text-card-foreground">
      <Card className="bg-card w-full min-w-[320px] max-w-none sm:min-w-[380px] sm:max-w-md shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            <CardHeader className="flex flex-col items-center justify-center space-y-3 px-4 sm:px-6 py-6">
              <CardTitle className="text-card-foreground text-center text-lg sm:text-xl md:text-2xl font-semibold">
                Forgot Password?
              </CardTitle>
              <CardDescription className="text-muted-foreground/70 text-center text-sm sm:text-base">
                {step === 1 && 'No worries, we’ll send reset instructions to your email.'}
                {step === 2 && `Please enter the OTP sent to ${form.getValues('email')}`}
                {step === 3 && 'Please enter your new password.'}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 sm:px-6 space-y-4 sm:space-y-6">
              {step === 1 && (
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                />
              )}

              {step === 2 && (
                <CustomFormField
                  fieldType={FormFieldType.OTP}
                  control={form.control}
                  name="otp"
                  label="Enter OTP"
                  placeholder="Please enter the OTP"
                />
              )}

              {step === 3 && (
                <>
                  <CustomFormField
                    fieldType={FormFieldType.PASSWORD}
                    control={form.control}
                    name="password"
                    label="New Password"
                    placeholder="Enter new password"
                  />
                  <CustomFormField
                    fieldType={FormFieldType.PASSWORD}
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Re-enter new password"
                  />
                </>
              )}
            </CardContent>

            <CardFooter className="px-4 sm:px-6 pb-6 space-y-4">
              {(step === 1 || step === 2) && (
                <Button
                  onClick={handleEmailSubmit}
                  disabled={loading}
                  variant="secondary"
                  className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium"
                >
                  {loading
                    ? step === 1
                      ? 'Sending OTP...'
                      : 'Verifying OTP...'
                    : step === 1
                      ? 'Send OTP'
                      : 'Verify OTP'}
                </Button>
              )}

              {step === 3 && (
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium"
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
