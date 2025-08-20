import React, { useState } from 'react'
import { useAuth } from '../hooks/Auth/useAuth';import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Login = () => {
    const { login, user } = useAuth(); // Ya no es necesario traer setError ni error
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (user) {
            // Si el usuario ya está autenticado, redirigir a la página correspondiente
            if (user.type === "admin") {
                navigate("/admin");
            } else if (user.type === "user") {
                navigate("/user");
            }
        }}, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userLogin = await login(formData);
            if (user) {
                if(userLogin.type === "admin"){
                    navigate("/admin"); 
                }else if(userLogin.type === "user"){
                    navigate("/user"); 
                }   
            }
        } catch (error) {
            console.error("Error en el inicio de sesión", error);
        }
    };

  return (
    <div className="flex items-center justify-center m-20 mt-50 flex-col">
        <h2 className="text-3xl font-bold text-center text-gray-900 ">Iniciar Sesión</h2>
        <hr className='bg-gradient-to-r from-pinkLigth to-aquamarine h-2 border-0 rounded-2xl w-70 md:w-100 mt-5'/>

            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="email"
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            id="email"
                            name="email"
                            placeholder='example@gmail.com'
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            id="password"
                            name="password"
                            placeholder='********'
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        className="w-full py-2 rounded-lg bg-white ring-2 ring-purple-500 text-black hover:bg-purple-500 hover:text-white transition duration-300"
                        type="submit"
                    >
                        Iniciar sesión
                    </button>
                </form>
               
            </div>
        </div>
  )
}

export default Login