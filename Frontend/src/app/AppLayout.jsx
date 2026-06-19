import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../features/Shared/components/Navbar'

const AppLayout = () => {
  return (
    <>
    <Navbar />
    <Outlet />

    </>
  )
}

export default AppLayout
