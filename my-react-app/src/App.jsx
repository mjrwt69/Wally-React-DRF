import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import PrivateRoute from './components/privateRoute'
import Navbar from './components/navbar'
import Home from './pages/home'
import Register from './pages/register'
import PublicRoute from './components/PublicRoute'
import SearchResults from './pages/SearchResults'

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
