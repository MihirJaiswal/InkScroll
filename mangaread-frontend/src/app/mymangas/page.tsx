import React from 'react'
import UserMangaList from '../components/MyManga'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const page = () => {
  return (
    <div>
      <Navbar/>
        <UserMangaList/>
        <Footer/>
    </div>
  )
}

export default page