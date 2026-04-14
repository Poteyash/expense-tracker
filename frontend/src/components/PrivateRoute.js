import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {

  const token = localStorage.getItem("accessToken");

  // ❌ अगर token नहीं → login
  if (!token) {
    return <Navigate to="/" />;
  }

  // ✅ अगर token है → page दिखाओ
  return children;
}