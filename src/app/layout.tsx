import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/provideres/Providers";

import { Roboto } from "next/font/google";
import { ThemeProvider } from "@/provideres/ThemeProviders";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TutorLink Find Your Best Tutor",
  description:
    "Find top tutors, book live sessions, and enhance your learning with TutorLink.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Toaster richColors position="top-center" />
            <main className="min-h-screen">{children}</main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
