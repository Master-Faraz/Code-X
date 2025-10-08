"use client"
import { updateUserPrefs, createUserPrefs } from '@/actions/userPrefs.action'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import getUserPrefs from '@/utils/getUserPrefs'
import React, { useState } from 'react'
import { toast } from 'sonner'

const page = () => {
  // const data = {
  //   "$id": "68bf9e420020cdb3661d",
  //   "$createdAt": "2025-09-09T03:25:55.096+00:00",
  //   "$updatedAt": "2025-09-12T15:31:36.032+00:00",
  //   "name": "Faraz",
  //   "registration": "2025-09-09T03:25:55.095+00:00",
  //   "status": true,
  //   "labels": [],
  //   "passwordUpdate": "2025-09-09T03:25:55.095+00:00",
  //   "email": "farazali9028@gmail.com",
  //   "phone": "",
  //   "emailVerification": false,
  //   "phoneVerification": false,
  //   "mfa": false,
  //   "prefs": {},
  //   "targets": [
  //     {
  //       "$id": "68bf9e432144521c20ab",
  //       "$createdAt": "2025-09-09T03:25:55.136+00:00",
  //       "$updatedAt": "2025-09-09T03:25:55.136+00:00",
  //       "name": "",
  //       "userId": "68bf9e420020cdb3661d",
  //       "providerId": null,
  //       "providerType": "email",
  //       "identifier": "farazali9028@gmail.com",
  //       "expired": false
  //     }
  //   ],
  //   "accessedAt": "2025-09-12T15:31:36.029+00:00"
  // }

  // const [first, setfirst] = useState(second)

  const user = useAuthStore(state => state.user);


  const userID = user?.$id || ""

  const handlePrefs = async () => {
    try {
      await createUserPrefs({ userID })
      // console.log(response)
    } catch (error: any) {
      console.error("Error while creating prefs " + error?.message)
    }
  }
  const handlePrefsUpdate = async () => {
    try {
      await updateUserPrefs({
        userID: userID,
        updates: { isCompleted: true, id: '98766541230', totalListings: 42, },
      });
      // console.log(response)
    } catch (error: any) {
      console.error("Error while creating prefs " + error?.message)
    }
  }

  const getuserPrefsbtn = async () => {
    try {
      // const response = await getUserPrefs("fdjhjkdfshkjdsf")
      const response = await getUserPrefs("68e024d3001dcc4a276b")
      console.log(response)
    } catch (error: any) {
      toast.error(error.message)
    }
  }


  return (
    <div className='flex flex-col items-center justify-center h-screen w-full bg-background gap-6'>
      <Button onClick={handlePrefs}>Get id</Button>
      <Button onClick={handlePrefsUpdate}>update</Button>
      <Button onClick={getuserPrefsbtn}>get user prefs</Button>
    </div>
  )
}

export default page