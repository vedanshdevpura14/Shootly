import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Shootly - Find Creative Professionals",
  description: "Book photographers, reel creators, and editors",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}