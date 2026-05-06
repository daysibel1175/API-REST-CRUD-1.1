import { createContext, useContext, useState, ReactNode, JSX } from "react";
import type { Usuario, AuthContextType, LoginData } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading] = useState<boolean>(false);

  const login = async (data: LoginData): Promise<void> => {
    const userData: Usuario = { ...data, _id: "", nome: "", idade: 0, contato: 0 };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
