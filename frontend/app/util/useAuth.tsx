import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../util/Appwrite";

import { Models } from "appwrite";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null,
  );

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);

      const token = await account.createJWT();
      localStorage.setItem("authToken", token.jwt);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const contextData = {
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
