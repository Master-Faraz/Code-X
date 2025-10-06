import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { AppwriteException, ID, Models } from 'appwrite';
import { account } from '@/models/client/config';

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

  // Methods
  setHydrated(): void;
  verifySession(): Promise<void>;
  login(email: string, password: string): Promise<{ success: boolean; error?: AppwriteException | null }>;
  createAccount(name: string, email: string, password: string): Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout(): Promise<{ success: boolean; error?: AppwriteException | null }>;
  updateUser(prefs: Partial<UserPrefs>): null;
}

// Platform detection helper
const isServer = typeof window === 'undefined';
const isMobile = !isServer && /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set, get) => ({
      session: null,
      hydrated: false,
      jwt: null,
      user: null,

      setHydrated() {
        set({ hydrated: true });
      },

      async verifySession() {
        try {
          const session = await account.getSession('current');
          set({ session });
        } catch (error) {
          console.log(error);
          // Clear invalid session
          set({ session: null, jwt: null, user: null });
        }
      },

      async createAccount(name: string, email: string, password: string) {
        try {
          const response = await account.create(ID.unique(), email, password, name);

          // Create user prefs
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

          // Store auth data
          set({ session, user, jwt });

          // Platform-specific token storage
          if (!isServer) {
            if (isMobile) {
              // For mobile: Send JWT as header for future requests
              // This will be handled by your HTTP client interceptor
              localStorage.setItem('auth_token', jwt); // Fallback for mobile web
            } else {
              // For web: Store JWT in secure HTTP-only cookie via API route
              await fetch('/api/auth/set-cookie', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jwt })
              });
            }
          }

          return { success: true, message: 'Logged in successfully' };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null
          };
        }
      },

      async logout() {
        try {
          await account.deleteSessions();
          set({ session: null, jwt: null, user: null });

          // Clear platform-specific storage
          if (!isServer) {
            if (isMobile) {
              localStorage.removeItem('auth_token');
            } else {
              await fetch('/api/auth/clear-cookie', { method: 'POST' });
            }
          }

          return { success: true, message: 'Logged out successfully' };
        } catch (error) {
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
