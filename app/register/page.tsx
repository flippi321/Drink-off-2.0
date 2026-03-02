"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerWithEmail } from "@/services/auth_service";
import { TextBox } from "@/components/text_box";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email) return setError("Epost er nødvendig");
    if (!username) return setError("Brukernavn er nødvendig");
    if (password.length < 6) return setError("Passord må være minst 6 tegn.");
    if (password !== confirmPassword) return setError("Passordene er forskjellige.");

    try {
      setLoading(true);

      await registerWithEmail(email, password, username);
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
          <h1>Registrer bruker</h1>
          <p className="text-sm text-foreground/70">Lag en bruker for å fortsette.</p>
        </div>

        <form onSubmit={onRegister} className="space-y-3">
          <TextBox
            id="email"
            label="Epost"
            variant="email"
            placeholder="ola.nordman@eksempel.no"
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />

          <TextBox
            id="username"
            label="Brukernavn"
            variant="text"
            placeholder="Brukernavn"
            value={username}
            onChange={setUsername}
            autoComplete="username"
          />

          <hr className="border-t border-foreground/20" />

          <TextBox
            id="password"
            label="Passord"
            variant="password"
            placeholder="Passord (minst 6 tegn)"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />

          <TextBox
            id="confirmPassword"
            label="Gjenta Passord"
            variant="password"
            placeholder="Passord (minst 6 tegn)"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
          />

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