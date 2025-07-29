import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

import { AppwriteException, ID, Models, OAuthProvider } from 'appwrite';
import { account } from '@/models/client/config';

// Step 1 : Interface Defination

export interface userPrefs {
  email: string;
  username: string;
}
interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<any> | null;
  hydrated: boolean;

  //   Methods
  setHydrated(): void;
  verifySession(): Promise<void>;
  login(email: string, password: string): Promise<{ success: boolean; error?: AppwriteException | null }>;
  createAccount(name: string, email: string, password: string): Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout(): Promise<{ success: boolean; error?: AppwriteException | null }>;
}

//  Create Store hook
export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      // States defination
      session: null,
      hydrated: false,
      jwt: null,
      user: null,

      // Methods defination

      setHydrated() {
        set({ hydrated: true });
      },

      async verifySession() {
        try {
          const session = await account.getSession('current'); //.   Getting the session
          console.log(session);
          set({ session }); //   setting the session state
        } catch (error) {
          console.log(error);
        }
      },

      async createAccount(name: string, email: string, password: string) {
        try {
          await account.create(ID.unique(), email, password, name);
          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null
          };
        }
      },

      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession(email, password);
          const [user, { jwt }] = await Promise.all([account.get<any>(), account.createJWT()]);
          //   if (!user.prefs?.reputation) await account.updatePrefs<any>({
          //     reputation: 0
          //   })

          set({ session, user, jwt });

          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null
          };
        }
      },

      logout: async () => {
        try {
          await account.deleteSessions();
          set({ session: null, jwt: null, user: null });
          return { success: true };
        } catch (error) {
          // console.error(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null
          };
        }
      }
    })),
    {
      name: 'Auth',
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      }
    }
  )
);
