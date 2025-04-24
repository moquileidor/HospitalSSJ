import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavigationBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import CommitmentSection from "./components/CommitmentSection";
import DoctorsSection from "./components/DoctorsSection";
import Footer from "./components/Footer";
import Login from "./components/Login/Login";
import Register from "./components/Register";
import AboutUs from "./components/AboutUs";
import Services from "./components/Services";
import Contact from "./components/Contact";
import MoreInfo from "./components/MoreInfo";
import ScheduleAppointment from "./components/ScheduleAppointment";

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <CommitmentSection />
            <DoctorsSection />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/more-info" element={<MoreInfo />} />
        <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
