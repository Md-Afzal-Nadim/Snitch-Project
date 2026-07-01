import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../features/Shared/components/Navbar'
import Footer from '../features/Shared/components/Footer'

const AppLayout = () => {
  return (
    <>
    <Navbar />
    <Outlet />
    <Footer />

    </>
  )
}

export default AppLayout
