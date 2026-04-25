import React from "react";
import { Routes, Route } from "react-router-dom";

// Lazy Pages
import { lazy } from "react";
import MainLayout from "../components/layout/MainLayout.jsx";
import Navbar from "@/components/layout/navbar/Navbar.jsx";
import SearchDrawer from "@/components/layout/navbar/SearchDrawer.jsx";
import AuthModal from "@/features/auth/AuthModel.jsx";

const HomePage = lazy(() => import("../features/home/pages/HomePage.jsx"));

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <SearchDrawer />
      <AuthModal />

      <Routes>

        {/* Public Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/movie/:id" element={<MovieDetails />} /> */}
        </Route>

        {/* Protected Flow (Booking)
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/seat-selection/:showId" element={<SeatSelection />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      Auth Layout
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route> */}
      </Routes>

    </>
  );
};

export default AppRoutes;
