import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../../features/Auth/AuthSlice";

export default function useAuthCheck() {
  const dispatch = useDispatch();
  const [check, setChecker] = useState(false);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (auth?.accessToken) {
      dispatch(
        userLoggedIn({
          accessToken: auth.accessToken,
          user: auth.user,
        })
      );
    }
    setChecker(true);
  }, [dispatch]);

  return check;
}
