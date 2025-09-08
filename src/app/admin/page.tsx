// app/admin/page.tsx
import getOrCreateDB from '@/models/server/dbSetup';

export const revalidate = 0; // disable caching so form always submits

export default function SetupDbPage() {
    async function setupDbAction() {
        'use server';
        try {
            const response = await getOrCreateDB();
            console.log("Admin response")
            console.log(response)
        } catch (error) {
            console.error("Admin Error ")
            console.error(error)

        }
    }

    return (
        <div style={{ padding: '2rem' }} className='w-full h-screen  flex flex-col items-center justify-center'>
            <h1>Database Setup</h1>
            <form action={setupDbAction}>
                {/* <button type="submit">Run Setup</button> */}
            </form>
        </div>
    );
}
