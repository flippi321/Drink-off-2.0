"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // supabase-js handles the session automatically via detectSessionInUrl
    router.replace("/parties");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <p className="text-sm opacity-70">Signing you in…</p>
    </main>
  );
}