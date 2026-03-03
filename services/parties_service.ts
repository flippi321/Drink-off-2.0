import { Party, PartyGuestRow, PartyStatus } from "@/lib/types/party_types";
import { useEdgeFunction } from "../hooks/edge_functions";

/**
 * Fetch parties where the current user is the owner
 * 
 * @returns a list of parties owned by the current user
 * @throws an error if the user is not authenticated or if the database query fails
 */
export async function fetchOwnedParties(): Promise<Party[]> {
  const { data, error } = await useEdgeFunction("get-owned-parties");

  if (error) throw new Error(error.message);
  return data as Party[] ?? [];
}

/**
 * Fetch parties where the current user is a guest and not the owner
 * 
 * @returns a list of parties the current user is a guest in
 * @throws an error if the user is not authenticated or if the database query fails
 */
export async function fetchGuestParties(): Promise<Party[]> {
  const { data, error } = await useEdgeFunction("get-user-parties");

  if (error) throw new Error(error.message);
  return data as Party[] ?? [];
}

/**
 * Function to call both fetchOwnedParties and fetchGuestParties and return their results together.
 * 
 * @returns an object containing two lists: ownedParties and guestParties
 */
export async function fetchMyParties(): Promise<{ ownedParties: Party[]; guestParties: Party[] }> {
  const [ownedParties, guestParties] = await Promise.all([
    fetchOwnedParties(),
    fetchGuestParties(),
  ]);
  return { ownedParties, guestParties };
}