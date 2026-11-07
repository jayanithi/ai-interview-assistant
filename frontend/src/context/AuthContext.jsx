import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : {
          name: "Jayanithi",
          email: "jayanithi85@gmail.com",
          avatar: "",
        };
  });

  // UPDATE USER
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };

    setUser(updatedUser);

    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // LOGOUT
  const logout = () => {
  // CLEAR STORAGE
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  // OPTIONAL
  sessionStorage.clear();

  // REDIRECT TO LOGIN
  window.location.href = "/login";
};

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);