import React from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'

const Home = () => {
  return (
    <>
    <div>
      <Navbar/>
      <div className="side">
        <div className="side-bar">
            <Sidebar/>
        </div>
      </div>
    </div>
    </>
  )
}

export default Home
