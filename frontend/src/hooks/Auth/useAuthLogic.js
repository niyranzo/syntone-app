import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthLogic = () => {
  const [user, setUser] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${API_URL}user/me`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Error al recuperar usuario", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}auth/login`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Credenciales incorrectas. Intenta de nuevo.");
          toast.error("Credenciales incorrectas.", { style: { background: 'red', color: 'white' } });
        } else {
          setError("Problema al iniciar sesión.");
          toast.error("Problema al iniciar sesión.", { style: { background: 'red', color: 'white' } });
        }
        return;
      }

      const data = await response.json();
      setUser(data.user);
      toast.success(`Bienvenido ${data.user.name}`, { style: { background: 'purple', color: 'white' } });
      return data.user;

    } catch (error) {
      console.error("Error en login", error);
      toast.error("Error al iniciar sesión.", { style: { background: 'red', color: 'white' } });
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(`${API_URL}auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        setError("Error al cerrar sesión.");
        toast.error("Error al cerrar sesión.", { style: { background: 'red', color: 'white' } });
        return;
      }
      setUser(null);
      toast.info("Sesión cerrada.", { style: { background: 'purple', color: 'white' } });
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const res = await fetch(`${API_URL}auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ oldPassword, newPassword })
      });

      if (!res.ok) throw new Error("Error al cambiar la contraseña");

      const data = await res.json();
      setUser(prev => ({ ...prev, changePassword: false }));
      return data;

    } catch (error) {
      console.error("Error cambio de contraseña", error);
      throw error;
    }
  };

  return { user, error, loading, login, logout, changePassword, setError };
};

