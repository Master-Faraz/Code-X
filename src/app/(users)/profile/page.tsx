
import ProfilePage from '@/components/users/ProfilePage'
import ProfileCompletionPage from '@/components/users/ProfileCompletionPage'
import React from 'react'

const page = () => {
    return (
        <div className='w-full h-[calc(100vh-4rem)]  flex items-center justify-center'>
            {/* <ProfileCompletionPage /> */}
            <ProfilePage />
        </div>
    )
}

export default page