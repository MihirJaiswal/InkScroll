import React from 'react'
import MangaList from '../components/Manga'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const page = () => {
  return (
    <div>
        <Navbar/>
        <MangaList/>
        <Footer/>
    </div>
  )
}

export default page