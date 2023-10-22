import { Navigate } from "react-router-dom";
import useUserDetails from "../Hooks/useUserDetails";

export default function NonPrivateRoute({ children }) {
  const active = useUserDetails();

  return !active ? children : <Navigate to="/inbox" />;
}
