export default function ProofSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8 select-none" id="proof">
      <div className="mx-auto max-w-3xl">
        <div className="relative">
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="white-gradient">Proof</span>
            </h2>
            <p className="text-md sm:text-lg text-[#999999] max-w-[700px] mx-auto">
              Watch me get an offer from Amazon using Interview Coder. Throughout this whole video,
              you'll see me use Interview Coder for both the OA and the final round.
            </p>
          </div>

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

          <p className="text-center text-sm text-zinc-500 mt-8 px-4">
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
