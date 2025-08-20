import React, { useState } from 'react'
import { useAdmin } from '../../hooks/Admin/useAdmin';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import BackButton from '../../components/BackButton';

const Register = () => {

    const { registerUser, loading } = useAdmin();
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const register = await registerUser(formData);
            if(register){
               navigate("/admin")
            }
        } catch (error) {
            console.error("Error en registrar el usuario", error);
        } 
    };
  return (
    <>
    { loading ? (
        <Spinner />
    ) : (
    <div className="flex items-center justify-center m-20 mt-50 flex-col">
        <BackButton/>
        <h2 className="text-3xl font-bold text-center text-gray-900 ">Registrar Usuario</h2>
        <hr className='bg-gradient-to-r from-pinkLigth to-aquamarine h-2 border-0 rounded-2xl w-100 mt-5'/>

            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="email"
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            id="email"
                            name="email"
                            placeholder='Correo Electrónico'
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            id="name"
                            name="name"
                            placeholder='Nombre Completo'
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            id="lastname"
                            name="lastname"
                            placeholder='Apellido'
                            required
                            value={formData.lastname}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            id="phone"
                            name="phone"
                            placeholder='Teléfono'
                            required
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        className="w-full py-2 rounded-lg bg-white ring-2 ring-purple-500 text-black hover:bg-purple-500 hover:text-white transition duration-300"
                        type="submit"
                    >
                        Registrar
                    </button>
                </form>
            </div>
        </div>
    )}
    </>
  )
}

export default Register