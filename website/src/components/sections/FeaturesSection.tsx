import Image from 'next/image';

export default function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8 py-24 select-none">
      <div className="text-center mb-12">
      <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent py-2">
          Features
        </h2>
        <p className="text-lg leading-8 text-[#999999]">
          Heres what makes Panoptica so powerful
        </p>
      </div>

      {/* <div className="relative w-full max-w-[400px] mx-auto h-[40px]">
        <ProBadge />
      </div> */}

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-10">
        <FeatureCard
          title="Screen Sharing"
          description="Completely invisible during screen sharing, cannot be seen by the other side. Your answers remain private while you get the help you need."
          icon={<ScreenIcon />}
          image="/undetectability/screenshare.png"
          className="lg:col-span-5"
        />

        <FeatureCard
          title="Active Tab Detection"
          description="Bypasses active tab detection in all major browsers and screen sharing software."
          icon={<CommandIcon />}
          video="/undetectability/active.mp4"
          className="lg:col-span-5"
        />
      </div>
    </section>
  );
}

function ProBadge() {
  return (
    <>
      <div className="absolute left-0 top-[25px] w-[40%] sm:w-[161px] overflow-hidden rounded-full">
        <div
          className="w-full h-[2px] bg-linear-to-l to-transparent from-[#FFFF00] to-90%"
          style={{ transform: 'translateX(-100%)' }}
        />
      </div>
      <div className="absolute right-0 top-[25px] w-[40%] sm:w-[161px] overflow-hidden rounded-full">
        <div
          className="w-full h-[2px] bg-linear-to-r to-transparent from-[#FFFF00] to-90%"
          style={{ transform: 'translateX(100%)' }}
        />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 top-[25px] w-[40px] h-[2px] bg-[#FFFF00] blur-[20px]" />
      <div className="absolute left-1/2 -translate-x-1/2 top-2.5">
        <div className="relative">
          <div className="absolute -inset-1 bg-[#FFFF00]/30 blur-[20px]" />
          <div
            className="relative text-lg sm:text-xl tracking-[0.2em] font-medium text-[#FFFF00]"
            style={{ textShadow: '0 0 10px #FFFF00, 0 0 20px rgba(255, 255, 0, 0.5)' }}
          >
            PRO
          </div>
        </div>
      </div>
    </>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
  video?: string;
  className?: string;
}

function FeatureCard({ title, description, icon, image, video, className }: FeatureCardProps) {
  return (
    <div className={`flex p-px ${className}`}>
      <div className="relative rounded-lg bg-[#171717] ring-1 ring-white/10 ">
        <div className="glow-border" />
        <div className="relative mx-auto overflow-hidden rounded-t-lg bg-black/50 h-82 pointer-events-none">
          {image ? (
            <Image src={image} alt={title} width={1920} height={1080} className="w-full" />
          ) : video ? (
            <video autoPlay loop muted playsInline className="w-full">
              <source src={video} type="video/mp4" />
            </video>
          ) : null}
        </div>
        <div className="p-10">
          {icon}
          <p className="text-lg font-medium tracking-tight text-white">{title}</p>
          <p className="mt-2 max-w-lg text-sm/6 text-zinc-400">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ScreenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor size-5 mb-1 text-sky-600">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

function CommandIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-command size-5 mb-1 text-emerald-500">
      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
    </svg>
  );
}
