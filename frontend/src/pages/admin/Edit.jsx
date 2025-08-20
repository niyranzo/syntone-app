import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/Admin/useAdmin';
import BackButton from '../../components/BackButton';

const Edit = () => {
  const { id } = useParams();
  const { getUserById, editUser } = useAdmin();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    lastname: '',
    phone: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserById(id);
      if (user) {
        setFormData({
          email: user.email || '',
          name: user.name || '',
          lastname: user.lastname || '',
          phone: user.phone || ''
        });
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await editUser(id, formData);
      if (updated) {
        navigate('/admin'); // redirige después de editar
      }
    } catch (error) {
      console.error("Error en editar el usuario", error);
    }
  };

  return (
    <div className="flex items-center justify-center m-20 mt-50 flex-col">
      <BackButton/>
      <h2 className="text-3xl font-bold text-center text-gray-900">Editar Usuario</h2>
      <hr className='bg-gradient-to-r from-pinkLigth to-aquamarine h-2 border-0 rounded-2xl w-100 mt-5'/>

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastname"
            placeholder="Apellido"
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.lastname}
            onChange={handleChange}
          />
          <input
            type="number"
            name="phone"
            placeholder="Teléfono"
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.phone}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-white ring-2 ring-purple-500 text-black hover:bg-purple-500 hover:text-white transition duration-300"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
