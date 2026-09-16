import { useCallback, useEffect, useState } from "react";

import authService from "../services/authService.js";
import AuthContext from "./authContext.js";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const getUserFromProfileResponse = (response) => {
  return response?.user ?? response?.data?.user ?? response?.data ?? null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const [loading, setLoading] = useState(
    Boolean(localStorage.getItem("token")),
  );

  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token")),
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await authService.getProfile();

      const userData = getUserFromProfileResponse(response);

      if (!userData) {
        throw new Error("Invalid profile response from server");
      }

      setUser(userData);
      setIsAuthenticated(true);

      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Authentication check failed:", error);

      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    void Promise.resolve().then(checkAuthStatus);
  }, [checkAuthStatus]);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  };

  const updateUser = (updatedUserData) => {
    setUser((currentUser) => {
      const newUserData = {
        ...currentUser,
        ...updatedUserData,
      };

      localStorage.setItem("user", JSON.stringify(newUserData));

      return newUserData;
    });
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
