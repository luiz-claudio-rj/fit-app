import { supabase } from "@/service/subapabse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthTokenResponsePassword, Session } from "@supabase/supabase-js";
import React, { createContext, useEffect, useState } from "react";

interface LoginForm {
  email: string;
  password: string;
}

interface UserProfile {
  avatar_url: string | null;
  full_name: string;
  id: string;
  updated_at: string | null;
  username: string | null;
  website: string | null;
}
interface AuthContextType {
  isAuthenticated: boolean;
  login: (form: LoginForm) => Promise<AuthTokenResponsePassword>;
  logout: () => void;
  profile?: UserProfile | null;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  const login = async ({email,password}: LoginForm) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };
  

  const getProfile = async () => {
    if(!session?.user) return
    try {
      const { data, error } = await supabase.from('profiles').select(
        `*`
      ).eq('id', session?.user?.id).single()
      if(error) throw error
      console.log("Data", data)
      return data
    } catch (error) {
      console.log("Error getProfile: ", error)
    }
  }

  useEffect(() => {
    if(session){
      getProfile().then((data) => {
        console.log("Profile", data)
        setProfile(data)
      })
    }
  }, [session])

  const logout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  console.log("Session: ", session)

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session && session.user !== null,
        login,
        logout,
        profile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthProvider;
