"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const eTrim = email.trim();
    if (!eTrim) return setError("Email is required.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: eTrim,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw new Error(error.message);

      router.push("/parties");
    } catch (err: any) {
      setError(err?.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-center">
      <div className="card card-stack">
        <div className="space-y-1">
          <h1>Create account</h1>
          <p className="text-sm text-foreground/70">Lag en bruker for å fortsette.</p>
        </div>

        <form onSubmit={onRegister} className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Creating…" : "Register"}
          </button>
        </form>

        <p className="text-sm text-foreground/80 text-center">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}