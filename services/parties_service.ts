import { supabase } from "@/lib/supabaseClient";
import { Party, PartyGuestRow, PartyStatus } from "@/lib/types/party_types";

function requireUserId(userId: string | null | undefined): string {
  if (!userId) throw new Error("Not authenticated.");
  return userId;
}

/**
 * Fetch parties where the current user is the owner
 */
export async function fetchOwnedParties(): Promise<Party[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);
  const userId = requireUserId(user?.id);

  const { data, error } = await supabase
    .from("parties")
    .select("party_id, owner_id, name, code, status, created_at, image_url")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Party[];
}

/**
 * Fetch parties where the current user is a guest
 */
export async function fetchGuestParties(): Promise<Party[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);
  const userId = requireUserId(user?.id);

  // Pull parties via party_guests join
  const { data, error } = await supabase
    .from("party_guests")
    .select(
      `
      party_id,
      parties:party_id (
        party_id, owner_id, name, code, status, created_at, image_url
      )
    `
    )
    .eq("user_id", userId)
    .order("joined_at", { ascending: false });

  if (error) throw new Error(error.message);

  // Flatten join results;
  // We also filter out nulls + owned parties to avoid duplication
  const parties = (data ?? [])
    .map((row: any) => row.parties as Party | null)
    .filter((p: Party | null): p is Party => Boolean(p))
    .filter((p) => p.owner_id !== userId);

  // Remove duplicates just in case
  const uniqueById = new Map<string, Party>();
  for (const p of parties) uniqueById.set(p.party_id, p);

  return Array.from(uniqueById.values());
}

/**
 * Convenience: fetch both lists in parallel.
 */
export async function fetchMyParties(): Promise<{
  ownedParties: Party[];
  guestParties: Party[];
}> {
  const [ownedParties, guestParties] = await Promise.all([
    fetchOwnedParties(),
    fetchGuestParties(),
  ]);

  return { ownedParties, guestParties };
}