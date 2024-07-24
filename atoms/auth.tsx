import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  token: string;
  loaded: boolean;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState("");
  const [loaded, setLoaded] = useState(false);

  const login = async (token: string) => {
    await AsyncStorage.setItem("@token", token);
    setToken(token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("@token");
    setToken("");
  };

  useEffect(() => {
    (async () => {
      const storagedToken = await AsyncStorage.getItem("@token");
      if (storagedToken) {
        setToken(storagedToken);
        setLoaded(true);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token),
        login,
        logout,
        token,
        loaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthProvider;
