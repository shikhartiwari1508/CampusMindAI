import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");
    return stored ? { token: stored, role } : null;
  });

  const login = async (email, password) => {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);
    const response = await axios.post("/auth/login", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const { access_token, token_type } = response.data;
    const token = access_token; // store raw token
    const payload = JSON.parse(atob(access_token.split(".")[1]));
    const role = payload.sub_role || payload.role || "student";
    localStorage.setItem("access_token", token);
    localStorage.setItem("role", role);
    setUser({ token, role });
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    navigate(role === "admin" ? "/admin/dashboard" : "/dashboard");
  };

  const register = async (data) => {
    await axios.post("/auth/register", data);
    await login(data.email, data.password);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    }
  }, []);
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
