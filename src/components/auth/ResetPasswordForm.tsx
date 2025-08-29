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
  otp: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.'
  }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string(),
  isOTPVerified: z.boolean()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

const ResetPasswordForm = () => {
  // states 
  const [step, setStep] = useState(1);
  const [loading, setIsLoading] = useState(false);

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

  // Function for handling email and OTP
  const handleEmailSubmit = async () => {
    setIsLoading(true);
    // Send OTP
    if (step === 1) {
      try {
        const valid = await form.trigger("email");
        if (!valid) return;
        const res = await requestPasswordReset(form.getValues("email"));
        if (res.success) {
          toast.success("OTP send successfully");
          setStep(2);
        } else throw res;
      } catch (error: any) {
        toast.error("Something went wrong");
        toast.error(error.message)
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    // Verify OTP
    if (step === 2) {
      try {
        const valid = await form.trigger("otp");
        if (!valid) return;

        console.log("otp validation");

        const check = await verifyOtpOnly(form.getValues("email"), form.getValues("otp"));
        if (check.message) throw { success: false, message: check.message };

        form.setValue("isOTPVerified", true);
        toast.success("OTP Verified successfully");
        setStep(3);
      } catch (error: any) {
        toast.error("OTP Verification Failed");
        toast.error(error.message)


        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handling form submit
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const passwordValid = await form.trigger("password");
    const confirmPasswordValid = await form.trigger("confirmPassword");
    if (!passwordValid || !confirmPasswordValid) return;

    try {
      if (values.isOTPVerified === false) throw { success: false, message: "OTP is not verified" };
      const res = await verifyAndResetPassword(values.email, values.otp, values.password);
      if (res.success) toast.success('Password reset successful!');
      else throw res.message;
    } catch (error: any) {
      toast.error("Password reset failed");
      toast.error(error.message)
      console.error(+ error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col text-card-foreground">
      <Card className="bg-card w-full min-w-[320px] max-w-none sm:min-w-[380px] sm:max-w-md shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            <CardHeader className="flex flex-col items-center justify-center space-y-3 px-4 sm:px-6 py-6">
              <CardTitle className="text-card-foreground text-center">
                <span className="text-lg sm:text-xl md:text-2xl font-semibold">Forgot Password?</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground/70 text-center text-sm sm:text-base leading-relaxed max-w-sm">
                {step === 1 && <span>No worries, we will send you reset instructions to your email</span>}
                {step === 2 && (
                  <span>
                    Please enter the OTP sent to{' '}
                    <span className="font-medium text-foreground">
                      {form.getValues("email")}
                    </span>
                  </span>
                )}
                {step === 3 && <span>Please enter your new password</span>}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 sm:px-6 space-y-4 sm:space-y-6">
              {step === 1 && (
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Please enter your email"
                  iconAlt="email"
                  className="w-full"
                />
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <CustomFormField
                    fieldType={FormFieldType.OTP}
                    control={form.control}
                    name="otp"
                    label="Enter OTP"
                    placeholder="Please enter the OTP"
                    className="w-full"
                  />
                  {/* Resend OTP button for mobile */}
                  <div className="flex justify-center sm:hidden">
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => handleEmailSubmit()}
                      disabled={loading}
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <CustomFormField
                    fieldType={FormFieldType.PASSWORD}
                    control={form.control}
                    name="password"
                    label="New Password"
                    placeholder="Please enter your new password"
                    className="w-full"
                  />
                  <CustomFormField
                    fieldType={FormFieldType.PASSWORD}
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Please confirm your new password"
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>

            <CardFooter className="px-4 sm:px-6 pb-6 space-y-4">
              {(step === 1 || step === 2) && (
                <Button
                  onClick={handleEmailSubmit}
                  variant="secondary"
                  className="w-full h-11 sm:h-12 text-sm sm:text-base focus-visible:ring-ring transition-all duration-200 ease-in-out cursor-pointer font-medium"
                  disabled={loading}
                >
                  {step === 1 && (!loading ? "Send OTP" : "Sending OTP...")}
                  {step === 2 && (!loading ? "Verify OTP" : "Verifying OTP...")}
                </Button>
              )}

              {step === 3 && (
                <Button
                  type="submit"

                  className="w-full h-11 sm:h-12 text-sm sm:text-base focus-visible:ring-ring transition-all duration-200 ease-in-out cursor-pointer font-medium"
                  disabled={loading}
                >
                  {!loading ? "Reset Password" : "Resetting Password..."}
                </Button>
              )}

              {/* Back button for step 2 and 3
              {step > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                >
                  ← Go back
                </Button>
              )} */}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
