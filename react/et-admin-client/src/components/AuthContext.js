import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 컴포넌트 마운트 시 토큰 확인
  useEffect(() => {
    // localStorage에서 토큰 확인
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        setIsAdmin(parsedUserData.memberAuth === 2);
      } catch (error) {
        console.error("사용자 데이터 파싱 에러:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
      }
    }
  }, []);

  const globalState = {
    user,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={globalState}>{children}</AuthContext.Provider>
  );
};
