"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, ChevronDown } from 'lucide-react';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { COMING_SOON } from '@/constants';
interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export default function Header({ isMenuOpen, setIsMenuOpen }: NavbarProps) {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  return (
    <nav className="w-full fixed top-4 inset-x-0 z-50">
      {/* Desktop Navigation */}
      <div className={`hidden lg:flex flex-row self-start border border-[#272D3A] bg-slate-700/20 rounded-xl  backdrop-blur-xl items-center justify-between py-2 max-w-7xl mx-auto px-6  relative z-[60] w-full select-none transition-all duration-200`}>
        <Link href="/" className="z-100 text-white hover:text-white/80 transition-colors flex items-center gap-2 shrink-0">
          <Image
            src="/logo.png"
            alt="Panoptica"
            width={20}
            height={20}
            className="w-8 h-8 fd"
          />
          <span className="text-lg font-semibold transition-opacity duration-200">
            Panoptica
          </span>
        </Link>

        <div className="lg:flex flex-row flex-1 absolute inset-0 hidden items-center justify-center space-x-8">
          {!COMING_SOON && <NavLink href="/#demo">Demo</NavLink>}
          {!COMING_SOON && <NavLink href="/#features">Features</NavLink>}
          {!COMING_SOON && <NavLink href="/#pricing">Pricing</NavLink>}
          {!COMING_SOON && <NavLink href="/#faq">FAQ</NavLink>}
        </div>

        <div className="flex items-center gap-6">
          {!loading && (
            user ? (
              <UserMenu user={user} signOut={signOut} />
            ) : (
              <>
                <button
                  onClick={() => signInWithGoogle()}
                  className="text-neutral-300 hover:text-white font-medium text-sm transition-colors cursor-pointer z-20"
                >
                  Login
                </button>
                <button
                  onClick={() => signInWithGoogle()}
                  className="text-neutral-300 hover:text-white font-medium text-sm transition-colors cursor-pointer z-20"
                >
                  Sign Up
                </button>
              </>
            )
          )}
          {!COMING_SOON && <Link
            href="/signup"
            className="rounded-full flex items-center gap-2 cursor-pointer bg-zinc-300 text-black shadow-[0_0_50px_-5px_rgba(228,228,231,0.5)] z-20 px-4 py-2 text-sm font-medium text-black hover:bg-primary/90 transition-colors"
          >
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="17" width="17">
      <path d="M11.6734 7.22198C10.7974 7.22198 9.44138 6.22598 8.01338 6.26198C6.12938 6.28598 4.40138 7.35397 3.42938 9.04597C1.47338 12.442 2.92538 17.458 4.83338 20.218C5.76938 21.562 6.87338 23.074 8.33738 23.026C9.74138 22.966 10.2694 22.114 11.9734 22.114C13.6654 22.114 14.1454 23.026 15.6334 22.99C17.1454 22.966 18.1054 21.622 19.0294 20.266C20.0974 18.706 20.5414 17.194 20.5654 17.11C20.5294 17.098 17.6254 15.982 17.5894 12.622C17.5654 9.81397 19.8814 8.46998 19.9894 8.40998C18.6694 6.47798 16.6414 6.26198 15.9334 6.21398C14.0854 6.06998 12.5374 7.22198 11.6734 7.22198ZM14.7934 4.38998C15.5734 3.45398 16.0894 2.14598 15.9454 0.849976C14.8294 0.897976 13.4854 1.59398 12.6814 2.52998C11.9614 3.35798 11.3374 4.68998 11.5054 5.96198C12.7414 6.05798 14.0134 5.32598 14.7934 4.38998Z" />
    </svg>
            Download
          </Link>}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`flex relative flex-col lg:hidden w-full justify-between items-center max-w-[calc(100vw-2rem)] mx-auto px-4 py-4 z-50 transition-all duration-200 bg-transparent my-2`}>
        <div className="flex flex-row justify-between items-center w-full">
          <Link href="/" className="z-100 text-white hover:text-white/80 transition-colors flex items-center gap-2 shrink-0">
            <Image
              src="/logo.svg"
              alt="Panoptica"
              width={20}
              height={20}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-semibold transition-opacity duration-200 md:block hidden">
              Panoptica
            </span>
          </Link>
          <button
            className="size-6 fill-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MenuIcon />
          </button>
        </div>
        {isMenuOpen && <MobileMenu user={user} signOut={signOut} signInWithGoogle={signInWithGoogle} />}
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const scrollToSection = useScrollToSection();
  const isHashLink = href.startsWith('/#');

  if (isHashLink) {
    const sectionId = href.replace('/#', '');
    return (
      <a
        href={href}
        onClick={(e) => scrollToSection(e, sectionId)}
        className="text-neutral-300 relative px-4 py-2"
      >
        <span className="relative z-20">{children}</span>
      </a>
    );
  }

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

function MobileMenu({ user, signOut, signInWithGoogle }: { user: any, signOut: () => Promise<void>, signInWithGoogle: () => Promise<void> }) {
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
          {user ? (
            <UserMenu user={user} signOut={signOut} />
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="text-neutral-300 hover:text-white transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function UserMenu({ user, signOut }: { user: any, signOut: () => Promise<void> }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user.user_metadata!.full_name;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors cursor-pointer"
      >
        <User className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg backdrop-blur-xl  bg-[#1B202C] border border-[#272D3A]">
          <div className="px-4 py-3 border-b border-white/10">
            <div className="font-medium text-white">{displayName}</div>
            <div className="text-sm text-neutral-400 truncate">{user.email}</div>
          </div>
          <div className="">
            {!COMING_SOON && <Link
              href="/settings"
              className="block w-full text-left px-4 py-3 text-sm text-neutral-300 hover:text-white hover:bg-white/5 transition-colors  cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Account Settings
            </Link>}
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="flex items-center w-full text-left px-4 py-3 rounded-b-xl text-sm text-neutral-300 hover:text-white hover:bg-white/5 transition-colors  cursor-pointer"
            >
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// no it should be a much smoother animation, you need to it completely differently, the header should get darket, the company name should disappear, and then the height gets a bit smaller and it pulls to the middle. You should definitely use framer motion!

// </script><link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="256x256"/><script>document.querySelectorAll('body link[rel="icon"], body link[rel="apple-touch-icon"]').forEach(el => document.head.appendChild(el))</script><script src="/_next/static/chunks/polyfills-42372ed130431b0a.js" noModule=""></script></head><body class="__className_d65c78"><!--$--><!--/$--><div class="w-full fixed top-0 inset-x-0 z-50"><div class="hidden lg:flex flex-row self-start bg-transparent items-center justify-between py-2 max-w-7xl mx-auto px-4 rounded-full relative z-[60] w-full select-none" style="min-width:990px"><a class="z-100 text-white hover:text-white/80 transition-colors flex items-center gap-2 shrink-0" href="/"><img alt="Panoptica" loading="lazy" width="20" height="20" decoding="async" data-nimg="1" class="w-6 h-6 rounded-full" style="color:transparent" src="/logo.svg"/><span class="text-sm font-semibold transition-opacity duration-200 md:block hidden" style="opacity:100%">Panoptica</span></a><div class="lg:flex flex-row flex-1 absolute inset-0 hidden items-center justify-center space-x-2 lg:space-x-2 text-sm text-zinc-600 font-medium hover:text-zinc-800 transition duration-200"><a class="text-neutral-300 relative px-4 py-2" href="/#proof"><span class="relative z-20">Proof</span></a><a class="text-neutral-300 relative px-4 py-2" href="/help"><span class="relative z-20">Help</span></a><a class="text-neutral-300 relative px-4 py-2" href="/#pricing"><span class="relative z-20">Pricing</span></a></div><div class="flex items-center gap-4"><a class="text-stone-400 font-medium text-sm hover:text-white mr-2 z-20" href="/signin">Login</a><a class="hidden md:block rounded-full! before:rounded-full! after:rounded-full! -mr-1.5 relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border text-base/6 font-medium select-none px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(6)-1px)] sm:py-[calc(--spacing(1.8)-1px)] sm:text-sm/6 focus:outline-hidden data-focus:outline data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500 data-disabled:opacity-50 drop-shadow-[2px_0_10px_hsl(60_100%_50%_/_0.4)] data-[slot=icon]:*:-mx-0.5 data-[slot=icon]:*:my-0.5 data-[slot=icon]:*:size-5 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:self-center data-[slot=icon]:*:text-(--btn-icon) sm:data-[slot=icon]:*:my-1 sm:data-[slot=icon]:*:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText] border-transparent bg-(--btn-border) dark:bg-(--btn-bg) before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg) before:shadow-xs dark:before:hidden dark:border-white/5 after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)] after:shadow-[shadow:inset_0_1px_--theme(--color-white/15%)] data-active:after:bg-(--btn-hover-overlay) data-hover:after:bg-(--btn-hover-overlay) dark:after:-inset-px dark:after:rounded-lg data-disabled:before:shadow-none data-disabled:after:shadow-none text-black [--btn-hover-overlay:var(--color-white)]/25 [--btn-bg:var(--color-primary)] [--btn-border:var(--color-primary)]/80 [--btn-icon:var(--color-primary)] data-active:[--btn-icon:var(--color-primary)] data-hover:[--btn-icon:var(--color-primary)]" data-headlessui-state="" href="/signup"><span class="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden" aria-hidden="true"></span>Sign up</a></div></div><div class="flex relative flex-col lg:hidden w-full justify-between items-center bg-transparent max-w-[calc(100vw-2rem)] mx-auto px-0 py-2 z-50"><div class="flex flex-row justify-between items-center w-full"><a class="z-100 text-white hover:text-white/80 transition-colors flex items-center gap-2 shrink-0" href="/"><img alt="Panoptica" loading="lazy" width="20" height="20" decoding="async" data-nimg="1" class="w-6 h-6 rounded-full" style="color:transparent" src="/logo.svg"/><span class="text-sm font-semibold transition-opacity duration-200 md:block hidden" style="opacity:100%">Panoptica</span></a><div><button class="size-6 fill-white"><svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z"></path></svg></button></div></div></div></div><


// and then
//   </script><link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="256x256"/><script>document.querySelectorAll('body link[rel="icon"], body link[rel="apple-touch-icon"]').forEach(el => document.head.appendChild(el))</script><script src="/_next/static/chunks/polyfills-42372ed130431b0a.js" noModule=""></script></head><body class="__className_d65c78"><!--$--><!--/$--><div class="w-full fixed top-0 inset-x-0 z-50"><div class="hidden lg:flex flex-row self-start bg-transparent items-center justify-between py-2 max-w-7xl mx-auto px-4 rounded-full relative z-[60] w-full select-none" style="min-width:990px"><a class="z-100 text-white hover:text-white/80 transition-colors flex items-center gap-2 shrink-0" href="/"><img alt="Panoptica" loading="lazy" width="20" height="20" decoding="async" data-nimg="1" class="w-6 h-6 rounded-full" style="color:transparent" src="/logo.svg"/><span class="text-sm font-semibold transition-opacity duration-200 md:block hidden" style="opacity:100%">Panoptica</span></a><div class="lg:flex flex-row flex-1 absolute inset-0 hidden items-center justify-center space-x-2 lg:space-x-2 text-sm text-zinc-600 font-medium hover:text-zinc-800 transition duration-200"><a class="text-neutral-300 relative px-4 py-2" href="/#proof"><span class="relative z-20">Proof</span></a><a class="text-neutral-300 relative px-4 py-2" href="/help"><span class="relative z-20">Help</span></a><a class="text-neutral-300 relative px-4 py-2" href="/#pricing"><span class="relative z-20">Pricing</span></a></div><div class="flex items-center gap-4"><a class="text-stone-400 font-medium text-sm hover:text-white mr-2 z-20" href="/signin">Login</a><a class="hidden md:block rounded-full! before:rounded-full! after:rounded-full! -mr-1.5 relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border text-base/6 font-medium select-none px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(6)-1px)] sm:py-[calc(--spacing(1.8)-1px)] sm:text-sm/6 focus:outline-hidden data-focus:outline data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500 data-disabled:opacity-50 drop-shadow-[2px_0_10px_hsl(60_100%_50%_/_0.4)] data-[slot=icon]:*:-mx-0.5 data-[slot=icon]:*:my-0.5 data-[slot=icon]:*:size-5 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:self-center data-[slot=icon]:*:text-(--btn-icon) sm:data-[slot=icon]:*:my-1 sm:data-[slot=icon]:*:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText] border-transparent bg-(--btn-border) dark:bg-(--btn-bg) before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg) before:shadow-xs dark:before:hidden dark:border-white/5 after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)] after:shadow-[shadow:inset_0_1px_--theme(--color-white/15%)] data-active:after:bg-(--btn-hover-overlay) data-hover:after:bg-(--btn-hover-overlay) dark:after:-inset-px dark:after:rounded-lg data-disabled:before:shadow-none data-disabled:after:shadow-none text-black [--btn-hover-overlay:var(--color-white)]/25 [--btn-bg:var(--color-primary)] [--btn-border:var(--color-primary)]/80 [--btn-icon:var(--color-primary)] data-active:[--btn-icon:var(--color-primary)] data-hover:[--btn-icon:var(--color-primary)]" data-headlessui-state="" href="/signup"><span class="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden" aria-hidden="true"></span>Sign up</a></div></div>

