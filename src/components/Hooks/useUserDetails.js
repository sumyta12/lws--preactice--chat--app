import { useSelector } from "react-redux";

export default function useUserDetails() {
  const { accessToken, user } = useSelector((state) => state.auth);

  if (accessToken && user?.email) {
    return true;
  }

  return false;
}
