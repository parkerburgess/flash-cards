import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";

export const metadata: Metadata = {
  title: "Flash Cards",
  description: "A full-featured flash card study app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-900">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
