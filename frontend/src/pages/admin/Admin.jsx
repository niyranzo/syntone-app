import React, { useEffect, useRef, useState } from 'react';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/Auth/useAuth';
import { useAdmin } from '../../hooks/Admin/useAdmin';

const Admin = () => {
  const { user } = useAuth(); // Asumiendo que `user` del AuthContext es el admin logueado
  const { getUsers, loader, deleteUser } = useAdmin();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openActionsId, setOpenActionsId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        // Filtramos aquí los usuarios para mostrar solo los de tipo 'user'
        const regularUsers = fetchedUsers.filter(u => u.type === 'user');
        setUsers(regularUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [getUsers]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const menuRef = menuRefs.current[openActionsId];
      if (menuRef && !menuRef.contains(e.target)) {
        setOpenActionsId(null);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openActionsId]);

  const handleDelete = (userToDelete) => { // Renombrado para evitar conflicto con `user` del AuthContext
    setSelectedUser(userToDelete);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(selectedUser.id_user);
      setUsers(prev => prev.filter(u => u.id_user !== selectedUser.id_user));
      setShowConfirm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.name} ${u.lastname}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className='min-h-screen mt-20 md:mt-0'>
      <div className='pt-20 sm:pt-24 md:pt-32 lg:pt-40 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-6 sm:mb-8'>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4'>
              Página Administrador
            </h1>
            <hr className='bg-gradient-to-r from-pinkLigth to-aquamarine h-1 sm:h-2 border-0 rounded-2xl mx-auto max-w-xs sm:max-w-md'/>
          </div>
          
          <p className='text-lg sm:text-xl lg:text-2xl font-semibold text-center mb-6 sm:mb-8 lg:mb-10'>
            {`${user.name} ${user.lastname}`}
          </p>

          <div className='flex justify-center mb-6 sm:mb-8'>
            <Link 
              to="/admin/appointments" 
              className='border-2 border-purple-500 rounded-xl px-4 py-2 sm:px-6 sm:py-3 hover:bg-purple-500 hover:text-white transition duration-300 text-sm sm:text-base font-medium'
            >
              Ver Próximas Citas
            </Link>
          </div>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10'>
            <div className='w-full sm:w-auto flex-1 sm:flex-none sm:min-w-80'>
              <div className='border-2 border-purple-500 rounded-lg px-3 py-2 sm:px-4 sm:py-3 flex items-center bg-white'>
                <i className="fa-solid fa-magnifying-glass text-purple-500 mr-2"></i>
                <input
                  type="text"
                  placeholder="Buscar usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none bg-transparent text-sm sm:text-base"
                />
              </div>
            </div>

            <Link 
              to="/admin/register" 
              className='w-full sm:w-auto border-2 border-purple-500 rounded-xl px-4 py-2 sm:px-6 sm:py-3 hover:bg-purple-500 hover:text-white transition duration-300 text-center text-sm sm:text-base font-medium'
            >
              Dar Alta Usuario
            </Link>
          </div>
        </div>
      </div>

      <div className='px-4 sm:px-6 lg:px-8 pb-20'>
        <div className='max-w-7xl mx-auto'>
          {loader ? (
            <div className='flex justify-center py-20'>
              <Spinner />
            </div>
          ) : (
            <>
              {filteredUsers.length === 0 ? (
                <div className='text-center py-20'>
                  <p className="text-lg sm:text-xl text-gray-600">
                    No se encontró ningún usuario con ese nombre o email.
                  </p>
                </div>
              ) : (
                <div className='flex flex-wrap justify-center gap-4 sm:gap-6'>
                  {filteredUsers.map((userItem) => (
                    <div
                      className='flex flex-col w-sm max-w-sm items-center rounded-xl shadow-lg shadow-gray-500 py-5 px-4 bg-white break-words'
                      key={userItem.id_user}
                    >
                      <div className='grid grid-cols-2 gap-x-4 gap-y-4 w-full'>
                        <div className='flex flex-col items-center text-center'>
                          <p className='text-xl font-bold'>Nombre</p>
                          <p>{userItem.name} {userItem.lastname}</p>
                        </div>
                        <div className='flex flex-col items-center text-center'>
                          <p className='text-xl font-bold'>Email</p>
                          <p className='break-all'>{userItem.email}</p>
                        </div>
                        <div className='col-span-2 flex flex-col items-center text-center'>
                          <p className='text-xl font-bold'>Teléfono</p>
                          <p>{userItem.phone}</p>
                        </div>
                      </div>

                      <div className="relative mt-3" ref={el => menuRefs.current[userItem.id_user] = el}>
                        <button
                          className='border-2 border-purple-500 rounded-xl p-3 hover:bg-purple-500 hover:text-white transition duration-300'
                          onClick={() =>
                            setOpenActionsId(prev => prev === userItem.id_user ? null : userItem.id_user)
                          }
                        >
                          Acciones
                        </button>

                        {openActionsId === userItem.id_user && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-purple-100 text-black rounded-xl shadow-lg z-10 mt-2">
                            <div className="flex flex-col p-2 space-y-2">
                              <Link
                                to={`/admin/user/${userItem.id_user}/animals`}
                                className="text-left font-bold hover:bg-purple-200 cursor-pointer px-3 py-2 rounded transition duration-300"
                              >
                                Gestionar Mascotas
                              </Link>
                              <Link
                                to={`/admin/edit/${userItem.id_user}`}
                                className="text-left hover:bg-purple-200 cursor-pointer px-3 py-2 rounded transition duration-300"
                              >
                                Editar Usuario
                              </Link>
                              <Link
                                to={`/admin/newAnimal/${userItem.id_user}`}
                                className="text-left hover:bg-purple-200 cursor-pointer px-3 py-2 rounded transition duration-300"
                              >
                                Añadir nueva Mascota
                              </Link>
                              <button
                                className="text-left hover:bg-red-300 cursor-pointer px-3 py-2 rounded transition duration-300 text-red-700"
                                onClick={() => handleDelete(userItem)}
                              >
                                Borrar Usuario y Mascotas
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-center text-gray-800">
              ¿Estás seguro de que deseas borrar al usuario{' '}
              <span className="text-purple-600">
                {selectedUser.name} {selectedUser.lastname}
              </span>?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6">
              <button
                className="bg-red-500 text-white px-6 py-2 sm:py-3 rounded-lg hover:bg-red-600 transition duration-300 text-sm sm:text-base font-medium"
                onClick={confirmDelete}
              >
                Sí, borrar
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-400 transition duration-300 text-sm sm:text-base font-medium"
                onClick={cancelDelete}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;