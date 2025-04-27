import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("accessToken");

  if (!isAuthenticated) {
    // If not authenticated, navigate to login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render children (or Outlet if no children are passed)
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
  