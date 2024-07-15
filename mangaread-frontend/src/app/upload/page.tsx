import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Toggler from '../../components/Toggler'

const page = () => {
  return (
    <div>
      <Navbar/>
      <div className='h-full'>
      <Toggler/>
      </div>
      <Footer/>
    </div>
  )
}

export default page