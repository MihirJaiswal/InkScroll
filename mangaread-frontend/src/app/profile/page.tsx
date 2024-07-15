import React from 'react'
import ProfilePage from '../../components/ProfilePage'
import Navbar from '../../components/Navbar'
import UserMangaList from '../../components/MyManga'
import Footer from '../../components/Footer'

const page = () => {
  return (
    <div className='flex flex-col gap-6 md:gap-12'>
        <Navbar/>
        <ProfilePage/>
        <UserMangaList/>
        <Footer/>
    </div>
  )
}

export default page