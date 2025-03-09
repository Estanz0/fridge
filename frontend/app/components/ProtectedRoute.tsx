import { Navigate } from "react-router-dom";
import { useAuth } from "../util/useAuth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const auth = useAuth();
  const user = auth ? auth.user : null;

  if (user?.emailVerification === false) {
    return <Navigate to="/verify" />;
  }

  return user ? <div>{children}</div> : <Navigate to="/login" />;
};

export default ProtectedRoute;
