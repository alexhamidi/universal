"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export default function Header({ isMenuOpen, setIsMenuOpen }: NavbarProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="w-full fixed top-0 inset-x-0 z-50">
      {/* Desktop Navigation */}
      <div className={`hidden lg:flex flex-row self-start items-center justify-between py-4 max-w-7xl mx-auto px-6 rounded-full relative z-[60] w-full select-none transition-all duration-200 ${hasScrolled ? 'bg-neutral-900/75 backdrop-blur-xl shadow-lg my-4' : 'bg-transparent my-2'}`}>
        <Link href="/" className="z-100 text-white hover:text-white/80 transition-colors flex items-center gap-2 shrink-0">
          <Image
            src="/logo.svg"
            alt="Interview Coder"
            width={20}
            height={20}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm font-semibold transition-opacity duration-200">
            Interview Coder
          </span>
        </Link>

        <div className="lg:flex flex-row flex-1 absolute inset-0 hidden items-center justify-center space-x-8">
          <NavLink href="/#proof">Proof</NavLink>
          <NavLink href="/help">Help</NavLink>
          <NavLink href="/#pricing">Pricing</NavLink>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/signin" className="text-neutral-300 hover:text-white font-medium text-sm transition-colors z-20">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary/90 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`flex relative flex-col lg:hidden w-full justify-between items-center max-w-[calc(100vw-2rem)] mx-auto px-4 py-4 z-50 transition-all duration-200 ${hasScrolled ? 'bg-neutral-900/75 backdrop-blur-xl rounded-full shadow-lg my-4' : 'bg-transparent my-2'}`}>
        <div className="flex flex-row justify-between items-center w-full">
          <Link href="/" className="z-100 text-white hover:text-white/80 transition-colors flex items-center gap-2 shrink-0">
            <Image
              src="/logo.svg"
              alt="Interview Coder"
              width={20}
              height={20}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-semibold transition-opacity duration-200 md:block hidden">
              Interview Coder
            </span>
          </Link>
          <button
            className="size-6 fill-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MenuIcon />
          </button>
        </div>
        {isMenuOpen && <MobileMenu />}
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-neutral-300 relative px-4 py-2">
      <span className="relative z-20">{children}</span>
    </Link>
  );
}

function MenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  );
}

function MobileMenu() {
  return (
    <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl rounded-b-2xl py-4 px-6">
      <div className="flex flex-col space-y-4">
        <Link href="/#proof" className="text-neutral-300 hover:text-white transition-colors">
          Proof
        </Link>
        <Link href="/help" className="text-neutral-300 hover:text-white transition-colors">
          Help
        </Link>
        <Link href="/#pricing" className="text-neutral-300 hover:text-white transition-colors">
          Pricing
        </Link>
        <div className="pt-4 border-t border-white/10">
          <Link href="/signin" className="text-neutral-300 hover:text-white transition-colors">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
