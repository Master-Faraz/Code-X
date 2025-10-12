"use client"

import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    Card, CardContent, CardHeader, CardDescription, CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CustomFormField, { FormFieldType } from '@/components/CustomFormField'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import {
    User, Edit3, Save, X, Camera, Crown, Shield, Clock,
    MapPin, Mail, Phone, Calendar, TrendingUp, CheckCircle,
    AlertCircle, Bell, Lock, FileText, Download, ScrollText,
    Upload
} from 'lucide-react'
import { toast } from 'sonner'
import { CldImage } from 'next-cloudinary'
import { SelectItem } from '../ui/select'

import getUserDocument from '@/actions/getUserDocument.action'
import { UserPrefsType } from '@/app/users/profile/page'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


// image upload imports

import uploadImage from '@/actions/imageUploader.action'
import { ImageSizeKey } from '@/constants/imageUploaderConstants'
import { HttpError } from '@/utils/httpError'
import { Input } from '../ui/input'


export interface DisplayProfilePageProps {
    prefs: UserPrefsType;
}


const profileSchema = z.object({
    fname: z.string().min(2, 'First name must be at least 2 characters'),
    lname: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
    dob: z.date(),
    gender: z.enum(['Male', 'Female', 'Others']),
    profile_pic: z.string()
})


type ProfileFormValues = z.infer<typeof profileSchema>


interface UserDataType {
    // uid: string;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    profile_pic: string;
    dob: Date;
    created_at: Date

    gender: 'Male' | 'Female' | 'Others';
    // is_complete: boolean;
    plan_type: 'Free' | 'Premium' | 'Professional'
    plan_start_date: string | null;
    plan_end_date: string | null;
}





const DisplayProfilePage: React.FC<DisplayProfilePageProps> = ({ prefs }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState<UserDataType | null>(null);

    // Image upload states
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploadingImage, setUploadingImage] = useState(false)



    // Getting the data from user document then filtering it and set it to the state
    const getUserData = async () => {
        try {
            const { data } = await getUserDocument(prefs.id)
            if (data)
                setUserData({
                    fname: data.fname,
                    lname: data.lname,
                    email: data.email,
                    phone: data.phone,
                    profile_pic: data.profile_pic,
                    dob: new Date(data.dob),
                    created_at: new Date(data.created_at),
                    gender: data.gender,
                    plan_type: data.plan_type,
                    plan_start_date: data.plan_start_date,
                    plan_end_date: data.plan_end_date,
                })
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {

        getUserData()
    }, [])


    // Profile Picture Avatar Component
    const ProfilePictureAvatar = () => {
        if (imagePreview) {
            return (
                <div className="relative">
                    <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover border-4 border-background shadow-lg"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                        onClick={removeImage}
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







    // image upload use effect

    useEffect(() => {
        if (!userData) return
        form.reset({
            fname: userData.fname,
            lname: userData.lname,
            email: userData.email,
            phone: userData.phone,
            dob: userData.dob,
            gender: userData.gender,
            profile_pic: userData.profile_pic
        })
        setImagePreview(null)
        setImageFile(null)

    }, [userData])


    // This function will handle the image when selected by user
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file')
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB')
                return
            }
            setImageFile(file)
            const previewUrl = URL.createObjectURL(file)
            setImagePreview(previewUrl)
        }
    }

    // Removes image from updated file
    const removeImage = () => {
        setImageFile(null)
        setImagePreview(null)
        form.setValue('profile_pic', '')
        const fileInput = document.getElementById('edit-pic-input') as HTMLInputElement
        if (fileInput) {
            fileInput.value = ''
        }
    }

    // Setting the image value in Form
    const uploadProfileImage = async () => {
        if (!imageFile) return null
        setUploadingImage(true)
        try {
            const result = await uploadImage({
                file: imageFile,
                sizeKeys: [ImageSizeKey.CARD],
                oldimageID: userData?.profile_pic
            })
            if (result?.public_id) {
                form.setValue('profile_pic', result.public_id)
                toast.success('Profile picture uploaded successfully')
                return result.public_id
            }
        } catch (err: any) {
            if (err instanceof HttpError) {
                toast.error(`Upload failed: ${err.message}`)
            } else {
                toast.error('Failed to upload profile picture')
            }
        } finally {
            setUploadingImage(false)
        }
        return null
    }


    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fname: userData?.fname || "",
            lname: userData?.lname || "",
            email: userData?.email || "",
            phone: userData?.phone || "",
            dob: userData?.dob ?? new Date(),
            gender: userData?.gender || "Male",
            profile_pic: userData?.profile_pic || ""
        }
    })

    // keep form in sync when userData changes
    useEffect(() => {
        form.reset({
            fname: userData?.fname,
            lname: userData?.lname,
            email: userData?.email,
            phone: userData?.phone,
            dob: userData?.dob,
            gender: userData?.gender,
            profile_pic: userData?.profile_pic
        })
    }, [userData])


    const handleEdit = () => {
        setIsEditing(true)
        form.reset({
            fname: userData?.fname,
            lname: userData?.lname,
            email: userData?.email,
            phone: userData?.phone,
            dob: userData?.dob,
            gender: userData?.gender,
            profile_pic: userData?.profile_pic
        })
    }

    const handleCancel = () => {
        form.reset({
            fname: userData?.fname,
            lname: userData?.lname,
            email: userData?.email,
            phone: userData?.phone,
            dob: userData?.dob,
            gender: userData?.gender,
            profile_pic: userData?.profile_pic
        })
        setImagePreview(null)
        setImageFile(null)
        setIsEditing(false)
    }

    // TODO: refactor the code 
    const onSubmit = async (values: ProfileFormValues) => {
        setLoading(true)
        try {
            let profilePicId = values.profile_pic || ''
            if (imageFile) {
                profilePicId = await uploadProfileImage() || ''
            }

            setUserData((prev: any) => ({
                ...prev,
                ...values,
                profile_pic: profilePicId
            }))
            setIsEditing(false)
            toast.success('Profile updated successfully!')
        } catch {
            toast.error('Failed to update profile')
        } finally {
            setLoading(false)
        }
    }



    const formatDate = (iso: string) => {
        if (!iso) return '—';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return iso;
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }


    const getInitials = (f: string, l: string) => `${(f || '?')[0]}${(l || '?')[0]}`.toUpperCase()

    if (!userData) return (
        <div className='flex items-center justify-center'>
            <h1>Loading</h1>
        </div>
    )

    return (
        <div className="min-h-screen bg-background w-full h-screen">
            {/* Header */}
            <header className=" border-b sticky top-0 z-20 shadow-sm backdrop-blur-sm " role="banner">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <hgroup className="flex items-center gap-4">
                        <figure className="w-10 h-10 ">
                            <Avatar className="w-10 h-10">
                                {userData?.profile_pic ? (
                                    <CldImage
                                        width={40}
                                        height={40}
                                        src={userData.profile_pic}
                                        alt={`${userData.fname} ${userData.lname} profile picture`}
                                        crop="auto"
                                        gravity="face"
                                        quality="auto"
                                        format="auto"
                                        className="rounded-full"
                                        priority
                                    />
                                ) : (
                                    <AvatarFallback>{getInitials(userData?.fname, userData.lname)}</AvatarFallback>
                                )}
                            </Avatar>
                        </figure>
                        <div className='hidden md:block'>
                            <h1 className="text-lg font-semibold">Profile Dashboard</h1>
                            <p className=" text-sm text-slate-600">Manage your account settings</p>
                        </div>
                    </hgroup>
                    <nav className="flex items-center gap-3" role="navigation" aria-label="Profile actions">
                        <Button variant="ghost" size="sm" aria-label="Notifications">
                            <Bell className="w-4 h-4" />
                        </Button>

                        {!isEditing && (
                            <Button size="sm" onClick={handleEdit} aria-label="Edit profile">
                                <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                            </Button>
                        )}
                    </nav>
                </div>
            </header>


            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8 mt-8 " role="main">
                {/* Statistics Section */}
                <section aria-labelledby="stats-heading" className="flex flex-wrap -mx-3 mb-8">
                    <h2 id="stats-heading" className="sr-only">Account Statistics</h2>

                    {[
                        {
                            label: 'Profile Complete',
                            value: `100%`,
                            icon: <TrendingUp className="w-6 h-6" />,
                            cardClasses: 'flex bg-gradient-to-r from-blue-500 to-blue-600 text-white',
                            iconClasses: 'w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center'
                        },
                        {
                            label: 'Member Since',
                            value: formatDate(userData.created_at.toISOString()),
                            icon: <Calendar className="w-6 h-6" />,
                            cardClasses: 'flex bg-gradient-to-r from-green-500 to-green-600 text-white',
                            iconClasses: 'w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center'
                        },
                        {
                            label: 'Plan Status',
                            value: userData.plan_type,
                            icon: <Crown className="w-6 h-6" />,
                            cardClasses: 'flex bg-gradient-to-r from-purple-500 to-purple-600 text-white',
                            iconClasses: 'w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center'
                        },
                        {
                            label: 'Total Listings',
                            value: `${prefs.totalListings === undefined ? 0 : prefs.totalListings}`,
                            icon: <ScrollText className="w-6 h-6" />,
                            cardClasses: 'flex bg-gradient-to-r from-orange-500 to-orange-600 text-white',
                            iconClasses: 'w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center'
                        }
                    ].map((stat) => (
                        <div key={stat.label} className="w-full sm:w-1/2 lg:w-1/4 px-3 mb-6">
                            <Card className={stat.cardClasses}>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-90">{stat.label}</p>
                                        <data value={stat.value} className="text-xl font-bold">{stat.value}</data>
                                    </div>
                                    <figure className={stat.iconClasses} aria-hidden="true">
                                        {stat.icon}
                                    </figure>
                                </CardContent>
                            </Card>
                        </div>
                    ))}

                </section>


                {/* Profile Content Layout */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Profile Section */}
                    <section className="flex-1 space-y-8" aria-labelledby="profile-heading">
                        <article>
                            <Card>
                                <CardHeader className="flex justify-between items-center border-b">
                                    <hgroup className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center" aria-hidden="true">
                                            <User className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <div>
                                            <CardTitle id="profile-heading">Personal Information</CardTitle>
                                            <CardDescription>Basic profile & contact details</CardDescription>
                                        </div>
                                    </hgroup>
                                    {/* <Badge variant={userData.profileCompleteness >= 90 ? 'default' : 'secondary'}> */}
                                    <Badge variant={'default'}>
                                        <CheckCircle className="w-3 h-3 mr-1" aria-hidden="true" />
                                        {'Complete'}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    {!isEditing ? (
                                        <>
                                            <header className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                                <figure className="relative">
                                                    <Avatar className="w-20 h-20 border-4 rounded-full overflow-hidden">
                                                        {userData.profile_pic ? (
                                                            <CldImage
                                                                width={80}
                                                                height={80}
                                                                src={userData.profile_pic}
                                                                alt={`${userData.fname} ${userData.lname} profile picture`}
                                                                crop="fill"
                                                                gravity="face"
                                                                quality="auto"
                                                                format="auto"
                                                                className="rounded-full"
                                                            />
                                                        ) : (
                                                            <AvatarFallback>{getInitials(userData.fname, userData.lname)}</AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    {/* opening dialogue to change the profile pic */}

                                                    <Dialog >
                                                        <DialogTrigger className='absolute bottom-0 right-0'>
                                                            <div className=" rounded-full w-8 h-8 p-0 bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 flex items-center justify-center hover:cursor-pointer" aria-label="Change profile picture" >
                                                                <Camera className="w-4 h-4" aria-hidden="true" />
                                                            </div>
                                                        </DialogTrigger>

                                                        <DialogContent className='flex flex-col items-center justify-center space-y-6'>
                                                            <DialogHeader className='flex items-center justify-center mt-2'>
                                                                <DialogTitle>Update your Profile picture</DialogTitle>
                                                            </DialogHeader>

                                                            {/* Dialogue content */}

                                                            <div className='flex  flex-col space-y-6 items-center justify-center'>

                                                                {!imagePreview && !imageFile ? (
                                                                    <Avatar className="w-20 h-20 border-4 rounded-full overflow-hidden">
                                                                        {userData.profile_pic ? (
                                                                            <CldImage
                                                                                width={80}
                                                                                height={80}
                                                                                src={userData.profile_pic}
                                                                                alt={`${userData.fname} ${userData.lname} profile picture`}
                                                                                crop="fill"
                                                                                gravity="face"
                                                                                quality="auto"
                                                                                format="auto"
                                                                                className="rounded-full"
                                                                            />
                                                                        ) : (
                                                                            <AvatarFallback>{getInitials(userData.fname, userData.lname)}</AvatarFallback>
                                                                        )}

                                                                    </Avatar>
                                                                ) : (
                                                                    <ProfilePictureAvatar />
                                                                )}




                                                                {/* Avatar picture change */}
                                                                <div className="flex flex-col items-center space-y-2">
                                                                    <Input
                                                                        id="profile-pic-input"
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={handleImageChange}
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
                                                                        {userData.profile_pic ? 'Change Picture' : 'Upload Picture'}
                                                                    </Button>
                                                                    <p className="text-xs text-muted-foreground/50 text-center">
                                                                        JPG, PNG or GIF. Max size 5MB.
                                                                    </p>
                                                                </div>

                                                            </div>
                                                            <DialogFooter className='flex items-center w-full justify-between px-6 '>
                                                                <DialogClose asChild>
                                                                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                                                                </DialogClose>

                                                                <Button >Save changes</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>





                                                </figure>
                                                <hgroup className="flex-1 space-y-2">
                                                    <h3 className="text-2xl font-semibold">{userData.fname} {userData.lname}</h3>
                                                    <address className="not-italic text-slate-600">{userData.email}</address>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" aria-hidden="true" />
                                                            <span>India</span>
                                                        </span>
                                                        <span className="flex items-center gap-1 text-green-600">
                                                            <Clock className="w-4 h-4" aria-hidden="true" />
                                                            <span>Online</span>
                                                        </span>
                                                    </div>
                                                </hgroup>
                                            </header>





                                            <Separator />


                                            <section aria-labelledby="details-heading">
                                                <h4 id="details-heading" className="sr-only">Personal Details</h4>
                                                <dl className="flex flex-wrap -mx-3">
                                                    {[
                                                        { name: 'fname', label: 'First Name', icon: <User className="w-4 h-4 text-slate-400" />, value: userData.fname },
                                                        { name: 'lname', label: 'Last Name', icon: <User className="w-4 h-4 text-slate-400" />, value: userData.lname },
                                                        { name: 'email', label: 'Email', icon: <Mail className="w-4 h-4 text-slate-400" />, value: userData.email },
                                                        { name: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4 text-slate-400" />, value: userData.phone },
                                                        { name: 'dob', label: 'Date of Birth', icon: <Calendar className="w-4 h-4 text-slate-400" />, value: (formatDate(userData.created_at.toISOString())) },
                                                        { name: 'gender', label: 'Gender', icon: <User className="w-4 h-4 text-slate-400" />, value: userData.gender }
                                                    ].map((field) => (
                                                        <div key={field.name} className="w-full md:w-1/2 px-3 mb-6">
                                                            <dt className="text-sm font-semibold text-slate-700 mb-2 block">{field.label}</dt>
                                                            <dd className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                                <span aria-hidden="true">{field.icon}</span>
                                                                <span className="ml-3 text-slate-900 font-medium">{field.value}</span>
                                                            </dd>
                                                        </div>
                                                    ))}
                                                </dl>
                                            </section>
                                        </>
                                    ) : (

                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                                                <fieldset className="flex flex-wrap -mx-3 gap-y-6">
                                                    <legend className="sr-only">Personal Information Form</legend>

                                                    {[
                                                        { name: 'fname', label: 'First Name', fieldType: FormFieldType.INPUT, iconAlt: 'user' },
                                                        { name: 'lname', label: 'Last Name', fieldType: FormFieldType.INPUT, iconAlt: 'user' },
                                                        { name: 'email', label: 'Email', fieldType: FormFieldType.INPUT, iconAlt: 'mail' },
                                                        { name: 'phone', label: 'Phone', fieldType: FormFieldType.INPUT, iconAlt: 'phone' },
                                                        { name: 'dob', label: 'Date of Birth', fieldType: FormFieldType.DATE_Picker },
                                                        { name: 'gender', label: 'Gender', fieldType: FormFieldType.SELECT }
                                                    ].map((field) => (
                                                        <div key={field.name} className="w-full md:w-1/2 px-3">
                                                            <CustomFormField
                                                                fieldType={field.fieldType}
                                                                control={form.control}
                                                                name={field.name}
                                                                label={field.label}
                                                                placeholder={field.label}
                                                                iconAlt={field.iconAlt}
                                                            >
                                                                {field.name === 'gender' && (
                                                                    <>
                                                                        <SelectItem value="Male">Male</SelectItem>
                                                                        <SelectItem value="Female">Female</SelectItem>
                                                                        <SelectItem value="Others">Others</SelectItem>
                                                                    </>
                                                                )}
                                                            </CustomFormField>
                                                        </div>
                                                    ))}
                                                </fieldset>


                                                <footer className="flex gap-3 pt-6 border-t border-slate-200">
                                                    <Button
                                                        type="submit"
                                                        disabled={loading || uploadingImage}  // Add uploadingImage here
                                                        className="bg-slate-900 hover:bg-slate-800"
                                                    >
                                                        <Save className="w-4 h-4 mr-2" />
                                                        {loading || uploadingImage ? 'Saving...' : 'Save Changes'}
                                                    </Button>

                                                    <Button type="button" variant="outline" onClick={handleCancel}>
                                                        <X className="w-4 h-4 mr-2" aria-hidden="true" /> Cancel
                                                    </Button>
                                                </footer>
                                            </form>
                                        </Form>
                                    )}
                                </CardContent>
                            </Card>
                        </article>
                    </section>


                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 flex flex-col gap-6" role="complementary" aria-label="Account information sidebar">
                        {/* Account Status */}
                        <section aria-labelledby="account-status-heading">
                            <Card>
                                <CardHeader>
                                    <CardTitle id="account-status-heading">Account Status</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4">
                                    {[
                                        { icon: <CheckCircle className="w-5 h-5 text-green-600" />, label: 'Email Verified', classes: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900' } },
                                        { icon: <Shield className="w-5 h-5 text-blue-600" />, label: '2FA Enabled', classes: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900' } },
                                        { icon: <Crown className="w-5 h-5 text-purple-600" />, label: `${userData.plan_type} Plan`, classes: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900' } }
                                    ].map((item) => (
                                        <div key={item.label} className={`flex items-center justify-between p-3 ${item.classes.bg} ${item.classes.border} rounded-lg`}>
                                            <div className={`flex items-center gap-3 ${item.classes.text}`}>
                                                {item.icon}
                                                <span>{item.label}</span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </section>


                        {/* Quick Actions */}
                        <section aria-labelledby="quick-actions-heading">
                            <Card>
                                <CardHeader>
                                    <CardTitle id="quick-actions-heading">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    <nav role="navigation" aria-label="Account management actions">
                                        <Button variant="ghost" className="justify-start w-full">
                                            <Lock className="w-4 h-4 mr-3" aria-hidden="true" /> Change Password
                                        </Button>
                                        <Button variant="ghost" className="justify-start w-full">
                                            <Bell className="w-4 h-4 mr-3" aria-hidden="true" /> Notification Settings
                                        </Button>
                                        <Button variant="ghost" className="justify-start w-full">
                                            <FileText className="w-4 h-4 mr-3" aria-hidden="true" /> Download Data
                                        </Button>
                                        <Button variant="ghost" className="justify-start w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                                            <AlertCircle className="w-4 h-4 mr-3" aria-hidden="true" /> Deactivate Account
                                        </Button>
                                    </nav>
                                </CardContent>
                            </Card>
                        </section>


                        {/* Account Insights */}
                        <section aria-labelledby="insights-heading">
                            <Card>
                                <CardHeader>
                                    <CardTitle id="insights-heading">Account Insights</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4 text-sm">
                                    <dl>
                                        <div className="flex justify-between">
                                            <dt className="text-slate-600">Member since</dt>
                                            <dd>
                                                <time dateTime={userData.created_at.toISOString()}>
                                                    {formatDate(userData.created_at.toISOString())}
                                                </time>
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-slate-600">Last login</dt>
                                            <dd className="font-medium text-green-600">Active now</dd>
                                        </div>

                                    </dl>
                                </CardContent>
                            </Card>
                        </section>
                    </aside>
                </div>
            </main>



        </div>

    )

}

export default DisplayProfilePage;
