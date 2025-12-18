import { useState, useContext, createContext, useReducer } from 'react'
import { ThemeContext } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Homepage from "./pages/Public/Homepage"
import Navbar from "./Layout/Navbar"
import Footer from "./Layout/Footer"

import "./CSS/Public/Homepage.css"
import "./CSS/Layout/Navbar.css"
import "./CSS/Layout/Footer.css"

function App() {

  const { isDarkMode } = useContext(ThemeContext);

  return (


    <div className={isDarkMode ? 'dark' : 'light'}>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      <Footer/>

    </Router>

    </div >
  )
}

export default App
