import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/components/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kinetix • High-Velocity Project Management",
  description: "Deterministic telemetry, keyboard-first velocity & project orchestration",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={cn(
          geistSans.className,
          jetbrainsMono.variable,
          "antialiased min-h-screen bg-[#09090B] text-[#e4e1e6] selection:bg-[#6366F1]/30 selection:text-white"
        )}
      >
        <QueryProvider>
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "#18181B",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#F4F4F5",
              },
            }}
          />
          <NuqsAdapter>{children}</NuqsAdapter>
        </QueryProvider>
      </body>
    </html>
  );
}
