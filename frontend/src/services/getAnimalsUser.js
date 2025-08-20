const API_URL = import.meta.env.VITE_API_URL;

export const fetchAnimalsByUserId = async (id_user) => {
    const response = await fetch(`${API_URL}animals/user/${id_user}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error("Error al obtener los animales del usuario");
    }

    return await response.json();
};