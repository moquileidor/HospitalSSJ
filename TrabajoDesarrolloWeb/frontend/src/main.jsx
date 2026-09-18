// Importación de los estilos de Bootstrap para el diseño de la aplicación
import "bootstrap/dist/css/bootstrap.min.css";
// Importación de React, la biblioteca principal para construir la interfaz de usuario
import React from "react";
// Importación de ReactDOM, que nos permite renderizar la aplicación en el navegador
import ReactDOM from "react-dom/client";
// Importación del componente principal de la aplicación
import App from "./App.jsx";

// 
// Este es el punto de entrada principal de la aplicación React.
// Aquí es donde se inicia todo el proceso de renderizado.
//
ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode es un modo de desarrollo que ayuda a encontrar problemas potenciales
  // en la aplicación. No afecta al código en producción.
  <React.StrictMode>
    {/* El componente App es el componente raíz de toda la aplicación */}
    <App />
  </React.StrictMode>
);
