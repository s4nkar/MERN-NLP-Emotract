import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  children?: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  if (!isAuthenticated) {
    // If not authenticated, navigate to login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render children (or Outlet if no children are passed)
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
