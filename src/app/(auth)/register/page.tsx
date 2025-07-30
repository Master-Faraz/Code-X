'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import CustomFormField, { FormFieldType } from '@/components/CustomFormField';
import { useAuthStore } from '@/store/auth';
import Image from 'next/image';

// Form Schema with Zod validation
const formSchema = z
  .object({
    username: z.string().min(1, { message: 'Please enter a valid username' }),
    email: z.string().email('Please Enter a valid Email Id'),
    password: z.string().min(6, { message: 'Password must be atleast 6 characters long' }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

const RegisterForm = () => {
  // creating all the states and variables
  const [loading, setLoading] = useState(false);
  const { createAccount, login } = useAuthStore();

  //   Creating Form using react-hook-form and setup zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Submit handler for submitting the form
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      // throw { name: 'Error', message: 'HEHE' };
      const response = await createAccount(data.username, data.email, data.password);
      if (response.error) throw response.error;

      await login(data.email, data.password);
      toast.success('Account Created Successfully');
    } catch (error: any) {
      toast.error('Error ' + error.message);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay before toast
      toast.error('Something went wrong while creating account');

      console.log('Error while creating account :: ' + error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-screen flex items-center justify-around  ">
      <section className="flex flex-col items-center justify-center w-[500px] p-6 ">
        <h1 className="font-bold text-3xl mb-10">Create your account</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col w-full">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="username"
              label="Username"
              placeholder="Jhon Doe"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="jhondoe123@gmail.com"
            />

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

            <Button
              type="submit"
              disabled={loading}
              className={`w-full hover:shadow-2xl/10 bg-[#263238] hover:bg-neutral-950 text-white transition-all duration-300 hover:cursor-pointer ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {' '}
              {loading ? 'Registering the user...' : 'Register'}
            </Button>
          </form>
        </Form>

        <div className="flex flex-col items-center justify-center space-y-2 mt-4 text-slate-500">
          <h1 className="text-sm">OR</h1>
          <p>
            Already have an account{' '}
            <Link href="/login" className="text-[#6fbcf7] font-bold hover:text-[#36a5f9]">
              Login
            </Link>
          </p>
        </div>
      </section>
      {/* Image section */}
      <section className="w-[500px] h-[500px]  hidden lg:block">
        <Image src="/images/signup.svg" alt="Signup illustration" height={500} width={500} priority />
      </section>
    </main>
  );
};

export default RegisterForm;
