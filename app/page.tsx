"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="hero">
      <video autoPlay muted loop playsInline className="hero-video">
        <source src="/beer_background.mp4" type="video/mp4" />
      </video>

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1 className="hero-title">Drink Off</h1>

        <div className="flex flex-col gap-4 w-56">
          <Link href="/login" className="btn btn-outline text-center">
            Jeg er Tørst
          </Link>
        </div>
      </div>
    </main>
  );
}