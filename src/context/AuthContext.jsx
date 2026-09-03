import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("partner_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        if (response.data.role !== "partner") {
          localStorage.removeItem("partner_token");
          localStorage.removeItem("partner_user");

          setUser(null);
          return;
        }

        setUser(response.data);

        localStorage.setItem(
          "partner_user",
          JSON.stringify(response.data)
        );
      } catch (error) {
        console.error(
          "Failed to restore partner session:",
          error
        );

        localStorage.removeItem("partner_token");
        localStorage.removeItem("partner_user");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { access_token, user } = response.data;

    if (user.role !== "partner") {
      throw new Error(
        "This account does not have partner access."
      );
    }

    localStorage.setItem(
      "partner_token",
      access_token
    );

    localStorage.setItem(
      "partner_user",
      JSON.stringify(user)
    );

    setUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem("partner_token");
    localStorage.removeItem("partner_user");

    setUser(null);

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}