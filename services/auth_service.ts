import { supabase } from "@/lib/supabaseClient";

/**
 * Function to ensure we have a valid user ID, otherwise throws an error.
 * @param userId The user ID to validate
 * 
 * @returns The valid user ID
 * @throws an error if the user ID is null, undefined, or empty
 */
export function requireUserId(userId: string | null | undefined): string {
  if (!userId) throw new Error("Not authenticated.");
  return userId;
}

/**
 * Function to log in a user with email and password using Supabase auth.
 * @param email the user's email address
 * @param password the user's password
 * 
 * @returns the authentication data from Supabase
 * @throws an error if the login process fails, such as invalid credentials or network issues
 */
export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Function to initiate Google OAuth login using Supabase auth.
 * 
 * @returns the authentication data from Supabase
 * @throws an error if the login process fails
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // Update to your real URL in production
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Function to log out the current user using Supabase auth.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}