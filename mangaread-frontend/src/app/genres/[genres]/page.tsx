import Footer from '../../../components/Footer'
import GenreMangas from '../../../components/Genre'
import Navbar from '../../../components/Navbar'
import React from 'react'

const page = () => {
  return (
    <div>
    <Navbar/>
    <GenreMangas/>
    <Footer/>
    </div>
  )
}

export default page