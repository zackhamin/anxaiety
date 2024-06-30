"use client";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default SessionWrapper;
