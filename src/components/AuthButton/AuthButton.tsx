"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@/components/ui/button";

interface UseAuthButton {
  user: any;
}

export default function AuthButton() {
  const { user, isLoading, error } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <Button
        onClick={() => (window.location.href = "/api/auth/logout")}
        variant="outline"
      >
        Logout
      </Button>
    );
  }
  return (
    <Button
      onClick={() => (window.location.href = "/api/auth/login")}
      variant="default"
    >
      Login
    </Button>
  );
}
