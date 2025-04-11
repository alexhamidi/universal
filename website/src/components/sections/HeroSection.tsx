import { motion } from 'framer-motion';

interface HeroSectionProps {
  isLoaded: boolean;
}

export default function HeroSection({ isLoaded }: HeroSectionProps) {
  return (
    <div className="container relative px-4 text-center max-w-7xl mx-auto mt-[12vh] min-h-[58vh] flex flex-col justify-center -mt-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-full p-[1px] h-8 inline-flex overflow-hidden text-[14px]/6 text-gray-200 mb-12 max-w-xl mx-auto "
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#d4d4d8_0%,transparent_50%,#d4d4d8_100%)]"></span>
        <a
          target="_blank"
          className="inline-flex h-full px-3 py-1 w-full cursor-pointer items-center justify-center rounded-full bg-[#111111] backdrop-blur-3xl"
          href="https://www.linkedin.com/feed/update/urn:li:activity:7311254984879157248/"
        >
          <span className="relative z-10 flex items-center gap-1">
            Biggest agent update ever.
            <span className="ml-1 font-semibold text-zinc-300">
              Read more <span aria-hidden="true">→</span>
            </span>
          </span>
        </a>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.2]"
        >
          <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">AI, anywhere, for anything.</span>
        </motion.h2>

        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.5 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16 text-center text-lg lg:text-xl font-medium text-neutral-400 mt-6"
          style={{ fontFamily: '"Inter", "Inter Placeholder", sans-serif' }}
        >
          Panoptica is an AI agent accessible from anywhere on your computer.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.5 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
           <a
      href='https://github.com/fakelink.exe'
      className={`
        relative group flex items-center justify-center gap-2 rounded-lg px-6 py-2.5
        text-sm font-medium transition-all duration-200 select-none w-[280px] md:w-[320px]
        bg-zinc-300 text-black shadow-[0_0_50px_-5px_rgba(228,228,231,0.5)]
      `}
    >
       <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="17" width="17">
      <path d="M11.6734 7.22198C10.7974 7.22198 9.44138 6.22598 8.01338 6.26198C6.12938 6.28598 4.40138 7.35397 3.42938 9.04597C1.47338 12.442 2.92538 17.458 4.83338 20.218C5.76938 21.562 6.87338 23.074 8.33738 23.026C9.74138 22.966 10.2694 22.114 11.9734 22.114C13.6654 22.114 14.1454 23.026 15.6334 22.99C17.1454 22.966 18.1054 21.622 19.0294 20.266C20.0974 18.706 20.5414 17.194 20.5654 17.11C20.5294 17.098 17.6254 15.982 17.5894 12.622C17.5654 9.81397 19.8814 8.46998 19.9894 8.40998C18.6694 6.47798 16.6414 6.26198 15.9334 6.21398C14.0854 6.06998 12.5374 7.22198 11.6734 7.22198ZM14.7934 4.38998C15.5734 3.45398 16.0894 2.14598 15.9454 0.849976C14.8294 0.897976 13.4854 1.59398 12.6814 2.52998C11.9614 3.35798 11.3374 4.68998 11.5054 5.96198C12.7414 6.05798 14.0134 5.32598 14.7934 4.38998Z" />
    </svg>
      <span>Download for Mac</span>
    </a>
        </motion.div>
      </div>
    </div>
  );
}
