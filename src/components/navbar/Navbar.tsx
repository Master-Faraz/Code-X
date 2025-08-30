'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CircleUserRound, Menu, UserPlus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { NAV_LINKS } from '@/constants/navbarConstants';
import { AnimatedBackground } from '../../../components/motion-primitives/animated-background';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import LogoutBtn from '../LogoutBtn';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50  bg-transparent text-card-foreground">
      <div
        className={`flex items-center justify-between mx-auto px-7 h-16 transition-all duration-200 ease-in-out
  backdrop-blur-md shadow-lg ${isScrolled ? ' md:max-w-[92%] lg:max-w-[85%] md:mt-2 md:rounded-full  ' : 'max-w-full  '}`}      >

        {/* Logo */}

        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold justify-start lg:w-1/3  md:w-1/12">
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} priority />
        </Link>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex space-x-2 items-center justify-center lg:w-1/3  md:w-8/12">
          {/* searchbar */}
          {/* <div className='border-2 rounded-full flex items-center justify-center'>
            <input type="text" className='px-2 focus:border-0 h-full' placeholder='Search your city' />
            <Search className='text-muted-foreground/50' />
          </div> */}

          <AnimatedBackground
            // defaultValue={NAV_LINKS[0].title}
            className="rounded-lg bg-sidebar-accent "
            transition={{
              type: 'keyframes',
              bounce: 0.2,
              duration: 0.2
            }}
            enableHover
          >
            {NAV_LINKS.map(({ title, path, icons: Icon }) => (
              <Button
                key={title}
                className=" group hover:scale-105"
                data-id={title}
                variant={'nav_ghost'}
                onClick={() => {
                  router.push(path);
                }}
              >
                <div className="group flex space-x-2">
                  <Icon className='group-hover:text-sidebar-accent-foreground' size={24} />

                  <span className="group-hover:text-sidebar-accent-foreground "> {title}</span>
                </div>
              </Button>
            ))}
          </AnimatedBackground>

        </div>

        {/* Auth Button */}
        <div className="hidden md:flex space-x-1 lg:space-x-2 lg:w-1/3 justify-end  md:w-3/12">
          {user ? (
            <Button className="" variant={'ghost'}>
              <Image src="/images/navbar/message.svg" alt="Message" height={24} width={24} className="-mt-1" />
            </Button>
          ) : null}

          {user ? (
            <LogoutBtn />
          ) : (
            <div className='flex space-x-2'>

              <Button
                variant={'ghost'}
                className='rounded-full hover:scale-110 transition-all duration-200'
                onClick={() => {
                  router.push('/login');
                }}
              >
                <div className='flex space-x-1  w-full h-full '>
                  <CircleUserRound className='mt-0.5' size={24} />
                  <span >Login </span>

                </div>
              </Button>

              <Button
                className='rounded-xl hover:scale-110 transition-all duration-200'
                onClick={() => {
                  router.push('/register');
                }}
              >
                <div className='flex space-x-1 text-secondary-foreground w-full h-full '>
                  <UserPlus className='mt-0.5' size={24} />
                  <span >Sign up </span>

                </div>
              </Button>
            </div>
          )}
        </div>

        {/* ***************************** Mobile Menu Toggle ********************************/}
        <div className="md:hidden">
          <Button onClick={() => setIsMenuOpen((prev) => !prev)} variant="ghost">
            <Menu size={28} className="text-secondary " />
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Mobile Menu Container */}
          <div className="fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-background border-l border-border shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">

            {/* Header with Close Button */}
            <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
                <span className="font-bold text-lg">Menu</span>
              </div>

              <Button
                onClick={() => setIsMenuOpen(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted rounded-full"
                aria-label="Close menu"
              >
                <X size={18} className='text-secondary' />
              </Button>
            </div>

            {/* Menu Content - Fixed Height Container */}
            <div className="flex flex-col h-[calc(100vh-97px)]">

              {/* Navigation Links - Scrollable Area */}
              <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <ul className="space-y-2">
                  {NAV_LINKS.map(({ title, path, icons: Icon }) => (
                    <li key={title}>
                      <Button
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push(path);
                        }}
                        variant="ghost"
                        className="w-full justify-start h-12 px-4 text-left hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon size={20} className="text-muted-foreground" />
                          <span className="font-medium">{title}</span>
                        </div>
                      </Button>
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="my-6 border-t border-border" />

                {/* Secondary Actions */}
                <ul className="space-y-2">
                  {user ? (
                    <li>
                      <Button
                        onClick={() => setIsMenuOpen(false)}
                        variant="ghost"
                        className="w-full justify-start h-12 px-4 text-left hover:bg-muted"
                      >
                        <div className="flex items-center space-x-3">
                          <Image src="/images/navbar/message.svg" alt="Message" height={20} width={20} />
                          <span className="font-medium">Messages</span>
                        </div>
                      </Button>
                    </li>
                  ) : null}
                </ul>
              </nav>

              {/* Footer Actions - Fixed at Bottom */}
              {!user && (
                <div className="flex-shrink-0 p-4 border-t border-border bg-muted/50">
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push('/login');
                      }}
                      variant="outline"
                      className="w-full justify-center h-11"
                    >
                      <div className="flex items-center space-x-2">
                        <CircleUserRound size={18} />
                        <span>Sign In</span>
                      </div>
                    </Button>

                    <Button
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push('/register');
                      }}
                      className="w-full justify-center h-11"
                    >
                      <div className="flex items-center space-x-2">
                        <UserPlus size={18} />
                        <span>Sign Up</span>
                      </div>
                    </Button>
                  </div>
                </div>
              )}

              {user && (
                <div className="flex-shrink-0 p-4 border-t border-border">
                  <LogoutBtn />
                </div>
              )}
            </div>
          </div>
        </>
      )}


    </nav>
  );
};

export default Navbar;
