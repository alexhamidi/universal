import Image from 'next/image';
import Link from 'next/link';

interface FooterLinkGroup {
  title: string;
  links: {
    href: string;
    text: string;
  }[];
}

interface SocialLinkProps {
  href: string;
  icon: React.ComponentType;
  label: string;
}

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.1] px-8 py-20 bg-neutral-950/88 backdrop-blur-3xl w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-sm text-neutral-500 flex sm:flex-row flex-col justify-between items-start md:px-8 ">
        <div>
          <div className="mr-0 md:mr-4 md:flex mb-4">
            <Link href="/" className="font-normal flex space-x-2 items-center text-xl mr-4 text-black px-2 py-1 relative z-20">
              <Image
                src="/logo.png"
                alt="Panoptica"
                width={30}
                height={30}
                className=""
              />
              <span className="font-bold text-white">Panoptica</span>
            </Link>
          </div>

          <div className="text-neutral-300/90 text-sm max-w-sm ml-2">
            Panoptica is a desktop app designed to help you do things faster. Use AI for writing assistance, design, coding, and everything in between.
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mx-2 mt-4 mb-10">
            <div className="flex items-center space-x-4 mr-16">
              <SocialLinks />
            </div>
          </div>

          <StatusIndicator />

          <div className="mt-3 ml-2 text-[13px] select-none">
            © 2025 Panoptica. All rights reserved.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 items-start mt-10 sm:mt-0 md:mt-0">
          <FooterLinks
            title="Legal"
            links={[
              { href: "/policies", text: "Refund Policy" },
              { href: "/policies", text: "Terms of Service" },
              { href: "/policies", text: "Cancellation Policy" }
            ]}
          />
          <FooterLinks
            title="Pages"
            links={[
              { href: "/help?section=contact", text: "Contact Support" },
              { href: "/signup", text: "Create account" },
              { href: "/signin", text: "Login to account" }
            ]}
          />
        </div>
      </div>

    </footer>
  );
}

function SocialLinks() {
  return (
    <>
      <SocialLink
        href="https://x.com/im_roy_lee"
        icon={TwitterIcon}
        label="X (Twitter)"
      />
      <SocialLink
        href="https://www.instagram.com/interviewcoder/"
        icon={InstagramIcon}
        label="Instagram"
      />
      <SocialLink
        href="https://www.tiktok.com/@interviewcoder0/video/7488973603648605471"
        icon={TikTokIcon}
        label="TikTok"
      />
    </>
  );
}

function SocialLink({ href, icon: Icon, label }: SocialLinkProps) {
  return (
    <a
      target="_blank"
      aria-label={label}
      href={href}
      className="text-neutral-500 hover:text-neutral-300 transition-colors"
    >
      <Icon />
    </a>
  );
}

function StatusIndicator() {
  return (
    <div className="mt-7 ml-1.5 bg-neutral-900 border border-neutral-800 rounded-full px-3 py-1 flex items-center gap-2 w-fit select-none">
      <div className="relative">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
      </div>
      <span className="text-neutral-400 text-xs">All systems online</span>
    </div>
  );
}

function FooterLinks({ title, links }: FooterLinkGroup) {
  return (
    <div className="flex justify-center space-y-4 flex-col">
      <p className="text-neutral-300 font-bold select-none text-lg">{title}</p>
      <ul className="text-neutral-300 list-none space-y-4 text-[15px]">
        {links.map((link) => (
          <li key={`${link.href}-${link.text}`} className="list-none">
            <Link href={link.href} className="transition-colors hover:text-primary">
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TwitterIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-5 h-5" height="1em" width="1em">
      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-5 h-5" height="1em" width="1em">
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-5 h-5" height="1em" width="1em">
      <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
    </svg>
  );
}
