import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/Admin/useAdmin';
import { useParams } from 'react-router-dom';
import { FaFilePdf } from 'react-icons/fa';
import { useAnimals } from '../../hooks/Animal/useAnimal';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner'; // Asegúrate de importar correctamente

const AnalysisUpload = () => {
  const { id: id_animal } = useParams();
  const { uploadAnalysisFiles, loading: loadingAdmin } = useAdmin();
  const { getAnimal, loading: loadingAnimal } = useAnimals();
  const [pet, setPet] = useState({});
  const [formData, setFormData] = useState({ analysisPdf: null });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    setIsSubmitDisabled(!formData.analysisPdf);

    const fetchPet = async () => {
      try {
        const animal = await getAnimal(id_animal);
        setPet(animal);
      } catch (error) {
        console.error("Error al cargar la mascota:", error);
      }
    };
    fetchPet();
  }, [formData.analysisPdf, getAnimal, id_animal]);

  const handleChange = (e) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setFormData(prev => ({ ...prev, [name]: file }));
      } else {
        alert('Por favor selecciona un archivo PDF válido.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await uploadAnalysisFiles(id_animal, formData.analysisPdf);
  };

  if (loadingAdmin || loadingAnimal) {
    return <Spinner />;
  }

  return (
    <div className="mt-40 bg-white rounded-lg shadow-md p-6 space-y-6 max-w-xl mx-auto">
      <BackButton />
      <p className="font-semibold border-b-2 border-purple-400 pb-3 text-3xl text-gray-800 flex items-center">
        Añadir Análisis -
        <span className="text-gray-500 ml-2">{pet.name}</span>
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <label htmlFor="analysisPdf" className="text-purple-600 font-semibold flex items-center gap-2 text-lg">
          PDF <FaFilePdf className="text-xl" />
        </label>
        <div className="flex-1 flex items-center border border-gray-300 rounded-lg overflow-hidden w-full transition hover:border-purple-500">
          <label
            htmlFor="analysisPdf"
            className="cursor-pointer bg-purple-500 text-white text-sm px-4 py-2 hover:bg-purple-600"
          >
            Seleccionar archivo
          </label>
          <input
            id="analysisPdf"
            type="file"
            name="analysisPdf"
            accept=".pdf"
            onChange={handleChange}
            className="hidden"
          />
          <span className="ml-3 text-gray-700 text-sm truncate px-2 py-1 bg-gray-50 flex-1">
            {formData.analysisPdf ? formData.analysisPdf.name : "Ningún archivo seleccionado"}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        className={`w-full px-6 py-2 rounded-lg border-2 font-semibold text-lg transition
          ${isSubmitDisabled
            ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'border-purple-500 text-purple-700 hover:bg-purple-500 hover:text-white'
          }`}
      >
        Subir Diagnóstico
      </button>
    </div>
  );  
};

export default AnalysisUpload;
