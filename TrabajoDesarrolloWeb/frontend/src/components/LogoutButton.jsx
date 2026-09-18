import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ className }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <button 
      className={className || "btn btn-outline-danger btn-sm w-100 text-left"} 
      onClick={handleLogout}
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
