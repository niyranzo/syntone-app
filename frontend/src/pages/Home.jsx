import React, { useEffect, useState, useRef } from 'react';
import { getTopArtistsFromSpain } from '../helpers/spotifyApi';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate

const Home = () => {
  const [artistImages, setArtistImages] = useState([]);
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate(); // Inicializamos useNavigate

  useEffect(() => {
    const fetchArtistImages = async () => {
      try {
        const images = await getTopArtistsFromSpain();
        setArtistImages(images);
      } catch (error) {
        console.error("Failed to fetch artist images:", error);
      }
    };

    fetchArtistImages();
  }, []);

  useEffect(() => {
    if (artistImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % artistImages.length;
        if (carouselRef.current) {
          const carouselWidth = carouselRef.current.offsetWidth;
          carouselRef.current.scrollTo({
            left: nextIndex * carouselWidth,
            behavior: 'smooth',
          });
        }
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [artistImages.length]);

  // Función para manejar el clic del botón de registro
  const handleRegisterClick = () => {
    navigate('/register'); // Redirige a la ruta /register
  };

  return (
    <div className="bg-black text-white min-h-screen px-6 py-8 font-sans relative overflow-hidden">
      {/* Círculos de fondo decorativos */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>

      {/* Contenido principal de la página */}
      <div className="relative z-10">
        {/* Sección principal: Título y subtítulo */}
        <section className="text-center mb-10 px-6 animate-fadeIn">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-white">
            Tu universo musical, a un clic.
          </h2>
          <p className="text-lg sm:text-xl text-purple-200 leading-relaxed">
            Descubre artistas y álbumes nuevos, comparte tus favoritos y conecta con una comunidad que ama la música tanto como tú.
          </p>
        </section>

        {/* Carrusel de artistas (visible solo en desktop/tablet) */}
        <section className="flex flex-col md:flex-row md:items-center mb-16">
          <div className="w-full md:w-1/2 md:order-1 hidden md:block">
            <div
              ref={carouselRef}
              className="flex overflow-x-hidden scrollbar-hide rounded-xl max-w-lg mx-auto shadow-2xl border-2 border-purple-500"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {artistImages.map((artist, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-full aspect-square relative"
                  style={{ scrollSnapAlign: 'center' }}
                >
                  <img
                    src={artist.image}
                    alt={artist.name}
                    title={artist.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Texto principal */}
          <div className="w-full md:w-1/2 md:order-2 text-center md:text-left mt-8 md:mt-0">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-white">
              Siente la música, comparte la pasión.
            </h2>
            <p className="text-lg sm:text-xl text-purple-200 leading-relaxed">
              Explora un sinfín de ritmos, encuentra tu próxima obsesión y únete a conversaciones vibrantes sobre lo que más te mueve.
            </p>
          </div>
        </section>

        {/* Sección de beneficios */}
        <section className="grid md:grid-cols-3 gap-6 text-center mb-20 px-6">
          {/* Cada tarjeta de beneficio con un efecto de hover y sombra */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:border-green-400 border border-transparent">
            <h3 className="font-bold text-lg text-green-400 mb-2">Recomienda sin límites.</h3>
            <p className="text-sm mt-2 text-gray-300">Publica tus canciones favoritas, califícalas del 1 al 5 y conviértete en un curador musical para tus amigos y seguidores.</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:border-purple-200 border border-transparent">
            <h3 className="font-bold text-lg text-purple-200 mb-2">Conecta con tu tribu.</h3>
            <p className="text-sm mt-2 text-gray-300">Sigue a otros usuarios con gustos similares, comenta en sus publicaciones y descubre nuevas perspectivas musicales juntos.</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:border-green-400 border border-transparent">
            <h3 className="font-bold text-lg text-green-400 mb-2">Descubre tu próximo hit.</h3>
            <p className="text-sm mt-2 text-gray-300">Explora música, artistas y álbumes personalizados según tus géneros preferidos y lo que la comunidad está escuchando.</p>
          </div>
        </section>

        {/* Sección de llamada a la acción */}
        <section className="text-center mb-20 px-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
            ¿Listo para sumergirte en el ritmo?
          </h3>
          <p className="text-base text-gray-400 mb-6">
            Únete a Syntone hoy y empieza a compartir, descubrir y vivir la música como nunca antes.
          </p>
          <button
            onClick={handleRegisterClick} // Añadimos el manejador de clic aquí
            className="bg-gradient-to-r from-purple-500 to-green-400 text-white font-semibold px-10 py-4 rounded-full hover:from-purple-600 hover:to-green-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            ¡Regístrate ahora!
          </button>
        </section>

        {/* Pie de página (vacío por ahora) */}
      </div>
    </div>
  );
};

export default Home;
