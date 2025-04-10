import { motion } from 'framer-motion';
import DownloadButton from '../DownloadButton';

interface HeroSectionProps {
  isLoaded: boolean;
}

export default function HeroSection({ isLoaded }: HeroSectionProps) {
  return (
    <div className="container relative px-4 text-center max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center -mt-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-full p-[1px] h-8 inline-flex overflow-hidden text-[14px]/6 text-gray-200 mb-12 max-w-xl mx-auto w-full"
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FFFF00_0%,transparent_50%,#FFFF00_100%)]" />
        <a
          target="_blank"
          className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#111111] border border-yellow-400/20"
          href="https://www.linkedin.com/feed/update/urn:li:activity:7311254984879157248/"
        >
          <span className="flex items-center gap-1">
            Biggest undetectability update ever.
            <span className="font-semibold text-yellow-400">
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
          <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">F*ck Leetcode.</span>
        </motion.h2>

        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.5 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16 text-center text-lg lg:text-xl font-medium text-neutral-400 mt-6"
          style={{ fontFamily: '"Inter", "Inter Placeholder", sans-serif' }}
        >
          Interview Coder is an invisible AI for technical interviews.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.5 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <DownloadButton platform="mac" />
          <DownloadButton platform="windows" />
        </motion.div>
      </div>
    </div>
  );
}
