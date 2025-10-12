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
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    email: z.string().email('Please enter a valid email.'),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long.' })
});

const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const response = await login(data.email, data.password);
            toast.success('Logged in successfully');
            router.push('/');
        } catch (error: any) {
            toast.error(error?.message || 'Login failed');
            console.error('[LOGIN ERROR]', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col text-card-foreground">
            <Card className="bg-card w-full min-w-[320px] sm:min-w-[380px] sm:max-w-md shadow-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                        <CardHeader className="flex flex-col items-center space-y-3 px-4 py-6">
                            <CardTitle className="text-center text-lg sm:text-xl md:text-2xl font-semibold">
                                Sign in to your account
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-4 sm:px-6 space-y-4 sm:space-y-6">
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="email"
                                label="Email"
                                placeholder="Enter your email"
                            />

                            <CustomFormField
                                fieldType={FormFieldType.PASSWORD}
                                control={form.control}
                                name="password"
                                label="Password"
                                placeholder="Enter your password"
                            />

                            <div className="flex justify-end">
                                <Link href="/auth/forgot-password" className="text-primary hover:underline text-sm">
                                    Forgot password?
                                </Link>
                            </div>
                        </CardContent>

                        <CardFooter className="px-4 sm:px-6 pb-6 space-y-4 flex flex-col">
                            <Button
                                type="submit"
                                variant="secondary"
                                className="w-full h-10 text-sm sm:text-base font-medium"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>

                            <p className="text-center text-sm text-muted-foreground">
                                Don’t have an account?{' '}
                                <Link href="/auth/register" className="text-primary hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default LoginForm;
