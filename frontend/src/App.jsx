import React from 'react'
import Home from './pages/Home'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AllBooks from './pages/AllBooks'
import Login from './pages/Login'
import SignIn from './pages/SignIn'

export default function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route path="/all-books" element={<AllBooks />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Signin" element={<SignIn />}></Route>
        </Routes>
        <Footer />
      </Router >
    </div >
  )
}
