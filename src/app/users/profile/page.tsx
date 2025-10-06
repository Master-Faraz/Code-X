"use client"
import ProfilePage from '@/components/users/ProfilePage'
import ProfileCompletionPage from '@/components/users/ProfileCompletionPage'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import getUserPrefs from '@/utils/getUserPrefs'

export interface UserPrefsType {

    id: string,
    isCompleted: boolean,
    totalListings: number

}

const page = () => {
    const { user } = useAuthStore()
    const [prefs, setPrefs] = useState<UserPrefsType | null>()

    // Getting the user prefs and storing it in state
    useEffect(() => {
        if (!user) return

        async function getprefs() {
            try {

                const res = await getUserPrefs(user?.$id!) as UserPrefsType
                setPrefs(res)
            } catch (error) {
                console.error(error)
            }
        }
        getprefs()
    }, [])

    if (prefs === null) return (
        <div className='flex flex-col items-center justify-center'>
            <h1>Loading ...</h1>
        </div>
    )

    return (
        <div className='w-full h-[calc(100vh-4rem)]  flex items-center justify-center'>

            {prefs?.isCompleted ? (<ProfilePage />) : (<ProfileCompletionPage />)}
            {/* <ProfileCompletionPage /> */}
        </div>
    )
}

export default page