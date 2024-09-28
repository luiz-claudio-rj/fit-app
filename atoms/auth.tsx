import { supabase } from "@/service/subapabse";
import { AuthTokenResponsePassword, Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useEffect, useState } from "react";

interface LoginForm {
  email: string;
  password: string;
}

interface UserProfile {
  avatar_url: null;
  birthdate: string;
  body: Body;
  email: string;
  full_name: string;
  id: string;
  isActive: boolean;
  updated_at: null;
  gender: "male" | "female";
}

interface Body {
  breast: number;
  created_at: string;
  height: number;
  hip: number;
  id: number;
  user_id: string;
  waist: number;
  weight: number;
}
interface AuthContextType {
  isAuthenticated: boolean;
  login: (form: LoginForm) => Promise<AuthTokenResponsePassword>;
  logout: () => void;
  profile: UserProfile;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);

  const login = async ({ email, password }: LoginForm) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const getProfile = async () => {
    if (!session?.user.id) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`*`)
        .eq("id", session.user.id)
        .single();
      const { data: body, error: bodyErro } = await supabase
        .from("log_body_history")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (error) throw error;
      if (bodyErro) throw bodyErro;
      return {
        ...data,
        body: bodyErro ? null : body,
      };
    } catch (error) {

      console.log("Error getProfile: ", error);
      throw error;
    }
  };

  console.log("session", session);
  const {
    data: profileData,
    error: profileError,
    refetch,
  } = useQuery({
    queryKey: ["profile", session?.user.id],
    queryFn: () => getProfile(),
    enabled: !!session?.user.id,
  });

  const logout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      refetch();
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      refetch();
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated:
          !!session && session.user !== null && !!profileData && !profileError,
        login,
        logout,
        profile: profileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthProvider;
