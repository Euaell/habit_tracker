'use client';

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth/sign-in");
          },
        },
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
    >
      Sign Out
    </button>
  );
} 