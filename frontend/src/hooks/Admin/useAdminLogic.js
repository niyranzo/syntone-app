import { useState } from "react";
import { toast } from "react-toastify";
import { fetchAnimalsByUserId } from "../../services/getAnimalsUser";
const API_URL = import.meta.env.VITE_API_URL;

export const useAdminLogic = () => {  
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUsers = async () => {
        try {
            const response = await fetch(`${API_URL}user/`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error("Error al obtener los usuarios");
            }
            return await response.json();
        } catch (error) {
            console.error(error.message);
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    const registerUser = async (formData) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}auth/register`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                if (response.status === 400) {
                    setError("Ya hay un usuario registrado con ese email");
                    toast.error("Ya hay un usuario registrado con ese email", {
                        style: { background: 'red', color: 'white' }
                    });
                } else {
                    setError("Hubo un problema al intentar registrarse.");
                    toast.error("Hubo un problema al intentar registrarse.", {
                        style: { background: 'red', color: 'white' }
                    });
                }
                return;
            }
            const data = await response.json();
            toast.success("Usuario Registrado", {
                style: { background: 'green', color: 'white' }
            });
            return data;
        } catch (error) {
            console.error(error.message);
            setError(error);
            toast.error("Error en el registro, intente de nuevo.", {
                style: { background: 'red', color: 'white' }
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        try{
            const response = await fetch(`${API_URL}user/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error("Error al eliminar el usuario");
            }
            toast.success("Usuario eliminado", {
                style: { background: 'green', color: 'white' }
            });
        }catch (error) {
            console.error(error.message);
            setError(error);
        }
    }

    const getUserById = async (id) => {
        try {
            const response = await fetch(`${API_URL}user/${id}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) throw new Error("Error al obtener el usuario");
            return await response.json();
        } catch (error) {
            console.error(error.message);
            setError(error);
        }
    };

    const editUser = async (id, formData) => {
        try {
            const response = await fetch(`${API_URL}user/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error("Error al editar el usuario");
            toast.success("Usuario actualizado correctamente", {
                style: { background: 'green', color: 'white' }
            });
            return await response.json();
        } catch (error) {
            console.error(error.message);
            toast.error("Error al actualizar el usuario", {
                style: { background: 'red', color: 'white' }
            });
            setError(error);
        }
    };

    const addAnimal = async (id_user, data) => {
        try {
            let imageUrl = '';

            // 1. Subir la imagen si existe
            if (data.photo) {
                const formData = new FormData();
                formData.append('photo', data.photo);
                const uploadRes = await fetch(`${API_URL}upload/image`, {
                    method: 'POST',
                    body: formData
                });

                if (!uploadRes.ok) {
                    const errorText = await uploadRes.text();
                    console.error("Error al subir imagen:", errorText);
                    throw new Error("No se pudo subir la imagen");
                }

                const uploadData = await uploadRes.json();
                imageUrl = uploadData.imageUrl; // ← debe devolver algo como 'images/xyz.jpg'
            }

            // 2. Crear el objeto de la mascota
            const animalData = {
            id_user: id_user,
            name: data.name,
            species: data.species,
            race: data.race,
            birthday: data.birthday,
            photo: imageUrl
            };
            console.log(animalData)

            // 3. Enviar el POST al backend
            const res = await fetch(`${API_URL}animals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(animalData)
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Error al registrar animal:", errorText);
                throw new Error("Fallo al registrar la mascota");
            }

            toast.success("Mascota registrada correctamente", {
            style: { background: 'green', color: 'white' }
            });

            return true;
        } catch (error) {
            console.error(error);
            toast.error("Error al registrar la mascota", {
            style: { background: 'red', color: 'white' }
            });
            return false;
        }
    };

    const getUserAnimals = async (idUser) => {
        try {
            return await fetchAnimalsByUserId(idUser);
        } catch (error) {
            console.error(error.message);
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    const createConsultation = async (idAnimal, data) => {
        try {
            let analysisPdfUrl = '';

            // 2. Subir PDF del análisis
            if (data.analysis) {
            const formDataAnalysis = new FormData();
            formDataAnalysis.append('pdf', data.analysis);
            const resAnalysis = await fetch(`${API_URL}upload/pdf`, {
                method: 'POST',
                body: formDataAnalysis
            });
            if (!resAnalysis.ok) throw new Error('Error al subir PDF del análisis');
            const analysisData = await resAnalysis.json();
            analysisPdfUrl = analysisData.imageUrl;
            }

            // 3. Crear la consulta
            const consultationRes = await fetch(`${API_URL}consultation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                userId: data.userId,
                id_animal: parseInt(idAnimal),
                description: data.description,
                nextVisitDate: data.hasNextVisit ? new Date(data.nextVisitDateTime).toISOString() : null
            })
            });

            if (!consultationRes.ok) throw new Error('Error al registrar la consulta');
            const consultation = await consultationRes.json();

            const dateNow = new Date();

            

            // 6. Registrar vacuna (si hay)
            if (data.vaccineName && data.vaccineDate) {
            await fetch(`${API_URL}vaccination`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                id_animal: parseInt(idAnimal),
                vaccine_name: data.vaccineName,
                date: data.vaccineDate,
                next_dose: data.hasNextVisit ? data.nextVisitDateTime : null
                })
            });
            }


            return true;

        } catch (error) {
            console.error(error.message);
            toast.error("Error al registrar la consulta", {
            style: { background: 'red', color: 'white' }
            });
            setError(error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const uploadDiagnosisFiles = async (id, diagnosisPdf, diagnosisImage) => {
        console.log(diagnosisPdf, diagnosisImage);
        let diagnosisPdfUrl = '';
        let diagnosisImageUrl = '';

        if (diagnosisPdf && diagnosisImage) {
            // Subir imagen
            const formDataImage = new FormData();
            formDataImage.append('photo', diagnosisImage);
            const resImg = await fetch(`${API_URL}upload/image`, {
            method: 'POST',
            body: formDataImage,
            });
            if (!resImg.ok) {
            toast.error('Error al subir imagen de diagnóstico');
            throw new Error('Error al subir imagen de diagnóstico');
            }
            const imgData = await resImg.json();
            diagnosisImageUrl = imgData.imageUrl;

            // Subir PDF
            const formDataPdf = new FormData();
            formDataPdf.append('pdf', diagnosisPdf);
            const resPdf = await fetch(`${API_URL}upload/pdf`, {
            method: 'POST',
            body: formDataPdf,
            });
            if (!resPdf.ok) {
            toast.error('Error al subir PDF de diagnóstico');
            throw new Error('Error al subir PDF de diagnóstico');
            }
            const pdfData = await resPdf.json();
            diagnosisPdfUrl = pdfData.pdfUrl;
            console.log(diagnosisPdfUrl, diagnosisImageUrl, id);
            const data = await fetch(`${API_URL}diagnostic`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                }, 
                credentials: 'include',
                body: JSON.stringify({
                id_animal: parseInt(id),
                report_pdf: diagnosisPdfUrl,
                image: diagnosisImageUrl
                })
            });
            if (!data.ok) {
                toast.error('Error al subir el diagnóstico');
                    throw new Error('Error al subir el diagnóstico');
            }
        }

        return { diagnosisPdfUrl, diagnosisImageUrl };
    };

    const uploadAnalysisFiles = async (id, analysisPdf) => {
        try {
            
            let analysisPdfUrl = '';

            const formDataAnalysis = new FormData();
            formDataAnalysis.append('pdf', analysisPdf);
            const resAnalysis = await fetch(`${API_URL}upload/pdf`, {
                method: 'POST',
                body: formDataAnalysis
            });
            if (!resAnalysis.ok) throw new Error('Error al subir PDF del análisis');
            const analysisData = await resAnalysis.json();
            analysisPdfUrl = analysisData.pdfUrl;
            
            // 5. Registrar análisis (si hay)
            const data = await fetch(`${API_URL}analysis`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                id_animal: parseInt(id),
                report_pdf: analysisPdfUrl
                })
            });
            if (!data.ok) {
                toast.error('Error al subir el análisis');
                throw new Error('Error al subir el análisis');
            }
            toast.success("Análisis subido correctamente", {
                style: { background: 'green', color: 'white' }
            });
        } catch (error) {
            toast.error("Error al subir el análisis")
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const allConsultations = async (idAnimal) => {
        try {
            const response = await fetch(`${API_URL}consultation/animal/${idAnimal}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) throw new Error("Error al obtener las consultas");
            return await response.json();
        } catch (error) {
            console.error(error.message);
            setError(error);
        } finally {
            setLoading(false);
        }
    }

        const deleteVaccination = async (id) => {
        try {
            const response = await fetch(`${API_URL}vaccination/${id}`, {
                method: 'DELETE',
                headers: {
                'Content-type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al eliminar la vacunación");
            }

            toast.success("Diagnostico eliminado correctamente", {
                style: { background: 'green', color: 'white' }
            });
            return true;
        } catch (err) {
            console.error("Error al eliminar la vacunación:", err.message);
            setError(err.message);
            toast.error(err.message || "Hubo un problema al eliminar la vacunación", {
                style: { background: 'red', color: 'white' }
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteDiagnostic = async (id) => {
        try {
            const response = await fetch(`${API_URL}diagnostic/${id}`, {
                method: 'DELETE',
                headers: {
                'Content-type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al eliminar el diagnóstico");
            }

            toast.success("Diagnostico eliminado correctamente", {
                style: { background: 'green', color: 'white' }
            });
            return true;
        } catch (err) {
            console.error("Error al eliminar el diagnostico:", err.message);
            setError(err.message);
            toast.error(err.message || "Hubo un problema al eliminar el diagnostico", {
                style: { background: 'red', color: 'white' }
            });
            return false;
        } finally {
            setLoading(false);
        }
    }

    const deleteAnalysis = async (id) => {
        try {
            const response = await fetch(`${API_URL}analysis/${id}`, {
                method: 'DELETE',
                headers: {
                'Content-type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al eliminar el Análisis");
            }

            toast.success("Análisis eliminado correctamente", {
                style: { background: 'green', color: 'white' }
            });
            return true;
        } catch (err) {
            console.error("Error al eliminar el Análisis:", err.message);
            setError(err.message);
            toast.error(err.message || "Hubo un problema al eliminar el Análisis", {
                style: { background: 'red', color: 'white' }
            });
            return false;
        } finally {
            setLoading(false);
        }
    }

    const deleteAppointment = async (id) => {
        try {
            const response = await fetch(`${API_URL}consultation/${id}/next-visit`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error('Error al eliminar la próxima visita.');
                throw new Error(errorData.message || 'Error al eliminar la próxima visita.');
            }
            const data = await response.json();
            return true;
        } catch (error) {
            console.error("Error deleting next visit date:", error);
            toast.error(error.message || "Error al eliminar la próxima visita.");
            return false; // Indicar fallo
        } finally {
            setLoading(false);
        }
    }

    const deleteAnimal = async (id) => {
        try {
            const response = await fetch(`${API_URL}animals/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el animal");
            }

            toast.success("Animal eliminado correctamente", {
                style: { background: 'green', color: 'white' }
            });
            return true;
        } catch (err) {
            toast.error(err.message || "Hubo un problema al eliminar el animal", {
                style: { background: 'red', color: 'white' }
            });
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { 
            getUsers, 
            allConsultations,
            deleteAnimal,
            uploadAnalysisFiles, 
            uploadDiagnosisFiles, 
            registerUser, 
            deleteAnalysis,
            deleteVaccination,
            deleteUser, 
            getUserById,
            createConsultation, 
            editUser, 
            deleteDiagnostic,
            addAnimal,
            getUserAnimals,
            deleteAppointment,
            error, loading }
} 