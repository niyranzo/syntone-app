import React, { useEffect, useState } from 'react';
import { useAdmin } from '../../hooks/Admin/useAdmin';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import BackButton from '../../components/BackButton';

const History = () => {
  const { id } = useParams();
  const { allConsultations, loading } = useAdmin();
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const cons = await allConsultations(id);
        setConsultations(Array.isArray(cons) ? cons : []);
      } catch (err) {
        console.error("Error fetching consultations in History component:", err);
      }
    };
    fetchConsultations();
  }, [id, allConsultations]);

  return (
    <>
      {loading ? (
        <> 
          <Spinner />
        </>
      ) : (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 mt-40">

          <div className='flex flex-col items-center mb-5'>
          <BackButton/>
              <h1 className="text-3xl md:text-4xl font-bold mb-1 text-center text-gray-800">
                  Historial Clínico del Animal
              </h1>
              <hr className='bg-gradient-to-r from-pinkLigth to-aquamarine h-2 border-0 rounded-2xl w-100 mt-5'/>

              <div className='flex justify-around mb-16 wrap-normal gap-4 lg:w-250 mt-10 flex-wrap'>
                  <Link
                      to={`/animal/${id}/diagnostic`}
                      className='border-purple-600 border-2 rounded-xl px-3 py-3 text-xl hover:bg-purple-500 hover:text-white transition duration-300'
                  >
                      Diagnóstico por Imagen
                  </Link>
                  <Link
                      to={`/animal/${id}/analysis`}
                      className='border-purple-600 border-2 rounded-xl px-3 py-3 text-xl hover:bg-purple-500 hover:text-white transition duration-300'
                  >
                      Análisis de Sangre
                  </Link>
                  <Link
                      to={`/animal/${id}/vaccination`}
                      className='border-purple-600 border-2 rounded-xl px-3 py-3 text-xl hover:bg-purple-500 hover:text-white transition duration-300'
                  >
                      Vacunaciones
                  </Link>
              </div>
          </div>


        {consultations.length === 0 ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-center text-gray-600 text-lg md:text-xl">
              No hay consultas registradas para este animal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200
                          hover:shadow-xl transition-shadow duration-300
                          flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold mb-3 text-purple-500  break-words">
                    {new Date(consultation.visitDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h2>
                  <div className="mb-3">
                    <strong className="font-semibold text-gray-700 block mb-1">Descripción:</strong>
                    <p className="text-gray-800 leading-relaxed overflow-y-auto h-[100px] custom-scrollbar break-words">
                      {consultation.description || 'No hay descripción disponible.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}
    </>
  );
};

export default History;