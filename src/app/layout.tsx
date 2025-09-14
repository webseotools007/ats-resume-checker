import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Background } from "@/components/Background";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ATS Resume Checker - AI-Powered Resume Optimization",
  description:
    "Get instant AI-powered feedback on your resume's ATS compatibility. Optimize your resume to pass through ATS filters.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen w-full relative !bg-transparent">
          <Background />
          <SpeedInsights />
          {/* Content */}
          <div className="relative z-10">
            <Analytics />
            <Navbar />
            <div className="text-gray-900 !bg-transparent">{children}</div>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
