import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import FavoriteMangas from '../../components/FavoriteMangas'

const page = () => {
  return (
    <div>
      <Navbar/>
      <FavoriteMangas/>
      <Footer/>
    </div>
  )
}

export default page