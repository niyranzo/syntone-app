//spinner de perrito
import React from 'react'
import loadingGif from '../assets/pets-loader.gif'; // Ajusta la ruta según tu estructura

const Spinner = () => {
  return (
    <div className='mt-60 w-full h-full'>
      <div className='flex flex-col justify-center items-center h-full'>
        <img src={loadingGif} alt="loading..." className='w-30 ' />
        <p>Cargando...</p>
      </div>
    </div>
  )
}

export default Spinner