import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProposalPilot AI - Create Winning Proposals in 60 Seconds",
  description: "AI-powered proposal generator for freelancers and small agencies. Paste your client brief, get a professional proposal instantly.",
  keywords: ["proposal generator", "AI proposals", "freelancer tools", "business proposals", "RFP response"],
  openGraph: {
    title: "ProposalPilot AI - Create Winning Proposals in 60 Seconds",
    description: "AI-powered proposal generator for freelancers and small agencies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <Suspense fallback={
              <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="w-8 h-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              </div>
            }>
              {children}
            </Suspense>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
