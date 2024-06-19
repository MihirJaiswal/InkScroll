import React from 'react'
import UploadManga from '../components/Upload'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import UploadChapter from '../components/AddChapter'
import Toggler from '../components/Toggler'

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