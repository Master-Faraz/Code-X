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
import { Mail, Shield, User, UserCheck, ArrowLeft, Camera, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { SelectItem } from '../ui/select'
import { Input } from '@/components/ui/input'
import StepIndicator from './StepIndicator'
import { requestUserVerificationEmail, verifyUserEmailWithOtp } from '@/actions/userVerification.action'
import uploadImage from '@/actions/imageUploader.action'
import { CldImage } from 'next-cloudinary'
import { ImageSizeKey } from '@/constants/imageUploaderConstants'
import { HttpError } from '@/utils/httpError'

// Combined schema - mapping to your user collection structure
const formSchema = z.object({
    email: z.string().email('Please enter a valid email.'),
    otp: z.string(),
    fname: z.string().min(2, 'First name must be at least 2 characters'),
    lname: z.string().min(2, 'Last name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
    dob: z.date().nullable(),
    gender: z.enum(['Male', 'Female', 'Others']), // Matching your enum values
    profile_pic: z.string().optional(), // This will store Cloudinary public_id
    isEmailVerified: z.boolean()
})

const ProfileCompletionPage = () => {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
    const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null)
    const [uploadingImage, setUploadingImage] = useState(false)
    const { user } = useAuthStore()

    // Create a type from your schema
    type ProfileFormValues = z.infer<typeof formSchema>;

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            otp: '',
            fname: '',
            lname: '',
            phone: '',
            gender: undefined,
            dob: null,
            profile_pic: '',
            isEmailVerified: false
        }
    })

    // Set email when user data is available
    useEffect(() => {
        if (user?.email) {
            form.setValue('email', user.email)
        }
    }, [user])

    // Handle profile picture selection
    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file')
                return
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB')
                return
            }

            setProfilePicFile(file)

            // Create preview URL
            const previewUrl = URL.createObjectURL(file)
            setProfilePicPreview(previewUrl)
        }
    }

    // Upload profile picture to Cloudinary (only called during final submission)
    const uploadProfilePicture = async () => {
        if (!profilePicFile) return null

        setUploadingImage(true)
        try {
            const result = await uploadImage({
                file: profilePicFile,
                sizeKeys: [ImageSizeKey.CARD]
            })

            if (result?.public_id) {
                form.setValue('profile_pic', result.public_id)
                toast.success('Profile picture uploaded successfully')
                return result.public_id
            }
        } catch (err: any) {
            if (err instanceof HttpError) {
                toast.error(`Upload failed: ${err.message}`)
                console.error('Upload failed:', err.status, err.message)
            } else {
                toast.error('Failed to upload profile picture')
                console.error('Upload failed:', err)
            }
            throw err // Re-throw to handle in calling function
        } finally {
            setUploadingImage(false)
        }
        return null
    }

    // Remove profile picture
    const removeProfilePicture = () => {
        setProfilePicFile(null)
        setProfilePicPreview(null)
        form.setValue('profile_pic', '')

        // Clear the file input
        const fileInput = document.getElementById('profile-pic-input') as HTMLInputElement
        if (fileInput) {
            fileInput.value = ''
        }
    }

    // Handle email verification and OTP
    const handleEmailVerification = async () => {
        setLoading(true)
        const email = form.getValues('email')
        try {
            if (!otpSent) {
                if (!email) {
                    toast.error('Email is required')
                    return
                }
                // const res = await requestUserVerificationEmail(email);
                // if (!res.success) {
                //     toast.error(res.error);
                //     console.error(res.error)
                // }
                await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
                setOtpSent(true)
                toast.success('OTP sent successfully')
            } else {
                const otp = form.getValues('otp')
                if (!otp || otp.length !== 6) {
                    toast.error('Please enter a valid 6-digit OTP')
                    return
                }
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

    // Handle basic info submission (Step 2 -> Step 3)
    const handleBasicInfoSubmit = async () => {
        setLoading(true)
        try {
            const fname = form.getValues('fname')
            const lname = form.getValues('lname')

            // Manual validation for step 2
            if (!fname || fname.length < 2) {
                toast.error('First name must be at least 2 characters')
                return
            }
            if (!lname || lname.length < 2) {
                toast.error('Last name must be at least 2 characters')
                return
            }

            // No image upload here - just move to next step
            await new Promise(resolve => setTimeout(resolve, 800)) // Simulate validation
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

    // Handle final form submission (Step 3 completion)
    const onSubmit = async (values: ProfileFormValues) => {
        setLoading(true)
        try {
            const dob = form.getValues('dob')
            const gender = form.getValues('gender')
            const phone = form.getValues('phone')

            // Manual validation for step 3
            if (!dob) {
                toast.error('Date of birth is required')
                return
            }
            if (!gender) {
                toast.error('Please select a gender')
                return
            }
            if (!phone || phone.length < 10 || !/^\d+$/.test(phone)) {
                toast.error('Please enter a valid phone number')
                return
            }
            if (!values.isEmailVerified) {
                toast.error('Email is not verified')
                return
            }

            // Upload profile picture only now (if selected)
            let profilePicId = ''
            if (profilePicFile) {
                profilePicId = await uploadProfilePicture() || ''
            }

            // Prepare data for your user collection
            const userData = {
                uid: user?.$id || '', // Id from authstore
                fname: values.fname,
                lname: values.lname,
                email: values.email,
                phone: values.phone,
                profile_pic: profilePicId,
                dob: values.dob,
                gender: values.gender,
                is_complete: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                // Optional plan fields - set defaults or leave undefined
                plan_type: 'Free', // Default plan
                plan_start_date: null,
                plan_end_date: null
            }

            // Your complete profile API call here
            // const res = await completeProfile(userData)
            console.log('Profile data to save:', userData)

            await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
            toast.success('Profile completed successfully!')

            // Redirect to dashboard or main app
            console.log('Profile completed:', userData)
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

    // Get step content configuration
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
    const IconComponent = stepConfig.icon

    // Get current email value for display
    const currentEmail = form.watch('email') || user?.email || ''

    // Profile Picture Avatar Component
    const ProfilePictureAvatar = () => {
        if (profilePicPreview) {
            return (
                <div className="relative">
                    <img
                        src={profilePicPreview}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover border-4 border-background shadow-lg"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                        onClick={removeProfilePicture}
                    >
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            )
        }

        return (
            <div className="w-20 h-20 rounded-full bg-muted border-4 border-background shadow-lg flex items-center justify-center">
                <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className='w-full flex items-center justify-center p-4'>
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
                                        <div className="text-center text-muted-foreground">
                                            <span>Didn't receive the code?
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    size="sm"
                                                    onClick={() => {
                                                        setOtpSent(false)
                                                        form.setValue('otp', '')
                                                    }}
                                                    disabled={loading}
                                                    className="hover:text-foreground text-primary"
                                                >
                                                    Resend
                                                </Button>
                                            </span>
                                        </div>
                                    </section>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6">
                                        {/* Profile Picture Upload Section */}
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="text-center">
                                                <label className="text-sm font-medium text-foreground mb-2 block">
                                                    Profile Picture
                                                </label>
                                                <ProfilePictureAvatar />
                                            </div>

                                            <div className="flex flex-col items-center space-y-2">
                                                <Input
                                                    id="profile-pic-input"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleProfilePicChange}
                                                    className="hidden"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => document.getElementById('profile-pic-input')?.click()}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    {profilePicFile ? 'Change Picture' : 'Upload Picture'}
                                                </Button>
                                                <p className="text-xs text-muted-foreground text-center">
                                                    JPG, PNG or GIF. Max size 5MB.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Name Fields */}
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <CustomFormField
                                                    fieldType={FormFieldType.INPUT}
                                                    control={form.control}
                                                    name="fname"
                                                    label="First Name"
                                                    placeholder="Enter first name"
                                                    className="w-full"
                                                />
                                                <CustomFormField
                                                    fieldType={FormFieldType.INPUT}
                                                    control={form.control}
                                                    name="lname"
                                                    label="Last Name"
                                                    placeholder="Enter last name"
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6">
                                        {/* Date of Birth - Full width */}
                                        <CustomFormField
                                            fieldType={FormFieldType.DATE_Picker}
                                            control={form.control}
                                            name="dob"
                                            label="Date of Birth"
                                            placeholder="Pick a date"
                                            className="w-full"
                                        />

                                        {/* Gender - Full width */}
                                        <CustomFormField
                                            fieldType={FormFieldType.SELECT}
                                            control={form.control}
                                            name="gender"
                                            label="Gender"
                                            placeholder="Select gender"
                                            className="w-full"
                                        >
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Others">Others</SelectItem>
                                        </CustomFormField>

                                        {/* Phone Number - Full width */}
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
                                            disabled={loading || uploadingImage}
                                            className="flex-1 h-12 text-base font-medium"
                                            size="lg"
                                        >
                                            {loading || uploadingImage ? "Completing..." : "Complete Profile"}
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