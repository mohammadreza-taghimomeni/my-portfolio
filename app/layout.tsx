import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { FramerMotionProvider } from "@/components/layout/framer-motion-provider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import "./globals.css";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Reza Momeni - Senior Frontend Developer",
   description: "Reza Momeni's personal portfolio website.",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
            suppressHydrationWarning
         >
            <ThemeProvider
               attribute="class"
               defaultTheme="system"
               enableSystem
               disableTransitionOnChange
            >
               <FramerMotionProvider>
                  <div className="flex flex-col min-h-screen">
                     <Header />
                     <main className="flex-grow pt-20">{children}</main>
                     <Footer />
                  </div>
               </FramerMotionProvider>
            </ThemeProvider>
         </body>
      </html>
   );
}
