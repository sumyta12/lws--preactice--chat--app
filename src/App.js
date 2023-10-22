import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Conversation from "./pages/Conversation";
import Inbox from "./pages/Inbox";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/Route/PrivateRoute";
import NonPrivateRoute from "./components/Route/NonPrivateRoute";
import useAuthCheck from "./components/Hooks/useAuthCheck";

function App() {
  const authChecker = useAuthCheck();

  return authChecker ? (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <NonPrivateRoute>
              <Login />
            </NonPrivateRoute>
          }
        />
        <Route
          path="/register"
          element={
            <NonPrivateRoute>
              <Register />
            </NonPrivateRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <PrivateRoute>
              <Conversation />
            </PrivateRoute>
          }
        />
        <Route
          path="/inbox/:id"
          element={
            <PrivateRoute>
              <Inbox />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  ) : (
    <h1>data is comming</h1>
  );
}

export default App;
