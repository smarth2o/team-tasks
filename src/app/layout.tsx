import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '팀 일간 관리',
  description: '팀 일일 업무 및 스탠드업 관리',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geist.className} min-h-screen bg-background antialiased`}>
        {children}
      </body>
    </html>
  );
}
