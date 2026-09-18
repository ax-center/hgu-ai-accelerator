import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "한동대학교 AI 가속기 | AI 혁신센터", description: "한동대학교 AI 혁신센터가 운영하는 GPU 기반 AI 연구 인프라와 이용 방법을 안내합니다.", icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body>{children}</body></html>; }
