"use client"
import { updateUserPrefs } from '@/actions/userPrefs.action'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import getUserPrefs from '@/utils/getUserPrefs'
import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Camera } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { DialogClose } from '@radix-ui/react-dialog'

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


  const user = useAuthStore(state => state.user);


  const userID = user?.$id || ""

  const handlePrefs = async () => {
    try {
      // await createUserPrefs({ userID })
      // console.log(response)
      console.log("HEHE")
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
      <Dialog>
        <DialogTrigger><Camera className='text-red-300 hover:text-amber-300' /></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>



      <Dialog>
        <form>

          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">

            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>


            <div className="grid gap-4">
              <div className="grid gap-3">
                <div>Name</div>
                <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <div >Username</div>
                <Input id="username-1" name="username" defaultValue="@peduarte" />
              </div>
            </div>


            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>



    </div>
  )
}

export default page