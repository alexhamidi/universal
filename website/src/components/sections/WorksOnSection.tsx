import Image from 'next/image';

export default function WorksOnSection() {
  return (
    <div className="flex flex-col items-center justify-center py-12 lg:py-20 select-none">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent py-2">
          Works Everywhere
        </h2>
        <p className="text-lg leading-8 text-[#999999]">
          Collaborate with agents to create desings, write code, and everything else.
        </p>
      </div>

      <div className="w-full max-w-5xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {platforms.map((platform) => (
            <PlatformCard key={platform.name} {...platform} />
          ))}
        </div>
        {/* <p className="text-center text-sm text-zinc-500 mt-8 px-4">
          Undetectability may not work with some versions of MacOS. See our{' '}
          <a href="/help?section=shows-when-sharing" className="underline hover:text-gray-400 transition-colors">
            notice
          </a>{' '}
          for more details.
        </p> */}
      </div>
    </div>
  );
}

interface Platform {
  name: string;
  logo: string;
  href?: string;
}

const platforms: Platform[] = [
  {
    name: 'Zoom',
    logo: '/logos/zoom.png',
    href: 'https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0063824#:~:text=Advanced%20capture%20with%20window%20filtering,from%20the%20Zoom%20desktop%20app.'
  },
  { name: 'Hackerrank', logo: '/logos/hackerrank.png' },
  { name: 'Codesignal', logo: '/logos/codesignal.png' },
  { name: 'CoderPad', logo: '/logos/coderpad.png' },
  { name: 'Chime', logo: '/logos/chime.png' },
  { name: 'Microsoft Teams', logo: '/logos/team.png' }
];

function PlatformCard({ name, logo, href }: Platform) {
  const content = (
    <div className="relative p-6">
      <Image
        src={logo}
        alt={name}
        width={128}
        height={128}
        className="
          object-contain brightness-0 invert opacity-90
          transition-all duration-300 ease-out
          group-hover:opacity-100 group-hover:scale-105
        "
      />
    </div>
  );

  return (
    <div className="relative flex items-center justify-center group cursor-pointer" data-state="closed">
      <div className="absolute inset-0 rounded-2xl bg-transparent group-hover:bg-zinc-800/30 transition ease-out" />
      {href ? (
        <a target="_blank" href={href}>
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
