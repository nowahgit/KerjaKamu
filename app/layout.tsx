import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const space = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KerjaKamu - Dari Tes ke Kerja dalam 30 Hari",
  description: "Platform AI pertama Indonesia yang mempersiapkan kamu dari tes keterampilan, bootcamp 7 hari, hingga auto-apply CV ke HRD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${space.variable} antialiased selection:bg-primary/20`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
