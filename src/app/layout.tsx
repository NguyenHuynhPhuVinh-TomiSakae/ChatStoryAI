import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/session-provider"
import { Toaster } from 'sonner';
import { ScrollToTop } from "@/components/scroll-to-top"
import { Nav } from "@/components/nav/nav";
import { Footer } from "@/components/footer";
import { ChatBot } from "@/components/chat-bot";
import { LoadingProvider } from "@/providers/loading-provider";
import { CustomCursor } from '@/components/custom-cursor'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat Story AI",
  description: "Viết lên câu truyện trong mơ của bạn với AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LoadingProvider>
            <Nav />
            {children}
            <Footer />
            <Toaster richColors position="top-center" />
            <ScrollToTop />
            <ChatBot />
            <CustomCursor />
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
