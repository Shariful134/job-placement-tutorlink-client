import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/provideres/Providers";

import { Roboto } from "next/font/google";

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
    <Providers>
      <html lang="en">
        <body className={roboto.className}>
          <Toaster richColors position="top-center" />
          {children}
        </body>
      </html>
    </Providers>
  );
}
