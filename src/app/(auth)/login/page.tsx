'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

import { Form } from '@/components/ui/form';
import CustomFormField, { FormFieldType } from '@/components/CustomFormField';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import Image from 'next/image';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' })
});

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  // const { login } = useAuthStore();
  const login = useAuthStore((state) => state.login);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const response = await login(data.email, data.password);
      if (response.error) throw response.error;
      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // <main className="w-full h-screen flex items-center justify-around  ">
    <main className="w-full h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-around">
      <section className="flex flex-col items-center justify-center w-full max-w-md p-6 ">
        <h1 className="font-bold text-3xl mb-10">Log in to your account</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full  ">
            <div></div>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="Please enter your email"
              iconAlt="email"
            />

            <CustomFormField
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="password"
              label="Password"
              placeholder="Please enter your password"
              iconAlt="Password"
            />

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-[#6fbcf7]  hover:text-[#36a5f9] hover:underline underline-offset-2">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full hover:shadow-2xl/10 bg-[#263238] hover:bg-neutral-950 text-white transition-all duration-300 hover:cursor-pointer ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>

        <div className="flex flex-col items-center justify-center space-y-2 mt-4 text-slate-500">
          <p className="text-sm">OR</p>
          <p>
            You don't have an account yet? {'  '}
            <Link href="/register" className="text-[#6fbcf7] font-bold hover:text-[#36a5f9] underline-offset-2 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </section>

      {/* Image section */}
      <section className="w-[500px] h-[500px]  hidden lg:block">
        <Image src="/images/login.svg" alt="login" height={500} width={500} />
      </section>
    </main>
  );
};

export default LoginPage;
