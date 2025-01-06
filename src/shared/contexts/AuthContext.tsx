import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { recoverUserInformation } from "@/shared/services/Auth";
import axios from "axios";

interface AuthenticateInterface {
  email: string;
  password: string;
}

interface User {
  nome: string;
  email: string;
  password: string;
  tipo: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  authenticateUser: ({
    email,
    password,
  }: AuthenticateInterface) => Promise<{ success: boolean; message: string }>;
  signOutUser: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);

const delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { token } = parseCookies();
    if (token) {
      recoverUserInformation(token).then((response) => {
        setUser(response);
      });
    }
  }, []);

  const authenticateUser = async ({ email, password }: AuthenticateInterface) => {
    await delay(1000);
    const response = await axios.post("http://127.0.0.1:8000/api/auth", {
      email: email,
      password: password,
    });

    if (response.status === 200) {
      const token = response.data.token;
      const user = response.data.user;

      setCookie(null, "token", token, {
        maxAge: 60 * 60 * 24,
      });

      setUser(user);
      return { success: true, message: "Usuário autenticado com sucesso!" };
    } else {
      return { success: false, message: "Falha na autenticação" };
    }
  };

  const signOutUser = () => {
    setUser(null);
    destroyCookie(null, "token");
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, authenticateUser, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
