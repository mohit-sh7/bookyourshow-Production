// src/App.jsx

import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favorite from "./pages/Favorite";
import VerifyTicket from "./pages/VerifyTicket";

import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddShows from "./pages/admin/AddShows";
import ListShows from "./pages/admin/ListShows";
import ListBookings from "./pages/admin/ListBookings";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import Loading from "./components/Loading";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  const { user, loading } = useAppContext();

  if (loading) return <Loading />;

  return (
    <>
      <Toaster />

      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/verify/:bookingId" element={<VerifyTicket />} />

        <Route
          path="/favorite"
          element={user ? <Favorite /> : <Navigate to="/login" />}
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User routes */}
        <Route
          path="/my-bookings"
          element={user ? <MyBookings /> : <Navigate to="/login" />}
        />

        {/* Admin routes */}
        <Route path="/admin/*" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>
      </Routes>

      {!hideNavbar && <Footer />}
    </>
  );
};

export default App;