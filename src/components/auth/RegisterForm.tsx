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
import { ErrorType } from '@/utils/errorHandler';

const formSchema = z
    .object({
        username: z.string().min(1, { message: 'Please enter a valid username' }),
        email: z.string().email('Please enter a valid email'),
        password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

const RegisterForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const createAccount = useAuthStore((state) => state.createAccount);
    const login = useAuthStore((state) => state.login);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { username: '', email: '', password: '', confirmPassword: '' }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            await createAccount(data.username, data.email, data.password);
            await login(data.email, data.password);
            toast.success('Account created successfully');
            router.push('/users/profile');
        } catch (error: unknown) {
            const err = error as ErrorType;
            toast.error(err?.message || 'Failed to create account');
            console.error('[REGISTER ERROR]', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col text-card-foreground">
            <Card className="bg-card w-full min-w-[320px] sm:min-w-[380px] sm:max-w-md shadow-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                        <CardHeader className="flex flex-col items-center space-y-3 px-4 sm:px-6 py-6">
                            <CardTitle className="text-center text-lg sm:text-xl md:text-2xl font-semibold">
                                Create your account
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-4 sm:px-6 space-y-4">
                            <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="username" label="Username" />
                            <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="email" label="Email" />
                            <CustomFormField fieldType={FormFieldType.PASSWORD} control={form.control} name="password" label="Password" />
                            <CustomFormField fieldType={FormFieldType.PASSWORD} control={form.control} name="confirmPassword" label="Confirm Password" />
                        </CardContent>

                        <CardFooter className="px-4 sm:px-6 pb-6 space-y-4 flex flex-col">
                            <Button
                                type="submit"
                                variant="secondary"
                                className="w-full h-10 text-sm sm:text-base font-medium"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </Button>

                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link href="/auth/login" className="text-primary hover:underline">
                                    Login
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default RegisterForm;
