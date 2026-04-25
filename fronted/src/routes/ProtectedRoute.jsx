// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = () => {
//   const { isAuthenticated, loading } = useSelector((state) => state.auth);

//   if (loading) return <div>Checking auth...</div>;

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;