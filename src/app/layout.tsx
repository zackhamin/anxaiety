import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import AuthButton from "@/components/AuthButton/AuthButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anxaiety",
  description: "Your Mental Health Best Friend",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <html lang="en">
        <body className={inter.className}>
          <header className="fixed top-0 right-0 m-4">
            <AuthButton />
          </header>
          <main>{children}</main>
        </body>
      </html>
    </UserProvider>
  );
}
