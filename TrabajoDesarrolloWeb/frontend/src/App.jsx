import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, RoleRoute } from "./components/ProtectedRoute";


import NavigationBar from "./components/Navbar";
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
import RegisterSpecialty from "./components/RegisterSpecialty";
import AdminPanel from "./components/AdminPanel";
import UserProfile from "./components/UserProfile";
import Dashboard from "./components/Dashboard";
import CompletarPerfil from "./pages/CompletarPerfil";

/**
 * Componente principal de la aplicación
 * Este componente maneja toda la estructura de rutas y la navegación
 * de la aplicación. Está envuelto en un AuthProvider para manejar la
 * autenticación globalmente.
 */
function App() {
  return (
    // AuthProvider envuelve toda la aplicación para manejar el estado de autenticación
    <AuthProvider>
      {/* Router maneja la navegación entre diferentes páginas */}
      <Router>
        {/* Barra de navegación que aparece en todas las páginas */}
        <NavigationBar />
        <Routes>
          {/* 
            RUTAS PÚBLICAS
            Estas rutas son accesibles para todos los usuarios, incluso sin iniciar sesión
          */}
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

          {/* 
            RUTAS PROTEGIDAS
            Estas rutas solo son accesibles para usuarios que han iniciado sesión
            El componente ProtectedRoute verifica la autenticación
          */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/completar-perfil" element={<CompletarPerfil />} />
          </Route>

          {/* 
            RUTAS DE ADMINISTRADOR
            Estas rutas solo son accesibles para usuarios con rol de administrador
            El componente RoleRoute verifica el rol del usuario
          */}
          <Route element={<RoleRoute roles={['ADMINISTRADOR']} />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/register-specialty" element={<RegisterSpecialty />} />
          </Route>

          {/* 
            RUTAS PARA MÉDICOS
            Estas rutas solo son accesibles para usuarios con rol de médico
            El componente RoleRoute verifica el rol del usuario
          */}
          <Route element={<RoleRoute roles={['MEDICO']} />}>
            <Route path="/medico-dashboard" element={<div>Panel de Médico</div>} />
          </Route>
        </Routes>
        {/* Pie de página que aparece en todas las páginas */}
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
