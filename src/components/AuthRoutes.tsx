import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import useAuthStore from "../stores/user";

const AuthRoute = ({ children }: { children: ReactNode }) => {
  const {token} = useAuthStore()
  return token
    ? <Navigate to="/" replace />
    : <>{children}</>;
};

export default AuthRoute;