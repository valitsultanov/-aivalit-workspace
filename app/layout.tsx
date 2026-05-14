import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { OnboardingGate } from "@/components/OnboardingGate";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIValit — превращай время в деньги",
  description: "Трекай время, сэкономленное с AI, и превращай его в первый продукт",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.className} min-h-screen`}>
        <OnboardingGate>
          <div className="flex min-h-screen">
            <Navigation />
            <main className="flex-1 ml-0 md:ml-56 p-4 md:p-8 max-w-5xl mx-auto w-full">
              {children}
            </main>
          </div>
        </OnboardingGate>
      </body>
    </html>
  );
}
