import React from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom';



const RootLayout = () => {
  return (
    <div className="root-layout-container">
      <NavBar />
        <main className="md:w-[70%] mx-auto mt-40" class="main-content">
          <Outlet />
        </main>
      <Footer/>
    </div>
  )
}

export default RootLayout
