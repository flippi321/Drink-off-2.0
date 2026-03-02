"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import IconButton from "@/components/icon_button";
import { loginWithEmail, signInWithGoogle } from "@/services/auth_service";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const id = emailOrUsername.trim();
    if (!id) return setError("Brukernavn er påkrevd.");
    if (!password) return setError("Passord er påkrevd.");

    try {
      setLoading(true);
      await loginWithEmail(id, password);
      router.push("/parties");
    } catch (err: any) {
      setError(err?.message ?? "Kunne ikke logge inn.");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setError(null);
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message ?? "Google-innlogging feilet.");
      setLoading(false);
    }
  }

  async function onApple() {
    setError(null);
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw new Error(error.message);
    } catch (err: any) {
      setError(err?.message ?? "Apple-innlogging feilet.");
      setLoading(false);
    }
  }

  function onForgotPassword() {
    alert("Womp womp");
  }

  return (
    <main className="page-center">
      <div className="card card-stack">
        <div className="space-y-1">
          <h1>Velkommen tilbake</h1>
          <p className="text-sm text-foreground/70">Logg inn for å fortsette.</p>
        </div>

        <form onSubmit={onLogin} className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="username">Brukernavn</label>
            <input
              id="username"
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Skriv inn brukernavn"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password">Passord</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Skriv inn passord"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Logger inn…" : "Logg inn"}
          </button>

          <div className="helper-row pt-1">
            <Link href="/register" className="underline">
              Registrer
            </Link>
            <button type="button" onClick={onForgotPassword} className="underline">
              Glemt passord?
            </button>
          </div>
        </form>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">Eller</span>
          <div className="divider-line" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <IconButton label="Google" iconSrc="/logos/google.png" onClick={onGoogle} disabled={loading} />
          <IconButton label="Apple" iconSrc="/logos/apple.png" onClick={onApple} disabled={loading} />
        </div>
      </div>
    </main>
  );
}