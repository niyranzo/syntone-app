import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="
        flex items-center
        text-purple-600 hover:text-purple-800
        font-semibold
        mb-4
        transition-colors duration-300
        focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 cursor-pointer
      "
    >
      <FiArrowLeft className="mr-2" size={20} />
      Volver atrás
    </button>
  );
};

export default BackButton;