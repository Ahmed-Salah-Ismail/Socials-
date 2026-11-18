import { useContext } from "react";
import { AuthCreateContext } from "../../context/authContext";
import { Navigate } from "react-router-dom";

export default function CheckToken({ children }) {
  const { token } = useContext(AuthCreateContext);
  if (!token) {
    return <Navigate to={"/login"} replace />;
  }

  return <>{children}</>;
}
