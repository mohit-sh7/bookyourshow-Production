import React from "react";
import { Outlet, Navigate } from "react-router-dom";

import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Loading from "../../components/Loading";
import { useAppContext } from "../../context/AppContext";

const Layout = () => {
  const { user, isAdmin, isAdminLoading } = useAppContext();

  if (isAdminLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold text-red-500">
          You are not authorized.
        </h1>
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />

      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;