'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '../ui/form';
import CustomFormField, { FormFieldType } from '../CustomFormField';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useState } from 'react';
import { requestPasswordReset, verifyAndResetPassword } from '@/actions/passwordReset.action';
import { toast } from 'sonner';
import { verifyOtp } from '@/lib/otpCache';
import { error } from 'console';


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
  const [step, setStep] = useState(1);

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
    if (step === 1) {

      try {
        const valid = await form.trigger("email");
        if (!valid) return;
        const res = await requestPasswordReset(form.getValues("email"));
        if (res.success) {
          toast.success("OTP send successfully")
          setStep(2);
        } else throw res.error;
      } catch (error) {
        toast.error("There is some problem while sending the OTP")
        console.log("OTP Error ::" + error)
      }

    }
    // Verify OTP
    if (step === 2) {
      try {
        // invocking form validation
        const valid = await form.trigger("otp");
        if (!valid) return;

        // verifying otp
        const check = verifyOtp(form.getValues("email"), form.getValues("otp"));
        if (!check.ok) throw { success: false, error: check.error };

        // if otp is verified then 
        form.setValue("isOTPVerified", true)
        toast.success("OTP Verified successfully")

        setStep(3);
      } catch (error: any) {
        toast.error("OTP Verification Failed")
        console.log(error?.message)

      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Form Validation
    const passwordValid = await form.trigger("password");
    const confirmPasswordValid = await form.trigger("confirmPassword");
    if (!passwordValid || !confirmPasswordValid) return;

    try {
      // Checking if otp is verified or not 
      if (values.isOTPVerified === false) throw { success: false, message: "OTP is not verified" }
      const res = await verifyAndResetPassword(values.email, values.password);
      if (res.success) toast.success('Password reset successful!');
      else throw res.error;
    } catch (error) {

      toast.error("Password reset failed")
      console.log("Password reset Error :: " + error)

    }

    console.log("Final submitted values", values);
  }

  return (
    <div className="w-full flex flex-col ">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader className='flex flex-col items-center justify-center'>
              <CardTitle className='text-card-foreground flex '>
                <span className='text-lg'>Forgot Password?</span>
              </CardTitle>
              <CardDescription className='text-muted-foreground/70'>
                No worries, we will send you reset instructions
              </CardDescription>
            </CardHeader>

            <CardContent>
              {step === 1 && (
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Please enter your email"
                  iconAlt="email"
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
                <div className='space-y-6'>
                  <CustomFormField
                    fieldType={FormFieldType.PASSWORD}
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder="Please enter your password"
                  />
                  <CustomFormField
                    fieldType={FormFieldType.PASSWORD}
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Please enter your password again"
                  />
                </div>
              )}
            </CardContent>

            <CardFooter>
              {(step === 1 || step === 2) && (
                <Button onClick={handleEmailSubmit} type="button" className="w-full text-white">
                  {step === 1 && "Send OTP"}
                  {step === 2 && "Verify OTP"}
                </Button>
              )}

              {step === 3 && (
                <Button type='submit' className="w-full text-white">
                  Reset Password
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
