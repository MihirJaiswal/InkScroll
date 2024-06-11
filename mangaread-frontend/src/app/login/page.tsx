import React from 'react'
import Login from '../components/Login'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const page = () => {
  return (
    <div>
       <Navbar/>
        <Login/>
        <Footer/>
    </div>
  )
}

export default page