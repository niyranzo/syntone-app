import React from 'react';

const Navbar = () => {
  return (
    <header className="flex justify-between items-center bg-black py-4 px-6 md:px-10 shadow-lg">
      {/* Logo de la aplicación */}
      <div className="flex items-center">
        <img
          src="/img/logos/icon.png" // Ruta al logo en la carpeta public
          alt="Syntone Logo"
          className="h-8 w-auto mr-2" // Ajusta el tamaño del logo
        />
        {/* El texto del logo ahora usa un rosa estándar de Tailwind */}
        <h1 className="text-2xl font-bold text-purple-200 tracking-wide">Syntone</h1>
      </div>

      {/* Botones de navegación */}
      <div className="flex space-x-4 md:space-x-6">
        <button className="text-gray-300 text-base font-medium px-4 py-2 rounded-full transition duration-300 ease-in-out hover:bg-gray-700 hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50">
          Iniciar sesión
        </button>
      </div>
    </header>
  );
};

export default Navbar;
