"use client";

import ProfilePage from "@/components/users/ProfilePage";
import ProfileCompletionPage from "@/components/users/ProfileCompletionPage";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import getUserPrefs from "@/utils/getUserPrefs";

export interface UserPrefsType {
    id: string;
    isCompleted: boolean;
    totalListings: number;
}

const Page = () => {
    const user = useAuthStore(state => state.user);
    const [prefs, setPrefs] = useState<UserPrefsType | null>(null);

    async function getprefs() {
        try {
            if (!user) return;
            const res = (await getUserPrefs(user.$id)) as UserPrefsType;
            setPrefs(res);
            // console.log("Fetched prefs:", res);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (!user || prefs) return;
        getprefs();
    }, [user]);

    if (prefs === null) {
        return (
            <div className="flex flex-col items-center justify-center">
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
            {prefs.isCompleted ? <ProfilePage id={prefs.id} uid={user?.$id} /> : <ProfileCompletionPage />}
        </div>
    );
};

export default Page;
