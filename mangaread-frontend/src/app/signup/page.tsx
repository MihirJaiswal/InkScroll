import React from 'react'
import Signup from '../../components/SignUp'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const page = () => {
  return (
    <div>
       <Navbar/>
        <Signup/>
        <Footer/>
    </div>
  )
}

export default page