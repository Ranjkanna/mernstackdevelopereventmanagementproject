import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./components/AuthContext";

import Login          from "./components/Eventlogin";
import Eventregister  from "./components/Eventregister";
import Eventnavbar    from "./components/Eventnavbar";
import EventGallery   from "./components/Gallery";
import LiveExperience from "./components/LiveExperience";

import Dashboard   from "./pages/Dashboard";

import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminCalendarMap from "./components/Admincalendarmap";
import BookingForm from "./components/BookingForm";

function App() {
  return (
    
    <AuthProvider>
      <Routes>
        <Route path="/"               element={<Eventnavbar />} />
        <Route path="/Eventlogin"      element={<Login />} />
        <Route path="/Eventregister"   element={<Eventregister />} />
        <Route path="/Gallery"         element={<EventGallery />} />
        <Route path="/Dashboard"       element={<Dashboard />} />
        <Route path="/LiveExperience"  element={<LiveExperience />} />
        
        <Route path="/AdminDashboard" element={<AdminDashboard/>} />
        <Route path="/UserDashboard" element={<UserDashboard/>} />
        <Route path="/Admincalendarmap" element={<AdminCalendarMap/>} />
        <Route path="/BookingForm" element={<BookingForm/>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;