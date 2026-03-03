"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchMyParties } from "@/services/parties_service";
import type { Party } from "@/lib/types/party_types";
import CircularButton from "@/components/circular_button";
import PartyRow from "@/components/party_row";
import TopBar from "@/components/top_bar";

export default function PartiesPage() {
  const router = useRouter();

  const [ownedParties, setOwnedParties] = useState<Party[]>([]);
  const [guestParties, setGuestParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadParties() {
      try {
        setLoading(true);
        setError(null);
        const { ownedParties, guestParties } = await fetchMyParties();
        setOwnedParties(ownedParties);
        setGuestParties(guestParties);
      } catch (err: any) {
        setError(err?.message ?? "Could not load parties.");
      } finally {
        setLoading(false);
      }
    }

    loadParties();
  }, []);

  const hasAny =
    (ownedParties && ownedParties.length > 0) ||
    (guestParties && guestParties.length > 0);

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
    router.push("/parties/join");
  }

  function onJoinWithQR() {
    router.push("/parties/join/qr");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopBar
        title="Dine Fester"
        subtitle="Alle fester du eier eller er invitert til"
        items={[
          {
            key: "create",
            node: (
              <CircularButton
                onClick={onCreateNewParty}
                icon="plus"
                aria-label="Create party"
                title="Create party"
              />
            ),
          },
          {
            key: "divider",
            node: <div className="h-6 w-px bg-foreground/20" />,
          },
          {
            key: "join-qr",
            node: (
              <CircularButton
                onClick={onJoinWithQR}
                icon="qr"
                aria-label="Join a Party with QR"
                title="Join with QR"
              />
            ),
          },
          {
            key: "join-code",
            node: (
              <button
                type="button"
                onClick={onJoinWithCode}
                className="btn btn-primary flex-1"
              >
                Join fest med kode
              </button>
            ),
          },
        ]}
      />

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
            <p className="text-sm">
              Du er ikke i noen fester ennå, bli med eller lag en
            </p>
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
                  ownedSorted.map((p) => (
                    <PartyRow key={p.party_id} party={p} />
                  ))
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
                  guestSorted.map((p) => (
                    <PartyRow key={p.party_id} party={p} />
                  ))
                )}
              </div>
            </section>
          </>
        )}

        <div className="h-6" />
      </div>
    </main>
  );
}