'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
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
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent text-primary">
      <div
        className={`flex items-center justify-between mx-auto px-6 h-16 transition-all duration-500 ease-in-out 
  backdrop-blur-md shadow-lg ring-1 ring-white/10 border border-white/30 
  ${isScrolled ? 'max-w-[75%] mt-2 rounded-full bg-[rgba(255,255,255,0.2)] ' : 'max-w-full bg-[rgba(255,255,255,0.2)] '}`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold">
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} priority />
        </Link>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex space-x-5">
          <AnimatedBackground
            // defaultValue={NAV_LINKS[0].title}
            className="rounded-lg bg-[#37474F] dark:bg-zinc-800"
            transition={{
              type: 'keyframes',
              bounce: 0.2,
              duration: 0.2
            }}
            enableHover
          >
            {NAV_LINKS.map(({ title, path, img }) => (
              <Button
                key={title}
                className=" group"
                data-id={title}
                variant={'nav_ghost'}
                onClick={() => {
                  router.push(path);
                }}
              >
                <div className="group flex space-x-2">
                  <Image src={img} alt={title} height={24} width={24} className="-mt-1" />
                  <span className="group-hover:text-neutral-100 "> {title}</span>
                </div>
              </Button>
            ))}
          </AnimatedBackground>
        </div>

        {/* Auth Button */}
        <div className="hidden md:flex space-x-2">
          {user ? (
            <Button className="" variant={'ghost'}>
              <Image src="/images/navbar/message.svg" alt="Message" height={24} width={24} className="-mt-1" />
            </Button>
          ) : null}

          {user ? (
            <LogoutBtn />
          ) : (
            <Button
              onClick={() => {
                router.push('/login');
              }}
            >
              login
            </Button>
          )}
        </div>

        {/* ***************************** Mobile Menu Toggle ********************************/}
        <div className="md:hidden">
          <Button onClick={() => setIsMenuOpen((prev) => !prev)} variant="ghost">
            <Menu size={28} className="text-gray-700 " />
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4">
          <ul className="flex flex-col space-y-3  ">
            {NAV_LINKS.map(({ title, path }) => (
              <li key={title}>
                <Button
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push(path);
                  }}
                  variant={'ghost'}
                >
                  {title}
                </Button>
              </li>
            ))}
            <li>
              <Button
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                Messages
              </Button>
            </li>
            <li>
              <Button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/login');
                }}
              >
                Login
              </Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
