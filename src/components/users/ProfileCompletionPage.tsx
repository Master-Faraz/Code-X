'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormFieldType } from '@/components/CustomFormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth'
import React, { useState, useEffect } from 'react'
import { Mail, Shield, User, UserCheck, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { SelectItem } from '../ui/select'
import StepIndicator from './StepIndicator'
import { requestUserVerificationEmail, verifyUserEmailWithOtp } from '@/actions/userVerification.action'


// Combined schema - make some fields optional for step-by-step validation
const formSchema = z.object({
    email: z.string().email('Please enter a valid email.'),
    otp: z.string(),
    firstName: z.string(),
    lastName: z.string().optional(),
    phone: z.string(),
    dateOfBirth: z.date().nullable(),
    gender: z.enum(['male', 'female', 'other']),
    isEmailVerified: z.boolean()
})




const ProfileCompletionPage = () => {

    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [otpSent, setOtpSent] = useState(false)

    const { user } = useAuthStore()

    // 1. Create a type from your schema
    type ProfileFormValues = z.infer<typeof formSchema>;


    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            otp: '',
            firstName: '',
            lastName: '',
            phone: '',
            gender: undefined,
            dateOfBirth: null, // Ensure dateOfBirth is present
            isEmailVerified: false
        }
    })

    // Set email when user data is available
    useEffect(() => {
        if (user?.email) {
            form.setValue('email', user.email)
        }
    }, [user])

    // Handle email verification and OTP
    const handleEmailVerification = async () => {
        setLoading(true)
        const email = form.getValues('email')

        try {
            if (!otpSent) {
                // Send OTP - no validation needed for email since it's pre-filled
                if (!email) {
                    toast.error('Email is required')
                    return
                }

                // Sending OTP email
                // const res = await requestUserVerificationEmail(email);
                // if (!res.success) {
                //     toast.error(res.error);
                //     console.error(res.error)
                // }

                await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call

                setOtpSent(true)
                toast.success('OTP sent successfully')
            } else {
                // Getting and validating OTP
                const otp = form.getValues('otp')
                if (!otp || otp.length !== 6) {
                    toast.error('Please enter a valid 6-digit OTP')
                    return
                }

                // Verifying OTP
                // const res = await verifyUserEmailWithOtp(email, otp);
                // if (!res.success) {
                //     toast.error(res.error);
                //     console.error(res.error)
                // }

                await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call

                form.setValue('isEmailVerified', true)
                toast.success('Email verified successfully')
                setStep(2)
            }
        } catch (error: any) {
            toast.error('Something went wrong')
            if (error?.message) {
                toast.error(error.message)
            }
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Handle basic info submission
    const handleBasicInfoSubmit = async () => {
        setLoading(true)

        try {
            const firstName = form.getValues('firstName')
            const lastName = form.getValues('lastName')
            const phone = form.getValues('phone')

            // Manual validation for step 2
            if (!firstName || firstName.length < 2) {
                toast.error('First name must be at least 2 characters')
                return
            }
            if (!lastName || lastName.length < 2) {
                toast.error('Last name must be at least 2 characters')
                return
            }
            if (!phone || phone.length < 10 || !/^\d+$/.test(phone)) {
                toast.error('Please enter a valid phone number')
                return
            }

            // Your save basic info API call here
            // const res = await saveBasicInfo({ firstName, lastName, phone })
            await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

            toast.success('Basic information saved')
            setStep(3)
        } catch (error: any) {
            toast.error('Failed to save basic information')
            if (error?.message) {
                toast.error(error.message)
            }
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Handle final form submission
    const onSubmit = async (values: ProfileFormValues) => {
        console.log(values)
        setLoading(true)

        try {
            const dateOfBirth = form.getValues('dateOfBirth')
            const gender = form.getValues('gender')

            // Manual validation for step 3
            if (!dateOfBirth) {
                toast.error('Date of birth is required')
                return
            }
            if (!gender) {
                toast.error('Please select a gender')
                return
            }

            if (!values.isEmailVerified) {
                toast.error('Email is not verified')
                return
            }

            // Your complete profile API call here
            // const res = await completeProfile(values)
            await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call

            toast.success('Profile completed successfully!')
            // Redirect to dashboard or main app
            console.log('Profile completed:', values)
        } catch (error: any) {
            toast.error('Failed to complete profile')
            if (error?.message) {
                toast.error(error.message)
            }
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Get step content configuration -> JS Object 
    const getStepConfig = () => {
        switch (step) {
            case 1:
                return {
                    icon: otpSent ? Shield : Mail,
                    title: otpSent ? "Enter Verification Code" : "Verify Your Email",
                    description: otpSent
                        ? `We've sent a 6-digit code to ${form.watch('email') || user?.email}`
                        : "We'll send a verification code to confirm your email address"
                }
            case 2:
                return {
                    icon: User,
                    title: "Complete Your Profile",
                    description: "Let's set up your basic profile information"
                }
            case 3:
                return {
                    icon: UserCheck,
                    title: "Additional Information",
                    description: "Help us personalize your experience"
                }
            default:
                return {}
        }
    }

    const stepConfig = getStepConfig()
    const IconComponent = stepConfig.icon //.    Extracting icon

    // Get current email value for display
    const currentEmail = form.watch('email') || user?.email || ''

    return (
        <div className=' w-full flex items-center justify-center  p-4'>
            <div className="w-full max-w-md">
                {/* Progress Indicator */}
                <StepIndicator currentStep={step} />

                {/* Main Card */}
                <Card className="bg-card/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Header */}
                            <CardHeader className="text-center space-y-6 pb-8">
                                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                                    {IconComponent && <IconComponent className="w-10 h-10 text-primary" />}
                                </div>

                                <div className="space-y-3">
                                    <CardTitle className="text-2xl font-bold tracking-tight">
                                        {stepConfig.title}
                                    </CardTitle>

                                    <CardDescription className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
                                        {stepConfig.description}
                                    </CardDescription>
                                </div>
                            </CardHeader>

                            {/* Content */}
                            <CardContent className="px-6 pb-6 space-y-4">
                                {step === 1 && !otpSent && (
                                    <section className="text-center space-y-4">
                                        <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-xl border">
                                            <Mail className="w-5 h-5 text-muted-foreground" />
                                            <span className="font-medium text-foreground">
                                                {currentEmail || 'Loading...'}
                                            </span>
                                        </div>
                                    </section>
                                )}

                                {step === 1 && otpSent && (
                                    <section className="space-y-4 flex flex-col items-center justify-center mt-4">

                                        <CustomFormField
                                            fieldType={FormFieldType.OTP}
                                            control={form.control}
                                            name="otp"
                                            label="Enter OTP"
                                            placeholder="Enter 6-digit code"
                                            className=""
                                        />

                                        {/* Resend email */}
                                        <div className="text-center text-muted-foreground ">
                                            <span>Didn't receive the code?
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    size="sm"
                                                    onClick={() => {
                                                        setOtpSent(false)
                                                        form.setValue('otp', '') // Clear OTP when resending
                                                    }}
                                                    disabled={loading}
                                                    className="hover:text-foreground text-primary"
                                                >
                                                    Resend
                                                </Button></span>

                                        </div>
                                    </section>
                                )}

                                {step === 2 && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <CustomFormField
                                                fieldType={FormFieldType.INPUT}
                                                control={form.control}
                                                name="firstName"
                                                label="First Name"
                                                placeholder="Enter first name"
                                                className="w-full"
                                            />
                                            <CustomFormField
                                                fieldType={FormFieldType.INPUT}
                                                control={form.control}
                                                name="lastName"
                                                label="Last Name"
                                                placeholder="Enter last name"
                                                className="w-full"
                                            />
                                        </div>

                                        <CustomFormField
                                            fieldType={FormFieldType.INPUT}
                                            control={form.control}
                                            name="phone"
                                            label="Phone Number"
                                            placeholder="Enter phone number"
                                            iconAlt="phone"
                                            className="w-full"
                                        />
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-4 flex flex-col w-full">
                                        <CustomFormField
                                            fieldType={FormFieldType.DATE_Picker}
                                            control={form.control}
                                            name="dateOfBirth"
                                            label="Date of Birth"
                                            placeholder="Select date of birth"
                                            className="w-full"
                                        />

                                        <CustomFormField
                                            fieldType={FormFieldType.SELECT}
                                            control={form.control}
                                            name="gender"
                                            label="Gender"
                                            placeholder="Select gender"
                                            className="w-full"
                                        >
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </CustomFormField>
                                    </div>
                                )}

                            </CardContent>

                            {/* Actions */}
                            <CardFooter className="flex flex-col space-y-4 pt-6">
                                {step === 1 && (
                                    <Button
                                        type="button"
                                        onClick={handleEmailVerification}
                                        disabled={loading || !currentEmail}
                                        className="w-full h-12 text-base font-medium"
                                        size="lg"
                                    >
                                        {loading ? (
                                            otpSent ? "Verifying..." : "Sending..."
                                        ) : (
                                            otpSent ? "Verify & Continue" : "Send Verification Code"
                                        )}
                                    </Button>
                                )}

                                {step === 2 && (
                                    <div className="flex gap-3 w-full">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setStep(1)
                                                setOtpSent(true)
                                            }}
                                            className="flex-1 h-12"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleBasicInfoSubmit}
                                            disabled={loading}
                                            className="flex-1 h-12 text-base font-medium"
                                            size="lg"
                                        >
                                            {loading ? "Saving..." : "Continue"}
                                        </Button>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="flex gap-3 w-full">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep(2)}
                                            className="flex-1 h-12"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 h-12 text-base font-medium"
                                            size="lg"
                                        >
                                            {loading ? "Completing..." : "Complete Profile"}
                                        </Button>
                                    </div>
                                )}
                            </CardFooter>
                        </form>
                    </Form>
                </Card>

                {/* Help Text */}
                <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                        Need help? <Button variant="link" className="p-0 h-auto text-sm font-medium">Contact Support</Button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ProfileCompletionPage