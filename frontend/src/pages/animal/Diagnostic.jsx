import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAnimals } from '../../hooks/Animal/useAnimal';
import { useAuth } from '../../hooks/Auth/useAuth';
import { FaDownload } from 'react-icons/fa';
import { downloadFile, extractFilename } from '../../helpers/downloadFile';
import { toast } from 'react-toastify';
import { useAdmin } from '../../hooks/Admin/useAdmin';
import BackButton from '../../components/BackButton';

const API_URL = import.meta.env.VITE_API_URL;

const Diagnostic = () => {
  const { id } = useParams();
  const { getDiagnostics } = useAnimals();
  const { user } = useAuth();
  const { deleteDiagnostic } = useAdmin();
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useState(null);

  const fetchDiagnostics = async () => {
    try {
      const data = await getDiagnostics(id);
      setDiagnostics(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los diagnósticos.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchDiagnostics();
  }, [id, getDiagnostics]);

  const handleDeleteClick = (diagnosticId) => {
    setSelectedDiagnosticId(diagnosticId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDiagnostic(selectedDiagnosticId);
      await fetchDiagnostics();
    } catch (error) {
      console.error("Error al eliminar diagnóstico:", error);
      toast.error("Error al eliminar el diagnóstico.");
    } finally {
      setShowConfirm(false);
      setSelectedDiagnosticId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedDiagnosticId(null);
  };

  return (
    <div className='mt-40 flex flex-col items-center px-4'>
      <BackButton/>
      <div className='flex flex-col items-center w-full justify-center my-16'>
        <h1 className='text-5xl font-bold mb-4 text-center'>Diagnósticos por Imagen</h1>
        <hr className='bg-gradient-to-r from-pinkLigth to-aquamarine h-2 border-0 rounded-2xl w-1/2' />
      </div>

      {loading ? (
        <p>Cargando diagnósticos...</p>
      ) : diagnostics.length === 0 ? (
        <p className='text-lg font-semibold text-gray-500 mb-10 text-center'>
          Tu mascota aún no tiene diagnósticos por imagen.
        </p>
      ) : (
        <div className='bg-white shadow-md rounded-xl p-6 w-full max-w-5xl mb-20 overflow-x-auto'>
          <table className='w-full text-center min-w-[600px]'>
            <thead>
              <tr className='border-b-2 border-purple-400'>
                <th className='py-2 px-4 font-semibold'>Fecha</th>
                <th className='py-2 px-4 font-semibold'>Documento PDF</th>
                <th className='py-2 px-4 font-semibold'>Imagen</th>
                {user?.type === 'admin' && (
                  <th className='py-2 px-4 font-semibold'>Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {diagnostics.map((diagnostic) => {
                const date = new Date(diagnostic.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });

                const pdfFilename = extractFilename(diagnostic.report_pdf);
                const imageFilename = extractFilename(diagnostic.image);

                const pdfUrl = `${API_URL}pdfs/${pdfFilename}`;
                const imageUrl = `${API_URL}images/${imageFilename}`;

                return (
                  <tr key={diagnostic._id} className='border-t border-gray-200'>
                    <td className='py-4 px-4'>{date}</td>

                    <td className='py-4 px-4'>
                      <div className='flex items-center justify-center gap-2'>
                        <span>{pdfFilename}</span>
                        <a
                          href={pdfUrl}
                          download={pdfFilename}
                          className='text-gray-700 hover:text-black cursor-pointer flex items-center'
                          onClick={(e) => {
                            e.preventDefault();
                            downloadFile(pdfUrl, pdfFilename);
                          }}
                        >
                          <FaDownload />
                        </a>
                      </div>
                    </td>

                    <td className='py-4 px-4'>
                      <div className='flex items-center justify-center gap-2'>
                        <span>{imageFilename}</span>
                        <a
                          href={imageUrl}
                          download={imageFilename}
                          className='text-gray-700 hover:text-black cursor-pointer flex items-center'
                          onClick={(e) => {
                            e.preventDefault();
                            downloadFile(imageUrl, imageFilename);
                          }}
                        >
                          <FaDownload />
                        </a>
                      </div>
                    </td>

                    {user?.type === 'admin' && (
                      <td className='py-4 px-4'>
                        <button
                          onClick={() => handleDeleteClick(diagnostic.id_diagnostic)}
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
              ¿Estás seguro de que deseas borrar este diagnóstico?
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

export default Diagnostic;
