export type PartyStatus = "active" | "archived";
export type PartyRole = "owner" | "guest";

export type Party = {
  party_id: string;
  owner_id: string;
  name: string;
  code: string;
  status: PartyStatus;
  created_at: string;
  image_url: string | null;
};

export type PartyGuestRow = {
  party_id: string;
  user_id: string;
  role: PartyRole;
  display_name: string;
  joined_at: string;
  disqualified: boolean;
};