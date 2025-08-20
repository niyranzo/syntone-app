import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/Auth/useAuth';import Spinner from '../components/Spinner';
import { useAnimals } from '../hooks/Animal/useAnimal';
const API_URL = import.meta.env.VITE_API_URL; // Asegúrate de que esta variable de entorno esté configurada

const User = () => {
  const { user, loading: authLoading, changePassword } = useAuth();
  const { animals, loading: animalsLoading } = useAnimals();

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  // Estados para controlar la visibilidad de las contraseñas
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && user && user.changePassword) {
      setShowChangePasswordModal(true); 
    } else if (!authLoading && user && !user.changePassword) {
      setShowChangePasswordModal(false); 
    }
  }, [authLoading, user]); 

  // Función de validación para la nueva contraseña
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    // Expresión regular para al menos un carácter especial (que no sea letra, número o espacio)
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (!specialCharRegex.test(password)) {
      return "La contraseña debe contener al menos un carácter especial.";
    }
    return ""; // Si todas las validaciones pasan, retorna cadena vacía (sin errores)
  };

  // Manejador para el envío del formulario de cambio de contraseña
  const handlePasswordChange = async (e) => {
    e.preventDefault(); 
    setPasswordError(''); 
    setPasswordSuccess(''); 

    // Validar la nueva contraseña con la función auxiliar
    const newPasswordValidation = validatePassword(newPassword);
    if (newPasswordValidation) {
      setPasswordError(newPasswordValidation); 
      return; 
    }

    // Verificar que la nueva contraseña y la confirmación coincidan
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Las nuevas contraseñas no coinciden.");
      return; // Detener la ejecución si no coinciden
    }

    try {
      // Llamar a la función `changePassword` del AuthContext
      await changePassword(oldPassword, newPassword);
      setPasswordSuccess("Contraseña actualizada exitosamente."); // Mensaje de éxito
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setShowChangePasswordModal(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error al cambiar la contraseña.";
      setPasswordError(errorMessage);
    }
  };

  if (authLoading || !user) {
    return (
      <div className='mt-40 flex justify-center items-center h-screen'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='mt-50 px-4 md:px-0'>
      {/* Header Section - Responsive Layout */}
      <div className='flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-0'>
        {/* User Name Section */}
        <div className='flex flex-col items-center justify-center lg:mr-40 order-1 lg:order-1'>
          <div className='flex flex-col sm:flex-row font-bold text-3xl sm:text-4xl lg:text-5xl mb-5 text-center'>
            <p className='mr-0 sm:mr-3 mb-2 sm:mb-0'>{user.name}</p>
            <p className=''>{user.lastname}</p>
          </div>
          <hr className='bg-gradient-to-r from-pinkLigth to-aquamarine h-2 border-0 rounded-2xl w-60 sm:w-80 lg:w-100'/>
        </div>
        
        <div className='flex flex-col items-center justify-center rounded-xl shadow-lg shadow-gray-500 px-6 sm:px-12 lg:px-20 py-4 lg:py-2 w-full max-w-sm lg:max-w-none lg:w-auto order-2 lg:order-2'>
          <p className='border-b-2 border-b-aquamarine px-4 text-xl sm:text-2xl lg:text-3xl font-bold mb-3 text-center'>Tus Datos</p>
          <div className='text-center lg:text-left'>
            <p className='text-sm sm:text-base lg:text-lg break-all mb-2'>
              <i className="fa-solid fa-envelope mr-2"></i>{user.email}
            </p>
            <p className='text-sm sm:text-base lg:text-lg'>
              <i className="fa-solid fa-phone mr-2"></i>{user.phone}
            </p>
          </div>
        </div>
      </div>

      <div className='flex flex-col items-center mt-10'>
        <p className='w-full max-w-md text-xl sm:text-2xl font-bold text-center mt-10 border-b-2 border-b-aquamarine pb-2'>Tus Mascotas</p>
        <div className="mt-10 flex justify-evenly w-full mb-10 flex-wrap gap-10">
          {animalsLoading ? (
            <Spinner />
          ) : animals && animals.length > 0 ? (
            animals.map((animal) => (
              <Link to={`/animal/${animal.id_animal}`}
                key={animal.id_animal}
                style={{
                  backgroundImage: `url(${API_URL + animal.photo})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                className='w-60 h-70 rounded-lg flex items-baseline-last transition-transform duration-300 hover:scale-105 cursor-pointer'
              >
                <div className="bg-white h-20 w-full rounded-lg shadow-lg shadow-gray-500 flex items-center justify-center flex-col">
                  <p className='border-purple-600 border-b-1 w-20 font-bold text-center mb-2 '>{animal.name}</p>
                  <p>Ver Detalles</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-xl text-gray-600 text-center w-full">No tienes mascotas registradas.</p>
          )}
        </div>
      </div>

      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-700">
              ¡Importante! Cambia tu Contraseña
            </h2>
            <p className="mb-6 text-sm sm:text-base text-gray-700">
              Parece que es tu primer inicio de sesión o necesitas actualizar tu contraseña.
              Por favor, establece una nueva contraseña segura.
            </p>

            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Contraseña Antigua"
                  className="w-full p-2 sm:p-3 pr-10 border border-gray-300 rounded text-sm sm:text-base"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <i className={showOldPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Nueva Contraseña"
                  className="w-full p-2 sm:p-3 pr-10 border border-gray-300 rounded text-sm sm:text-base"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <i className={showNewPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmar Nueva Contraseña"
                  className="w-full p-2 sm:p-3 pr-10 border border-gray-300 rounded text-sm sm:text-base"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <i className={showConfirmPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                </button>
              </div>

              {passwordError && (
                <p className="text-red-600 text-xs sm:text-sm">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-green-600 text-xs sm:text-sm">{passwordSuccess}</p>
              )}

              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 sm:py-3 rounded hover:bg-purple-700 transition duration-300 text-sm sm:text-base"
              >
                Cambiar Contraseña
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;