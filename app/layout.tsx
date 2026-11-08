import type { Metadata } from 'next';
import './globals.css';
import './photo-theme.css';
export const metadata: Metadata = { title: 'BUSAFE — 오늘도 안전하게', description: '기사님을 위한 가장 간편한 소화기 점검. 차량의 안전을 함께 지켜요.' };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {return <html lang="ko"><body>{children}</body></html>;}
