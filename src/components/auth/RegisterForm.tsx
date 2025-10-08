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

    const router = useRouter()

    // creating all the states and variables
    const [loading, setLoading] = useState(false);
    const createAccount = useAuthStore((state) => state.createAccount);
    const login = useAuthStore((state) => state.login);


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
            router.push("/users/profile")

        } catch (error: any) {
            toast.error('Something went wrong');
            toast.error(error.message);
            console.error(error)
            // await new Promise((resolve) => setTimeout(resolve, 1200)); // Delay before toast
            // toast.error('Something went wrong while creating account');

            // console.log('Error while creating account :: ' + error?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col text-card-foreground">
            <Card className="bg-card w-full min-w-[320px] max-w-none sm:min-w-[380px] sm:max-w-md shadow-lg">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-4">
                        <CardHeader className="flex flex-col items-center justify-center space-y-3 px-4 sm:px-6 py-4">
                            <CardTitle className="text-card-foreground text-center">
                                <span className="text-lg sm:text-xl md:text-2xl font-semibold">Create your account</span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-4 sm:px-6 space-y-4 sm:space-y-4">
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
                        </CardContent>

                        <CardFooter className="px-4 sm:px-6  space-y-4 flex flex-col">
                            <Button
                                type="submit"
                                variant={'secondary'}
                                className="w-full h-10  text-sm sm:text-base focus-visible:ring-ring transition-all duration-200 ease-in-out cursor-pointer font-medium hover:shadow-2xl"
                                disabled={loading}
                            >
                                {loading ? 'Registering the user...' : 'Register'}
                            </Button>


                            <div className="flex flex-col items-center justify-center space-y-2 mt-4 text-slate-500">
                                <p className="text-sm">OR</p>
                                <p>
                                    Already have an account{' '}

                                    <Link
                                        href="/auth/login"
                                        className=" text-primary hover:text-primary/80 underline-offset-2 hover:underline hover:cursor-pointer"
                                    >
                                        Login
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

export default RegisterForm