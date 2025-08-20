import { RouterProvider } from 'react-router-dom'
import './App.css'
import RootLayout from './layouts/RootLayout'
import { router } from './router'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './contexts/Auth/AuthProvider'
import { AnimalsProvider } from './contexts/Animal/AnimalProvider'
import { AdminProvider } from './contexts/Admin/AdminProvider'

function App() {
  
  return (
    <>
    <AuthProvider>
      <AnimalsProvider>
        <AdminProvider>
          <RouterProvider router={router}/>
        </AdminProvider>
      </AnimalsProvider>
    </AuthProvider>
    <ToastContainer  position="top-center" />
    </>
  )
}

export default App
