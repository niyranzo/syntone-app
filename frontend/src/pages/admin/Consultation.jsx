import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/Auth/useAuth';
import { useAdmin } from '../../hooks/Admin/useAdmin';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import BackButton from '../../components/BackButton';

const API_URL = import.meta.env.VITE_API_URL;

const Consultation = () => {
    const { id: id_animal } = useParams();
    const { user } = useAuth();
    const { createConsultation } = useAdmin();

    const [formData, setFormData] = useState({
        description: '',
        hasNextVisit: false,
    });

    const [reservedDates, setReservedDates] = useState([]);
    const [nextVisitDateObj, setNextVisitDateObj] = useState(null);
    const [newVaccineNextDoseDateObj, setNewVaccineNextDoseDateObj] = useState(null);
    const [vaccineName, setVaccineName] = useState('');
    const [vaccines, setVaccines] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [datesRes, vaccinesRes] = await Promise.all([
                    fetch(`${API_URL}consultation/reserved-dates`),
                    fetch(`${API_URL}vaccination/animal/${id_animal}`),
                ]);
                const datesData = await datesRes.json();
                const vaccinesData = await vaccinesRes.json();

                const parsedReservedDates = datesData.reservedDates.map(date => new Date(date));
                setReservedDates(parsedReservedDates);
                setVaccines(vaccinesData);
            } catch (err) {
                console.error('Error al cargar datos:', err);
                toast.error('Error al cargar los datos iniciales.');
            }
        };
        fetchInitialData();
        // El console.log de reservedDates aquí no mostrará el valor actualizado inmediatamente
        // porque `setReservedDates` es asíncrono.
        // console.log(reservedDates);
    }, [id_animal]); // Añadido id_animal a las dependencias del useEffect.

    const handleChange = (e) => {
        const { name, type, checked, files, value } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (files && files.length > 0) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.description.trim()) {
            toast.error("La descripción es obligatoria.");
            return;
        }

        const dataToSend = {
            ...formData,
            userId: user.id_user,
            nextVisitDateTime: formData.hasNextVisit && nextVisitDateObj ? nextVisitDateObj.toISOString() : '',
        };

        const success = await createConsultation(id_animal, dataToSend);
        if (success) {
            toast.success("Consulta registrada con éxito");
            setFormData({
                description: '',
                hasNextVisit: false,
            });
            setNextVisitDateObj(null);
           
        }
    };

    const handleApplyVaccine = async (vaccineId) => {
        try {
            const res = await fetch(`${API_URL}vaccination/${vaccineId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicated: true }),
            });
            if (!res.ok) throw new Error('Error al aplicar vacuna');
            toast.success('Vacuna marcada como aplicada');
            setVaccines(prev =>
                prev.map(v => v.id_vaccine === vaccineId ? { ...v, applicated: true } : v)
            );
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleAddVaccine = async () => {
        if (!vaccineName.trim()) {
            toast.error('Nombre de vacuna requerido');
            return;
        }

        try {
            const today = new Date();
            const newVaccineData = {
                id_animal: parseInt(id_animal),
                vaccine_name: vaccineName,
                date: today.toISOString(),
                applicated: true,
                next_dose: newVaccineNextDoseDateObj ? newVaccineNextDoseDateObj.toISOString() : null,
            };

            const res = await fetch(`${API_URL}vaccination`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVaccineData),
            });
            if (!res.ok) throw new Error('Error al crear vacuna');

            const createdVaccine = await res.json();
            setVaccines(prev => [...prev, createdVaccine]);

            if (newVaccineNextDoseDateObj) {
                const followUpVaccine = {
                    id_animal: parseInt(id_animal),
                    vaccine_name: vaccineName,
                    date: newVaccineNextDoseDateObj.toISOString(),
                    applicated: false,
                    next_dose: null, // La vacuna de seguimiento no tiene una "próxima dosis" propia
                };

                const followUpRes = await fetch(`${API_URL}vaccination`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(followUpVaccine),
                });
                if (!followUpRes.ok) throw new Error('Error al crear la vacuna de seguimiento');
                const createdFollowUp = await followUpRes.json();
                setVaccines(prev => [...prev, createdFollowUp]);
            }

            setVaccineName('');
            setNewVaccineNextDoseDateObj(null);
            toast.success('Vacuna registrada con éxito.');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const isDateTimeReserved = (date) => {
        if (!date) return false;
        return reservedDates.some(reservedDate =>
            reservedDate.getFullYear() === date.getFullYear() &&
            reservedDate.getMonth() === date.getMonth() &&
            reservedDate.getDate() === date.getDate() &&
            reservedDate.getHours() === date.getHours() &&
            reservedDate.getMinutes() === date.getMinutes()
        );
    };

    // Función para filtrar las horas según los horarios de atención
    const filterTimes = (time) => {
        const selectedDate = new Date(time);
        const now = new Date();
        const dayOfWeek = selectedDate.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
        const hour = selectedDate.getHours();
        const minute = selectedDate.getMinutes();

        // 1. Excluir horas que ya han pasado si la fecha seleccionada es hoy
        if (selectedDate.getDate() === now.getDate() &&
            selectedDate.getMonth() === now.getMonth() &&
            selectedDate.getFullYear() === now.getFullYear()) {
            if (selectedDate.getTime() < now.getTime()) {
                return false;
            }
        }

        // 2. Excluir horas si ya están reservadas
        if (isDateTimeReserved(selectedDate)) {
            return false;
        }

        // 3. Excluir horas fuera de los horarios de atención
        // Horarios de Lunes a Viernes (1 a 5)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const isMorningOpen = (hour >= 10 && hour < 13); // 10:00 a 12:59
            const isAfternoonOpen = (hour >= 16 && (hour < 20 || (hour === 20 && minute <= 30))); // 16:00 a 20:30
            return isMorningOpen || isAfternoonOpen;
        }
        // Horarios de Sábados (6)
        else if (dayOfWeek === 6) {
            const isMorningOpen = (hour >= 10 && hour < 13); // 10:00 a 12:59
            const isAfternoonOpen = (hour >= 17 && hour < 19); // 17:00 a 18:59
            return isMorningOpen || isAfternoonOpen;
        }
        // Domingos (0) no se permiten horarios
        else if (dayOfWeek === 0) {
            return false;
        }

        return false; // Por si acaso cualquier otro caso no debería ser válido
    };

    // Solo permite seleccionar fechas a partir de hoy y excluye domingos
    const filterFutureDates = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Establecer a inicio del día para comparar solo la fecha
        const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

        // Permitir solo fechas futuras o el día de hoy
        const isFutureOrToday = date.getTime() >= today.getTime();

        // Excluir domingos
        const isNotSunday = dayOfWeek !== 0;

        return isFutureOrToday && isNotSunday;
    };

    return (
        <div className="mt-40 flex flex-col items-center px-4 py-10">
            <BackButton/>
            <h1 className="text-5xl font-bold mb-4 text-center">Gestión de Consultas y Vacunas</h1>
            <hr className='bg-gradient-to-r from-pinkLigth to-aquamarine h-2 border-0 rounded-2xl w-1/2 mb-12' />

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Sección de Nueva Consulta */}
                <div className="bg-white shadow-md rounded-xl p-8">
                    <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">Nueva Consulta</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="description" className="font-semibold mb-1 block text-gray-700">Descripción de la Consulta</label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                placeholder="Detalles sobre el estado del animal, observaciones, tratamientos..."
                                className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                                onChange={handleChange}
                                value={formData.description}
                            />
                        </div>

                        <div>
                            <p className="font-semibold mb-2 text-gray-700">Próxima Visita</p>
                            <div className="flex items-center gap-3 mb-3">
                                <input
                                    type="checkbox"
                                    id="hasNextVisit"
                                    name="hasNextVisit"
                                    checked={formData.hasNextVisit}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                />
                                <label htmlFor="hasNextVisit" className="text-base text-gray-600">¿Se necesita una próxima visita?</label>
                            </div>
                            {formData.hasNextVisit && (
                                <DatePicker
                                    selected={nextVisitDateObj}
                                    onChange={setNextVisitDateObj}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={30}
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    minDate={new Date()}
                                    filterDate={filterFutureDates}
                                    filterTime={filterTimes}
                                    className="border border-gray-300 px-4 py-2 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                                    placeholderText="Seleccionar fecha y hora de la próxima visita"
                                />
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 rounded-lg bg-white ring-2 ring-purple-500 text-black hover:bg-purple-500 hover:text-white transition duration-300"
                        >
                            Guardar Consulta
                        </button>
                    </form>
                </div>

                {/* Sección de Gestión de Vacunas (unificada) */}
                <div className="bg-white shadow-md rounded-xl p-8">
                    <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Gestión de Vacunas</h2>

                    {/* Sub-sección: Registrar Nueva Vacuna */}
                    <div className="mb-8 p-6 bg-green-50 rounded-lg border border-aquamarine">
                        <h4 className="text-xl font-bold mb-4 text-center text-black">Registrar Nueva Vacuna</h4>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="vaccineName" className="block text-sm font-semibold mb-1 text-gray-700">Nombre de la Vacuna</label>
                                <input
                                    type="text"
                                    id="vaccineName"
                                    placeholder="Ej: Antirrábica, Parvovirus, Moquillo..."
                                    value={vaccineName}
                                    onChange={e => setVaccineName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div>
                                <label htmlFor="newVaccineNextDoseDate" className="block text-sm font-semibold mb-1 text-gray-700">Próxima dosis (opcional)</label>
                                <DatePicker
                                    id="newVaccineNextDoseDate"
                                    selected={newVaccineNextDoseDateObj}
                                    onChange={setNewVaccineNextDoseDateObj}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={30}
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    minDate={new Date()}
                                    filterDate={filterFutureDates}
                                    filterTime={filterTimes}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    placeholderText="Elegir fecha de próxima dosis"
                                />
                            </div>

                            <button
                                onClick={handleAddVaccine}
                                className="w-full py-2 rounded-lg bg-green-600  text-white hover:bg-aquamarine hover:text-black transition duration-300"
                            >
                                Añadir Vacuna
                            </button>
                        </div>
                    </div>

                    {/* Sub-sección: Vacunas Pendientes */}
                    <div className="p-6 bg-green-50 rounded-lg border border-aquamarine">
                        <h3 className="text-xl font-bold mb-4 text-center text-black">Vacunas Pendientes</h3>
                        {vaccines.filter(v => !v.applicated).length === 0 ? (
                            <p className="text-gray-600 text-center py-4">No hay vacunas pendientes para esta mascota.</p>
                        ) : (
                            <ul className="space-y-4">
                                {vaccines.filter(v => !v.applicated).map(v => (
                                    <li key={v.id_vaccine} className="bg-white border border-gray-200 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center shadow-sm">
                                        <div className="text-gray-800 text-center sm:text-left mb-2 sm:mb-0">
                                            <strong className="block text-lg">{v.vaccine_name}</strong>
                                            <span className="text-sm text-gray-600">
                                                Programada para:{' '}
                                                {v.date ? new Date(v.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                                            </span>
                                        </div>
                                        <button
                                            className="px-4 py-2 rounded-lg bg-green-600  text-white hover:bg-aquamarine hover:text-black transition duration-300 whitespace-nowrap"

                                            onClick={() => handleApplyVaccine(v.id_vaccine)}
                                        >
                                            Marcar como aplicada
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Consultation;