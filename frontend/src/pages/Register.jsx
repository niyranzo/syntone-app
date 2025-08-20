import React, { useState } from 'react';
import { useAuthLogic } from '../hooks/Auth/useAuthLogic.js';
import { Link, useNavigate } from 'react-router-dom'; // Para navegación y enlace a login

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, error, setError } = useAuthLogic(); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null);

    // Validaciones básicas del lado del cliente
    if (!username || !email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    // Simple validación de email
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Por favor, introduce un email válido.");
        return;
    }

    try {
      const newUser = await register({ username, email, password });
      if (newUser) {
        // Si el registro es exitoso, redirigimos al usuario a la página de inicio o feed
        navigate('/'); // O a '/feed' si esa es la página principal post-registro
      }
    } catch (err) {
      // El error ya se maneja dentro de useAuthLogic y se muestra con toast
      console.error("Error al intentar registrar:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8 font-sans">
      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Regístrate en Syntone</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-gray-300 text-sm font-medium mb-2">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-green-400 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-green-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-purple-300 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
