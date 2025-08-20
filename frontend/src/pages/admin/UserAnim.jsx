import { useEffect, useRef, useState } from 'react';
import { useAdmin } from '../../hooks/Admin/useAdmin';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import { toast } from 'react-toastify';
import BackButton from '../../components/BackButton';
const API_URL = import.meta.env.VITE_API_URL;

const UserAnim = () => {
  const { id } = useParams();
  const { getUserAnimals, loading, getUserById, deleteAnimal } = useAdmin();
  const [animals, setAnimals] = useState([]);
  const [user, setUser] = useState({});
  const [openid_animal, setOpenid_animal] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedid_animal, setSelectedid_animal] = useState(null);
  
  const actionMenuRefs = useRef({});

  const fetchAnimals = async () => {
    try {
      const data = await getUserAnimals(id);
      setAnimals(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async () => {
    const user = await getUserById(id);
    setUser(user);
  };

  const handleDeleteAnimal = async (id_animal) => {
    setSelectedid_animal(id_animal);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
    try {
      await deleteAnimal(selectedid_animal);
      await fetchAnimals();
    } catch (error) {
      console.error("Error al eliminar el Animal:", error);
      toast.error("Error al eliminar el Animal.");
    } finally {
      setShowConfirm(false);
      setSelectedid_animal(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedid_animal(null);
  };

  useEffect(() => {

    fetchAnimals();
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const menuRef = actionMenuRefs.current[openid_animal];
      if (menuRef && !menuRef.contains(e.target)) {
        setOpenid_animal(null);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openid_animal]);

  return (
    <div className='mt-50'>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className='flex justify-center flex-col items-center'>
            <BackButton/>
            <div className='flex flex-col items-center justify-center'>
              <h1 className='flex font-bold text-5xl mb-5 text-center'>Gestionar Mascotas</h1>
              <hr className='bg-gradient-to-r from-pinkLigth to-aquamarine h-2 border-0 rounded-2xl w-100' />
            </div>
            <p className='w-45 text-2xl font-bold text-center mt-10 border-b-2 border-b-aquamarine'>
              {user.name} {user.lastname}
            </p>
          </div>

          <div className='flex flex-col items-center mt-10'>
            {animals && animals.length === 0 ? ( // Verifica si el array animals está vacío
              <p className='text-gray-500 text-lg mb-10'>Todavía no tiene mascotas registradas.</p>
            ) : (
              <div className="mt-10 flex justify-evenly w-full mb-30 flex-wrap gap-10">
                {animals?.map((animal) => (
                  <div
                    key={animal.id_animal}
                    style={{
                      backgroundImage: `url(${API_URL + animal.photo})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    className='w-60 h-70 rounded-lg flex items-end transition-transform duration-300 hover:scale-105 cursor-pointer p-2'
                  >
                    <div className="bg-white h-25 w-full rounded-lg shadow-lg shadow-gray-500 flex flex-col items-center gap-2 justify-center relative"
                        ref={(el) => actionMenuRefs.current[animal.id_animal] = el}>
                      <p className='border-purple-600 border-b-1 w-20 font-bold text-center'>{animal.name}</p>
                      <button
                        className='border-2 border-purple-500 rounded-xl p-2 hover:bg-purple-500 hover:text-white transition duration-300'
                        onClick={() =>
                          setOpenid_animal(prev => prev === animal.id_animal ? null : animal.id_animal)
                        }
                      >
                        Acciones
                      </button>

                      {openid_animal === animal.id_animal && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-purple-100 text-black rounded-xl shadow-lg z-10">
                          <div className="flex flex-col p-2 space-y-2">
                            <Link
                              to={`/admin/animal/${animal.id_animal}/consultation`}
                              className="text-left font-bold hover:bg-purple-200 cursor-pointer px-3 py-2 rounded transition duration-300"
                            >
                              Realizar nueva consulta
                            </Link>
                            <Link
                              to={`/admin/animal/${animal.id_animal}/history`}
                              className="text-left hover:bg-purple-200 cursor-pointer px-3 py-2 rounded transition duration-300"
                            >
                              Ver Historial Clínico
                            </Link>
                            <Link
                              to={`/admin/animal/${animal.id_animal}/diagnostic/new`}
                              className="text-left hover:bg-purple-200 cursor-pointer px-3 py-2 rounded transition duration-300"
                            >
                              Añadir Diagnóstico por Imagen
                            </Link>
                            <Link
                              to={`/admin/animal/${animal.id_animal}/analysis/new`}
                              className="text-left hover:bg-purple-200 cursor-pointer px-3 py-2 rounded transition duration-300"
                            >
                              Añadir Análisis
                            </Link>
                            <button
                              className="text-left hover:bg-red-300 cursor-pointer px-3 py-2 rounded transition duration-300 text-red-700"
                              onClick={() => handleDeleteAnimal(animal.id_animal)}
                            >
                              Eliminar Mascota
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
            {showConfirm && (
            <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-bold mb-4">
                  ¿Estás seguro de que deseas borrar la Mascota?
                </h2>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={confirmDelete}
                  >
                    Sí, borrar
                  </button>
                  <button
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={cancelDelete}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserAnim;