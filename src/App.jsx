import { useState, useContext, createContext, useReducer } from 'react'
import { ThemeContext } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'



import "./CSS/Public/Homepage.css"
import "./CSS/Layout/Navbar.css"
import "./CSS/Layout/Footer.css"
import "./CSS/Admin/AdminAuth.css"

import Homepage from "./pages/Public/Homepage"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import AdminAuth from "./pages/Admin/Auth/AdminAuth"

function App() {

  const { isDarkMode } = useContext(ThemeContext);

  return (


    <div className={isDarkMode ? 'dark' : 'light'}>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/admin/auth" element={<AdminAuth />} />
        </Routes>
      <Footer/>

    </Router>

    </div >
  )
}

export default App
