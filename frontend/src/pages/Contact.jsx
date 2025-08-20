import React from 'react'

const Contact = () => {
  return (
    <>
    <div className='flex items-center justify-evenly mt-20 2xl:mb-0'>
        <div className='mt-40 w-3xl flex flex-col items-center'>  
            <h1 className='text-center text-4xl md:text-5xl leading-snug'>CONTACTA CON NOSOTROS
            </h1>
            <hr className='bg-gradient-to-l from-pinkLigth to-aquamarine h-2 border-0 rounded-2xl w-80 mt-6'/>
            <div className='text-center text-xl md:text-2xl mt-5'>
              <i class="fa-solid fa-envelope"></i>
              <p className='mt-3'>qivetlacaleratfg@gmail.com</p>
            </div>
            <div className='text-center text-xl md:text-2xl my-5'>
              <i class="fa-solid fa-phone"></i>
              <p className='mt-3'>+54 662324932</p>
            </div>
            <p></p>
        </div>
        <img src="/img/dogs/dog.png" alt="dog.png" className='hidden w-xl mt-27 xl:block'/>
    </div>
    </>
    
  )
}

export default Contact