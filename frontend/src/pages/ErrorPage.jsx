import React from 'react'
import Spinner from '../components/Spinner'

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <Spinner />
      <h1 className="text-3xl font-bold mt-6 text-red-600">¡Oops! Algo salió mal.</h1>
      <p className="mt-2 text-lg text-gray-700">
        La página que estás buscando no se pudo cargar. Por favor, verifique la url o intentalo más tarde.
      </p>
    </div>
  )
}

export default ErrorPage
