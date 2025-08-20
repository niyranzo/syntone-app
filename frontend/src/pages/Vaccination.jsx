import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAnimals } from '../hooks/Animal/useAnimal';
import { useAuth } from '../hooks/Auth/useAuth';import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { useAdmin } from '../hooks/Admin/useAdmin';
import BackButton from '../components/BackButton';

const Vaccination = () => {
    const { id } = useParams();
    const { getVaccination, loading } = useAnimals();
    const { user } = useAuth();
    const { deleteVaccination } = useAdmin();
    const [vaccinations, setVaccination] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedVaccinationId, setSelectedVaccinationId] = useState(null);

    const fetchVaccinations = async () => {
        try {
            const data = await getVaccination(id);
            setVaccination(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching vaccinations:", err);
            toast.error("Error al cargar las vacunas.");
        } 
    };

    useEffect(() => {
        fetchVaccinations();
    }, [id, getVaccination]);

    const handleDeleteClick = (vaccinationId) => {
        setSelectedVaccinationId(vaccinationId);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteVaccination(selectedVaccinationId);
            await fetchVaccinations(); // Recargar la lista de vacunas
        } catch (err) {
            console.error("Error deleting vaccination:", err);
            toast.error("Error al eliminar la vacuna.");
        } finally {
            setShowConfirm(false);
            setSelectedVaccinationId(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setSelectedVaccinationId(null);
    };

    if (loading) {
        return (
            <div className="mt-40 flex justify-center items-center h-full">
                <Spinner />
            </div>
        );
    }

    return (
        <div className='mt-40 flex flex-col items-center px-4'>
            <BackButton/>
            <div className='flex flex-col items-center w-full justify-center my-16'>
                <h1 className='text-5xl font-bold mb-4 text-center'>Vacunas</h1>
                <hr className='bg-gradient-to-r from-pinkLigth to-aquamarine h-2 border-0 rounded-2xl w-1/2' />
            </div>

            {vaccinations.length === 0 ? (
                <p className='text-lg font-semibold text-gray-500 mb-10 text-center'>
                    Tu mascota aún no tiene vacunas registradas.
                </p>
            ) : (
                <div className='bg-white shadow-md rounded-xl p-6 w-full max-w-5xl mb-20 overflow-x-auto'>
                    <table className='w-full text-center min-w-[600px]'>
                        <thead>
                            <tr className='border-b-2 border-purple-400'>
                                <th className='py-2 px-4 font-semibold'>Vacunación</th>
                                <th className='py-2 px-4 font-semibold'>Fecha</th>
                                <th className='py-2 px-4 font-semibold'>Próxima Dosis</th>
                                {/* NUEVA COLUMNA */}
                                <th className='py-2 px-4 font-semibold'>Aplicada</th>
                                {user && user.type === 'admin' && (
                                    <th className='py-2 px-4 font-semibold'>Acciones</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {vaccinations.map((vaccination) => {
                                const vaccinationDate = new Date(vaccination.date);
                                const isVaccinationApplied = vaccinationDate instanceof Date && !isNaN(vaccinationDate); // Comprueba si la fecha es válida

                                const date = isVaccinationApplied
                                    ? vaccinationDate.toLocaleDateString('es-ES', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                      })
                                    : 'Fecha inválida';

                                let nextDoseDate = '';
                                if (vaccination.next_dose) {
                                    const nextDate = new Date(vaccination.next_dose);
                                    nextDoseDate = nextDate instanceof Date && !isNaN(nextDate)
                                        ? nextDate.toLocaleDateString('es-ES', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : 'Fecha inválida';
                                } else {
                                    nextDoseDate = 'X';
                                }

                                return (
                                    <tr key={vaccination.id_vaccine} className='border-t border-gray-200'>
                                        <td className='py-4 px-4'>
                                            <div className='flex items-center justify-center gap-2'>
                                                <span>{vaccination.vaccine_name}</span>
                                            </div>
                                        </td>
                                        <td className='py-4 px-4'>
                                            <div className='flex items-center justify-center gap-2'>
                                                <span>{date}</span>
                                            </div>
                                        </td>
                                        <td className='py-4 px-4'>
                                            <div className='flex items-center justify-center gap-2'>
                                                <span>{nextDoseDate}</span>
                                            </div>
                                        </td>
                                        <td className='py-4 px-4'>
                                            <div className='flex items-center justify-center gap-2'>
                                                {vaccination.applicated ? (
                                                    <span className="text-green-600 font-bold">Sí</span>
                                                ) : (
                                                    <span className="text-red-500 font-bold">No</span>
                                                )}
                                            </div>
                                        </td>
                                        {user && user.type === 'admin' && (
                                            <td className='py-4 px-4'>
                                                <button
                                                    onClick={() => handleDeleteClick(vaccination.id_vaccine)}
                                                    className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300'
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {showConfirm && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-xl font-bold mb-4">
                            ¿Estás seguro de que deseas borrar esta vacuna?
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
        </div>
    );
};

export default Vaccination; 