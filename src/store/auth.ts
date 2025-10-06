import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

import { AppwriteException, ID, Models } from 'appwrite';
import { account } from '@/models/client/config';

// Step 1 : Interface Defination

export interface UserPrefs {
  id?: string;
  isCompleted?: boolean;
  totalListings?: number;
  theme?: 'light' | 'dark';
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
  updateUser(prefs: Partial<UserPrefs>): null;
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
          // console.log(session);
          set({ session }); //   setting the session state
        } catch (error) {
          console.log(error);
        }
      },

      async createAccount(name: string, email: string, password: string) {
        try {
          // creating the user
          const response = await account.create(ID.unique(), email, password, name);
          // console.log(response);
          // creting userPrefs
          const res = await fetch('/api/create-prefs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID: response.$id })
          });

          const result = await res.json();
          if (!res.ok || !result.success) {
            console.error('Failed to create prefs:', result.message);
          }

          return { success: true, message: 'Account created successfully' };
        } catch (error) {
          // console.log(error);
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

          set({ session, user, jwt });

          return { success: true, message: 'Logged in successfully' };
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
          return { success: true, message: 'Logged out successfully' };
        } catch (error) {
          // console.error(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null
          };
        }
      },

      async updateUser(prefs: Partial<UserPrefs>) {
        set((state) => {
          if (state.user) {
            state.user = {
              ...state.user,
              prefs: {
                ...state.user.prefs,
                ...prefs
              }
            };
          }
        });

        return { success: true, message: 'User state updated locally' };
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
