import { ManageToken } from "@/lib/axios";
import React, {
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};
interface AuthContextProps {
  user: User | null;
  setUser: (user: User) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);
const USER_APP_STORAGE_KEY = "current_user_key";

export const publicRoutes = ["/", "/register"];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [_user, _setUser] = useState<User | null>(() => {
    const ___user = localStorage.getItem(USER_APP_STORAGE_KEY);
    return ___user ? JSON.parse(___user) : null;
  });
  const token = ManageToken.get();

  useEffect(() => {
    if (!_user || !token) {
      ManageToken.delete();
      localStorage.clear();
      if (!publicRoutes.includes(window.location.pathname)) {
        window.location.href = "/";
      }
    }
  }, [_user, token]);

  const setUser = useCallback(
    (user: User) => {
      _setUser(() => {
        localStorage.setItem(USER_APP_STORAGE_KEY, JSON.stringify(user));
        return user;
      });
    },
    [_setUser]
  );

  const logOut = useCallback(() => {
    _setUser(() => {
      localStorage.clear();
      ManageToken.delete();
      return null;
    });
  }, [_setUser]);

  return (
    <AuthContext.Provider
      value={{
        user: _user,
        logOut,
        setUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = use(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
