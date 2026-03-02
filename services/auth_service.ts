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
  if (error) throw new Error(error);
  return data;
}

/**
 * Function to register a new user with email and password using Supabase auth, along with optional profile data.
 * @param email the user's email address
 * @param password the user's password
 * @param username the user's chosen username
 * @param gender the user's gender
 * @param weight the user's weight
 * @param avatar_url the URL to the user's avatar image
 * 
 * @returns the authentication data from Supabase
 * @throws an error if the registration process fails, such as email already in use or network issues
 */
export async function registerWithEmail(email: string, password: string, username: string, gender?: string, weight?: number, avatar_url?: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        username,
        gender,      // optional
        weight,      // optional
        avatar_url,  // optional
      },
    },
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