import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { View } from "react-native";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  token: string;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState("");

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthProvider;
