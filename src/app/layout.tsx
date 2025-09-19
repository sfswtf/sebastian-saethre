import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Sebastian Sæthre - Full Stack Developer",
  description: "Portfolio website of Sebastian Sæthre, a passionate full stack developer specializing in modern web technologies.",
  keywords: ["Sebastian Sæthre", "Full Stack Developer", "Web Development", "React", "Next.js", "TypeScript"],
  authors: [{ name: "Sebastian Sæthre" }],
  creator: "Sebastian Sæthre",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sebastiansaethre.no",
    title: "Sebastian Sæthre - Full Stack Developer",
    description: "Portfolio website of Sebastian Sæthre, a passionate full stack developer specializing in modern web technologies.",
    siteName: "Sebastian Sæthre",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sebastian Sæthre - Full Stack Developer",
    description: "Portfolio website of Sebastian Sæthre, a passionate full stack developer specializing in modern web technologies.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Nav />
        <main className="flex-1 mx-auto max-w-7xl px-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
