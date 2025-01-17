import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    return token && user?.isAdmin ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminRoutes;