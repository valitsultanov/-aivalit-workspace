import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Productivity Tracker",
  description: "Track time saved daily with AI assistance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen`}>
        <div className="flex min-h-screen">
          <Navigation />
          <main className="flex-1 ml-0 md:ml-56 p-4 md:p-8 max-w-5xl mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
