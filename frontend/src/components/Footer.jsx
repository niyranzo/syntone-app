import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-10 px-6 md:px-12 grid md:grid-cols-3 gap-8 md:gap-16 border-t border-gray-700">

      {/* Sección del Logo y Puntos de Color */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0">
        <h3 className="text-2xl font-bold text-purple-200 mb-4">Syntone®</h3>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
          <div className="w-4 h-4 bg-purple-200 rounded-full shadow-md"></div>
          <div className="w-4 h-4 bg-green-400 rounded-full shadow-md"></div>
        </div>
        <p className="mt-4 text-sm">&copy; {new Date().getFullYear()} Syntone. Todos los derechos reservados.</p>
      </div>

      {/* Sección de Navegación */}
      <div className="text-center md:text-left">
        <h4 className="font-semibold text-white text-lg mb-4">Navegación</h4>
        <ul className="space-y-3">
          <li>
            <Link to="/feed" className="hover:text-green-400 transition duration-200 ease-in-out">Feed</Link>
          </li>
          <li>
            <Link to="/buscar" className="hover:text-green-400 transition duration-200 ease-in-out">Buscar</Link>
          </li>
          <li>
            <Link to="/crear-post" className="hover:text-green-400 transition duration-200 ease-in-out">Crear post</Link>
          </li>
        </ul>
      </div>

      {/* Sección de Cuenta */}
      <div className="text-center md:text-left">
        <h4 className="font-semibold text-white text-lg mb-4">Cuenta</h4>
        <ul className="space-y-3">
          <li>
            <Link to="/perfil" className="hover:text-green-400 transition duration-200 ease-in-out">Perfil</Link>
          </li>
          <li>
            <Link to="/editar-perfil" className="hover:text-green-400 transition duration-200 ease-in-out">Editar</Link>
          </li>
          <li>
            <button className="text-gray-300 hover:text-green-400 transition duration-200 ease-in-out focus:outline-none">Cerrar sesión</button>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
// frontend/src/components/Footer.jsx