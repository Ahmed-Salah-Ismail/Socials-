import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  userId: string | null;
  setAuthToken: (token: string) => void;
  clearAuthToken: () => void;
}

export const AuthCreateContext = createContext<AuthContextType>({
  token: null,
  setAuthToken: (token: string) => {},
  clearAuthToken: () => {},
  userId: null,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthContext(props: AuthProviderProps) {
  // lazy initialization of the token state from localStorage
  const [token, setToken] = useState(function () {
    return localStorage.getItem("token");
  });

  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (token) {
      const tokenAfterDecode = jwtDecode(token);

      setUserId(tokenAfterDecode.user);
    }
  }, [token]);

  function setAuthToken(token: string) {
    setToken(token);
    localStorage.setItem("token", token);
    console.log("tokennnnnn", token);
  }

  function clearAuthToken() {
    console.log("Logout clicked");
    localStorage.removeItem("token");
    setToken(null);
  }
  return (
    <AuthCreateContext.Provider
      value={{ token, setAuthToken, clearAuthToken, userId }}
    >
      {props.children}
    </AuthCreateContext.Provider>
  );
}

//   useEffect(() => {
//     if (localStorage.getItem("token")) {
//       setToken(localStorage.getItem("token"));
//     }
//   }, []);
