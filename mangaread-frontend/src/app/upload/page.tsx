import React from 'react'
import UploadManga from '../components/Upload'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const page = () => {
  return (
    <div>
      <Navbar/>
      <UploadManga/>
      <Footer/>
    </div>
  )
}

export default page