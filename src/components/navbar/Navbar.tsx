'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CircleUserRound, Menu, MessageCircleMore, UserPlus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { NAV_LINKS } from '@/constants/navbarConstants';
import { AnimatedBackground } from '../../../components/motion-primitives/animated-background';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import LogoutBtn from '../LogoutBtn';
import dynamic from 'next/dynamic';
import ThemeToggler from '../ThemeToggler';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const pathname = usePathname() || ''

  // list routes where navbar should be hidden
  const hideOn = [
    '/profile',
    '/users',        // hide on /users root
    '/users/profile' // hide on /users/profile specifically
    // add other routes or patterns as needed
  ]

  // you can match startsWith for nested routes
  const shouldHide = hideOn.some(p => pathname === p || pathname.startsWith(p + '/'))

  if (shouldHide) return null


  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent text-card-foreground">
      <div
        className={`flex items-center justify-between mx-auto px-7 h-16  transition-all duration-200 ease-in-out backdrop-blur-md shadow-lg ${isScrolled
          ? 'md:max-w-[92%] lg:max-w-[85%] md:mt-2 md:rounded-full'
          : 'max-w-full'
          }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold lg:w-1/3 md:w-1/12">
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} priority />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center justify-center lg:w-1/3 md:w-8/12 space-x-2">

          <AnimatedBackground
            className="rounded-lg bg-sidebar-accent"
            transition={{
              type: 'keyframes',
              bounce: 0.2,
              duration: 0.2
            }}
            enableHover>
            {NAV_LINKS.map(({ title, path, icons: Icon }) => (
              <Button
                key={title}
                className="group hover:scale-105"
                suppressHydrationWarning
                data-id={title}
                variant="nav_ghost"
                onClick={() => router.push(path)}
              >
                <div className="flex group items-center space-x-2">
                  <Icon className="group-hover:text-sidebar-accent-foreground" size={24} />
                  <span className="group-hover:text-sidebar-accent-foreground">{title}</span>
                </div>
              </Button>
            ))}
          </AnimatedBackground>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex justify-end lg:w-1/3 md:w-3/12 space-x-2">
          {user ? (
            <>
              <Button variant="ghost">
                <MessageCircleMore size={24} />
              </Button>
              <LogoutBtn />
            </>
          ) : (
            <div className='flex space-x-2'>
              <ThemeToggler />
              <Button variant="ghost" className="rounded-full hover:scale-110 transition-all duration-200 cursor-pointer" onClick={() => router.push('/auth/login')}>
                <div className="flex items-center space-x-1 ">
                  <CircleUserRound size={24} />
                  <span>Login</span>
                </div>
              </Button>
              <Button className="rounded-xl hover:scale-110 transition-all duration-200" onClick={() => router.push('/auth/register')}>
                <div className="flex items-center space-x-1 text-secondary-foreground">
                  <UserPlus size={24} />
                  <span>Sign up</span>
                </div>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <Button onClick={() => setIsMenuOpen((o) => !o)} variant="ghost">
            <Menu size={28} className="text-secondary" />
          </Button>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-background border-l border-border shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
            <span className="font-bold text-lg">Menu</span>
          </div>
          <Button onClick={() => setIsMenuOpen(false)} variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted rounded-full" aria-label="Close menu">
            <X size={18} className="text-secondary" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100vh-97px)]">
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {NAV_LINKS.map(({ title, path, icons: Icon }) => (
                <li key={title}>
                  <Button onClick={() => { setIsMenuOpen(false); router.push(path); }} variant="ghost" className="w-full justify-start h-12 px-4 text-left hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-3">
                      <Icon size={20} className="text-muted-foreground" />
                      <span className="font-medium">{title}</span>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
            <div className="my-6 border-t border-border" />
            {user && (
              <ul className="space-y-2">
                <li>
                  <Button onClick={() => setIsMenuOpen(false)} variant="ghost" className="w-full justify-start h-12 px-4 text-left hover:bg-muted">
                    <div className="flex items-center space-x-3">
                      <MessageCircleMore size={24} />
                      <span className="font-medium">Messages</span>
                    </div>
                  </Button>
                </li>
              </ul>
            )}
          </nav>

          {/* Footer */}
          {!user ? (
            <div className="flex-shrink-0 p-4 border-t border-border bg-muted/50">
              <div className="space-y-3">
                <Button onClick={() => { setIsMenuOpen(false); router.push('/auth/login'); }} variant="outline" className="w-full justify-center h-11">
                  <div className="flex items-center space-x-2">
                    <CircleUserRound size={18} />
                    <span>Sign In</span>
                  </div>
                </Button>
                <Button onClick={() => { setIsMenuOpen(false); router.push('/auth/register'); }} className="w-full justify-center h-11">
                  <div className="flex items-center space-x-2">
                    <UserPlus size={18} />
                    <span>Sign Up</span>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-shrink-0 p-4 border-t border-border">
              <LogoutBtn />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Export using dynamic with SSR disabled
export default dynamic(() => Promise.resolve(Navbar), {
  ssr: false
});

// export default Navbar;
