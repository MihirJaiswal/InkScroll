import Footer from '@/app/components/Footer'
import GenreMangas from '@/app/components/Genre'
import Navbar from '@/app/components/Navbar'
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