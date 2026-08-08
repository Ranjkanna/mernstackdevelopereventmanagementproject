
// Checks the logged-in user's role and shows the correct dashboard:
//   - isAdmin: true   → AdminDashboard
//   - isAdmin: false  → UserDashboard

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import AdminDashboard from "./AdminDashboard";
import UserDashboard  from "./UserDashboard";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // ✅ navigate() inside useEffect — not during render
  useEffect(() => {
    if (!loading && !user) {
      navigate("/Eventlogin");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <div style={s.center}><p>Loading...</p></div>;
  }

  if (!user) {
    // useEffect above will redirect; render nothing meanwhile
    return null;
  }

  // ── ROLE-BASED ROUTING ──────────────────────────────────────────────────
  return user.isAdmin ? <AdminDashboard /> : <UserDashboard />;
}

const s = {
  center: {
    display:"flex", alignItems:"center", justifyContent:"center",
    height:"100vh", fontSize:16, color:"#666",
  },
};