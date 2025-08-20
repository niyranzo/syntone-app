import { useEffect, useState } from "react";
import { useAuth } from "../Auth/useAuth";
import { fetchAnimalsByUserId } from "../../services/getAnimalsUser";

const API_URL = import.meta.env.VITE_API_URL;

export const useAnimalsLogic = () => {
  const { user } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id_user) return;

    const getAnimalsUser = async () => {
      try {
        const data = await fetchAnimalsByUserId(user.id_user);
        setAnimals(data);
      } catch (error) {
        console.error(error.message);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getAnimalsUser();
  }, [user]);

  const getAnimal = async (id) => {
    try {
      const response = await fetch(`${API_URL}animals/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error al obtener el animal");
      }
      return await response.json();
    } catch (error) {
      console.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getDiagnostics = async (idAnimal) => {
    try {
      const response = await fetch(`${API_URL}diagnostic/animal/${idAnimal}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error al obtener los diagnósticos");
      }
      return await response.json();
    } catch (error) {
      console.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getAnalysis = async (idAnimal) => {
    try {
      const response = await fetch(`${API_URL}analysis/animal/${idAnimal}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error al obtener los análisis");
      }
      return await response.json();
    } catch (error) {
      console.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getVaccination = async (idAnimal) => {
    try {
      const response = await fetch(`${API_URL}vaccination/animal/${idAnimal}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error al obtener las vacunas");
      }
      return await response.json();
    } catch (error) {
      console.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getLastDayConsulting = async (idAnimal) => {
    try {
      const response = await fetch(`${API_URL}consultation/animal/${idAnimal}/last`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error al obtener el historial");
      }
      return await response.json();
    } catch (error) {
      console.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const setNextVisitDate = async (idAnimal, nextVisitDate) => {
    try {
      const response = await fetch(`${API_URL}consultation/${idAnimal}/set-next-visit`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nextVisitDate }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Error al programar la próxima visita");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en setNextVisitDate:", error.message);
      setError(error);
      return { error: error.message };
    }
  };

  return {
    animals,
    error,
    loading,
    getAnimal,
    getDiagnostics,
    getAnalysis,
    getVaccination,
    getLastDayConsulting,
    setNextVisitDate,
  };
};
