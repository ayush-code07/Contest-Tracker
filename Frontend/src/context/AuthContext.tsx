import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase"; 

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check active session on initial app load
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 2. Listen to real-time auth changes (sign in, sign out, token refresh)
    // the react gave the function to the supabase sdk in the browser and after that in the future
    // if any change occurs, the supabase sdk will call this function and we can set our state accordingly
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign In with email & password
  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  // Sign Up with email, password, and optional full name
  // options.data.full_name: Stores the user's name directly in Supabase's user_metadata
  // so you can display their name in the Navbar without needing a separate profile table.
  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split("@")[0],
        },
      },
    });
    return { error };
  };

  // Sign Out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {/* These are all the other components in your app (like your HomePage, Profile, or Navigation). */}
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth in components easily
export const useAuth = () => {
  const context = useContext(AuthContext); // it goes up the tree till it finds the authProvider
  // (and authProvider returns it with the value prop which holds the entire AuthContextType)
  // if it doesn't find it, it returns undefined and we throw an error
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context; // now we can use useAuth() in any component to get the auth state
};
