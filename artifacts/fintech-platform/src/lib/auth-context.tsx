import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("finaxis_user");
    const storedRole = localStorage.getItem("finaxis_role");
    
    if (storedUser && storedRole) {
      try {
        setUser(JSON.parse(storedUser));
        setRole(storedRole as UserRole);
      } catch (e) {
        // Invalid JSON
        localStorage.removeItem("finaxis_user");
        localStorage.removeItem("finaxis_role");
      }
    }
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
    setRole(newUser.role);
    localStorage.setItem("finaxis_user", JSON.stringify(newUser));
    localStorage.setItem("finaxis_role", newUser.role);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("finaxis_user");
    localStorage.removeItem("finaxis_role");
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
