"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchMyParties } from "@/services/parties_service";
import type { Party } from "@/lib/types/party_types";
import CircularButton from "@/components/circular_button";

function PartyRow({ party }: { party: Party }) {
  const archived = party.status === "archived";

  return (
    <Link
      href={`/parties/${party.party_id}`}
      className={[
        "block rounded-2xl border p-4 transition",
        "active:scale-[0.99]",
        archived
          ? "opacity-55 bg-foreground/5"
          : "hover:bg-foreground/5",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div
          className={[
            "h-12 w-12 rounded-xl border bg-foreground/5 overflow-hidden shrink-0",
            archived ? "grayscale" : "",
          ].join(" ")}
        >
          {party.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={party.image_url}
              alt={party.name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold truncate">{party.name}</p>
            {archived && (
              <span className="text-[11px] px-2 py-0.5 rounded-full border bg-background/60">
                Archived
              </span>
            )}
          </div>

          <div className="mt-0.5 text-xs text-foreground/70 flex items-center gap-2">
            <span className="truncate">Code: {party.code}</span>
            <span className="opacity-60">•</span>
            <span className="truncate">
              {new Date(party.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Chevron-ish affordance */}
        <div className={["pt-1 text-foreground/60", archived ? "opacity-60" : ""].join(" ")}>
          <span aria-hidden>›</span>
        </div>
      </div>
    </Link>
  );
}

export default function PartiesPage() {
  const router = useRouter();

  const [ownedParties, setOwnedParties] = useState<Party[]>([]);
  const [guestParties, setGuestParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const { ownedParties, guestParties } = await fetchMyParties();
        if (!mounted) return;
        setOwnedParties(ownedParties);
        setGuestParties(guestParties);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message ?? "Could not load parties.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const hasAny = ownedParties.length > 0 || guestParties.length > 0;

  // Optional: show active parties first in each section, but keep archived clickable below.
  const sortActiveFirst = (a: Party, b: Party) => {
    const av = a.status === "archived" ? 1 : 0;
    const bv = b.status === "archived" ? 1 : 0;
    if (av !== bv) return av - bv;
    return (b.created_at ?? "").localeCompare(a.created_at ?? "");
  };

  const ownedSorted = useMemo(
    () => [...ownedParties].sort(sortActiveFirst),
    [ownedParties]
  );
  const guestSorted = useMemo(
    () => [...guestParties].sort(sortActiveFirst),
    [guestParties]
  );

  function onCreateNewParty() {
    router.push("/parties/create");
  }

  function onJoinWithCode() {
    router.push("/parties/join"); // create this route for code entry
  }

  function onJoinWithQR() {
    router.push("/parties/join/qr"); // create this route for QR scanning
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b">
        <div className="mx-auto w-full max-w-md px-4 py-4">
          <div className="min-w-0">
              <h1 className="text-xl font-semibold leading-tight">Dine Fester</h1>
              <p className="text-sm text-foreground/70 truncate">
                Alle fester du eier eller er invitert til 
              </p>
            </div>

          <div className="mt-6 flex items-center gap-3">
            {/* Button to Create a Party */}
            <CircularButton
            onClick={onCreateNewParty}
            icon="plus"
            aria-label="Create party"
            title="Create party"
            />

            {/* Bar to seperate Create from Join */}
            <div className="h-6 w-px bg-foreground/20" />
            
            {/* Buttons to Join a party */}
            <CircularButton
            onClick={onJoinWithQR}
            icon="qr"
            aria-label="Join a Party with QR"
            title="Join with QR"
            />

            <button
              type="button"
              onClick={onJoinWithCode}
              className="btn btn-primary flex-1"
            >
              Join fest med kode
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-md px-4 py-5 space-y-6">
        {error && (
          <div className="rounded-2xl border p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            <div className="h-5 w-28 bg-foreground/10 rounded" />
            <div className="h-20 bg-foreground/10 rounded-2xl" />
            <div className="h-20 bg-foreground/10 rounded-2xl" />
            <div className="h-5 w-36 bg-foreground/10 rounded mt-6" />
            <div className="h-20 bg-foreground/10 rounded-2xl" />
          </div>
        ) : !hasAny ? (
          <div className="text-center text-gray-500">
            <p className="text-sm">Du er ikke i noen fester ennå, bli med eller lag en</p>
          </div>
        ) : (
          <>
            {/* Owned */}
            <section className="space-y-3">
              <div className="flex items-end justify-between">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-foreground/70">
                  Owned
                </h2>
                <span className="text-xs text-foreground/60">
                  {ownedSorted.length}
                </span>
              </div>

              <div className="space-y-3">
                {ownedSorted.length === 0 ? (
                  <div className="rounded-2xl border p-4 text-sm text-foreground/70">
                    You don’t own any parties yet.
                  </div>
                ) : (
                  ownedSorted.map((p) => <PartyRow key={p.party_id} party={p} />)
                )}
              </div>
            </section>

            {/* Invited */}
            <section className="space-y-3">
              <div className="flex items-end justify-between">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-foreground/70">
                  Invited
                </h2>
                <span className="text-xs text-foreground/60">
                  {guestSorted.length}
                </span>
              </div>

              <div className="space-y-3">
                {guestSorted.length === 0 ? (
                  <div className="rounded-2xl border p-4 text-sm text-foreground/70">
                    You’re not invited to any parties yet.
                  </div>
                ) : (
                  guestSorted.map((p) => <PartyRow key={p.party_id} party={p} />)
                )}
              </div>
            </section>
          </>
        )}

        {/* Bottom safe area spacing for phones */}
        <div className="h-6" />
      </div>
    </main>
  );
}