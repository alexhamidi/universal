import { ReactNode } from 'react';

interface DownloadButtonProps {
  platform: 'mac' | 'windows';
}

export default function DownloadButton({ platform }: DownloadButtonProps) {
  const isMac = platform === 'mac';
  const Icon = isMac ? MacIcon : WindowsIcon;
  const text = isMac ? 'Download for Mac' : 'Download for Windows';
  const href = isMac
    ? '#mac-download'
    : 'https://github.com/ibttf/interview-coder/releases/download/v1.0.21/Interview.Coder-Windows-1.0.21.exe';

  return (
    <a
      href={href}
      className={`
        relative group flex items-center justify-center gap-2 rounded-lg px-6 py-2.5
        text-sm font-medium transition-all duration-200 select-none w-[280px] md:w-[320px]
        ${isMac
          ? 'bg-primary text-black shadow-[0_0_30px_-5px_rgba(255,255,0,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,0,0.5)]'
          : 'bg-neutral-900 text-primary border border-primary/20 hover:border-primary/40'}
      `}
    >
      <Icon />
      <span>{text}</span>
    </a>
  );
}

function MacIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="17" width="17">
      <path d="M11.6734 7.22198C10.7974 7.22198 9.44138 6.22598 8.01338 6.26198C6.12938 6.28598 4.40138 7.35397 3.42938 9.04597C1.47338 12.442 2.92538 17.458 4.83338 20.218C5.76938 21.562 6.87338 23.074 8.33738 23.026C9.74138 22.966 10.2694 22.114 11.9734 22.114C13.6654 22.114 14.1454 23.026 15.6334 22.99C17.1454 22.966 18.1054 21.622 19.0294 20.266C20.0974 18.706 20.5414 17.194 20.5654 17.11C20.5294 17.098 17.6254 15.982 17.5894 12.622C17.5654 9.81397 19.8814 8.46998 19.9894 8.40998C18.6694 6.47798 16.6414 6.26198 15.9334 6.21398C14.0854 6.06998 12.5374 7.22198 11.6734 7.22198ZM14.7934 4.38998C15.5734 3.45398 16.0894 2.14598 15.9454 0.849976C14.8294 0.897976 13.4854 1.59398 12.6814 2.52998C11.9614 3.35798 11.3374 4.68998 11.5054 5.96198C12.7414 6.05798 14.0134 5.32598 14.7934 4.38998Z" />
    </svg>
  );
}

function WindowsIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="17" width="17">
      <path d="M11.501 3V11.5H3.00098V3H11.501ZM11.501 21H3.00098V12.5H11.501V21ZM12.501 3H21.001V11.5H12.501V3ZM21.001 12.5V21H12.501V12.5H21.001Z" />
    </svg>
  );
}
