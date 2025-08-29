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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

const formSchema = z.object({
    email: z.string().email('Please enter a valid email.'),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long.' })
});


const LoginForm = () => {
    const [loading, setLoading] = useState(false);
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
            toast.error("Something went wrong")
            toast.error(error.message || 'Something went wrong. Please try again.');
            console.error('Auth error:', error);
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
                            <CardTitle className="text-card-foreground text-center">
                                <span className="text-lg sm:text-xl md:text-2xl font-semibold">Sign in to your account</span>
                            </CardTitle>


                        </CardHeader>


                        <CardContent className="px-4 sm:px-6 space-y-4 sm:space-y-6">
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
                                <Link
                                    href="/forgot-password"
                                    className="text-primary hover:text-primary/80 hover:underline underline-offset-2 text-sm"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </CardContent>

                        <CardFooter className="px-4 sm:px-6 pb-6 space-y-4 flex flex-col">
                            <Button
                                type="submit"
                                variant={'secondary'}
                                className="w-full h-10  text-sm sm:text-base focus-visible:ring-ring transition-all duration-200 ease-in-out cursor-pointer font-medium hover:shadow-2xl"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>


                            <div className="flex flex-col items-center justify-center space-y-2 mt-4 text-slate-500">
                                <p className="text-sm">OR</p>
                                <p>
                                    You don't have an account yet? {'  '}
                                    <Link
                                        href="/register"
                                        className=" text-primary hover:text-primary/80 underline-offset-2 hover:underline hover:cursor-pointer"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>

                        </CardFooter>

                    </form>

                </Form>
            </Card>



        </div>
    );
}

export default LoginForm