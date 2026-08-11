import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import { getUserName } from "@parkerburgess/wandering-parker-server";

export const metadata: Metadata = {
  title: "Flash Cards",
  description: "A full-featured flash card study app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userName = await getUserName();

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-900">
        <NavBar userName={userName} />
        {children}
      </body>
    </html>
  );
}
