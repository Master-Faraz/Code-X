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
  const [loading, setIsLoading] = useState(false)

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
    setIsLoading(true)
    // Send OTP
    if (step === 1) {
      try {
        const valid = await form.trigger("email");
        if (!valid) return;
        const res = await requestPasswordReset(form.getValues("email"));
        if (res.success) {
          toast.success("OTP send successfully")
          setStep(2);
        } else throw res.error;


        // setTimeout(() => {
        //   setIsLoading(false)
        //   setStep(2);

        // }, 3000);

      } catch (error) {
        toast.error("There is some problem while sending the OTP")
        console.log("OTP Error ::" + error)
      }
      finally {
        setIsLoading(false)
      }

    }
    // Verify OTP
    if (step === 2) {
      try {
        // invocking form validation
        const valid = await form.trigger("otp");
        if (!valid) return;

        console.log("otp validation")
        console.log("Email :: " + form.getValues("email") + " otp :: " + form.getValues("otp"))

        // // verifying otp
        const check = await verifyOtpOnly(form.getValues("email"), form.getValues("otp"));
        if (check.error) throw { success: false, error: check.error };



        // if otp is verified then 
        form.setValue("isOTPVerified", true)
        toast.success("OTP Verified successfully")

        setStep(3);
        // setTimeout(() => {
        //   setIsLoading(false)
        //   setStep(3);

        // }, 3000);
      } catch (error: any) {
        toast.error("OTP Verification Failed")
        console.log(error)
      }
      finally {
        setIsLoading(false)
      }
    }
  };

  // Handling form submit
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // Form Validation
    const passwordValid = await form.trigger("password");
    const confirmPasswordValid = await form.trigger("confirmPassword");
    if (!passwordValid || !confirmPasswordValid) return;

    try {
      // Checking if otp is verified or not 
      if (values.isOTPVerified === false) throw { success: false, message: "OTP is not verified" }
      const res = await verifyAndResetPassword(values.email, values.otp, values.password);
      if (res.success) toast.success('Password reset successful!');
      else throw res.error;
    } catch (error) {

      toast.error("Password reset failed")
      console.log("Password reset Error :: " + error)

    }
    finally {
      setIsLoading(false)
    }

    // setTimeout(() => {
    //   setIsLoading(false)
    // }, 3000);

  }

  return (
    <div className="w-full flex flex-col text-card-foreground">
      <Card className='bg-card min-w-[320px] '>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader className='flex flex-col items-center justify-center'>
              <CardTitle className='text-card-foreground flex '>
                <span className='text-lg'>Forgot Password?</span>
              </CardTitle>
              <CardDescription className='text-muted-foreground/70'>
                {step === 1 && <span>No worries, we will send you reset instructions to your email</span>}
                {step === 2 && <span>Please enter the OTP send to {form.getValues("email")}</span>}
                {step === 3 && <span>Please enter the new password</span>}
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
                  className=''
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
                <Button onClick={handleEmailSubmit} variant={'secondary'} className='w-full focus-visible:ring-ring transition-all duration-200 ease-in-out cursor-pointer' disabled={loading}>
                  {(step === 1) && (!loading ? "Send OTP" : "Sending OTP ...")}
                  {((step === 2)) && (!loading ? "Verify OTP" : "Verifying OTP ...")}
                </Button>
              )}

              {step === 3 && (
                <Button type='submit' className="w-full focus-visible:ring-ring transition-all duration-200 ease-in-out cursor-pointer" disabled={loading}>
                  {!loading ? "Reset Password" : "Resetting Password ..."}
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
