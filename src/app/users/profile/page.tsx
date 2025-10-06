"use client"
import ProfilePage from '@/components/users/ProfilePage'
import ProfileCompletionPage from '@/components/users/ProfileCompletionPage'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import getUserPrefs from '@/utils/getUserPrefs'

interface prefsType {

    id: string,
    isCompleted: boolean,
    totalListings: number

}

const page = () => {
    const { user } = useAuthStore()
    const [prefs, setPrefs] = useState<prefsType | null>()
    // Getting the user props 

    useEffect(() => {
        async function getprefs() {
            try {

                const res = await getUserPrefs(user?.$id!) as prefsType
                // console.log(res)
                setPrefs(res)
            } catch (error) {
                console.error(error)
            }
        }
        getprefs()
    }, [])

    if (prefs === null) return (<h1>Loading ...</h1>)

    return (
        <div className='w-full h-[calc(100vh-4rem)]  flex items-center justify-center'>

            {prefs?.isCompleted ? (<ProfilePage />) : (<ProfileCompletionPage />)}
            {/* <ProfileCompletionPage /> */}
        </div>
    )
}

export default page