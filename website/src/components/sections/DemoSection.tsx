export default function DemoSection() {
  return (
    <section id="demo" className="py-24 relative">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent py-2">
            Demo
          </h2>
          <p className="text-lg leading-8 text-[#999999]">
            Watch me solve a real coding interview
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <video
            className="w-full rounded-xl shadow-xl"
            controls
            playsInline
            preload="metadata"
            controlsList="nodownload"
            disablePictureInPicture
            disableRemotePlayback
          >
            <source src="/videos/amazon.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <p className="text-center text-sm text-zinc-500 mt-8">
            Watch the full video{' '}
            <a
              target="_blank"
              className="underline hover:text-gray-400 transition-colors"
              href="https://drive.google.com/file/d/1PAMEtqSmuWWYwQzUhskaB7Z4FpbvP4dR/view"
            >
              here
            </a>{' '}
            for more details.
          </p>
        </div>
      </div>
    </section>
  );
}
