"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider, useUser } from "@auth0/nextjs-auth0/client";
import AuthButton from "@/components/AuthButton/AuthButton";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Anxaiety",
//   description: "Your Mental Health Best Friend",
// };

function Header() {
  const { user } = useUser();
  return (
    <header className="fixed top-0 right-0 m-4 flex items-center space-x-4">
      {user && (
        <>
          <Link href="/chat" className="text-blue-600 hover:text-blue-800">
            Chat
          </Link>
          <Link href="/diary" className="text-blue-600 hover:text-blue-800">
            Diary
          </Link>
          <Link href="/contact" className="text-blue-600 hover:text-blue-800">
            Contact
          </Link>
          <Link
            href="/professional"
            className="text-blue-600 hover:text-blue-800"
          >
            Speak to a professional
          </Link>
        </>
      )}
      <AuthButton />
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          <main>{children}</main>
        </body>
      </html>
    </UserProvider>
  );
}
