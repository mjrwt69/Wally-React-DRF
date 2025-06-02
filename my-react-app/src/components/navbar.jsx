import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa'

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    setIsAuthenticated(!!token)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setIsAuthenticated(false)
    navigate('/login')
    setShowMobileMenu(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    navigate(`/search?search=${encodeURIComponent(searchTerm)}`)
    setShowSearch(false)
  }

  return (
    <nav className="bg-white w-full shadow-md px-5 py-3">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-2xl text-black font-bold">
          WALLy
        </Link>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-md mx-4"
        >
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-r-md font-semibold"
          >
            Search
          </button>
        </form>

        {/* Icons for small screens */}
        <div className="md:hidden flex items-center gap-4">
          {/* Search icon */}
          <button onClick={() => setShowSearch(!showSearch)}>
            <FaSearch size={18} />
          </button>

          {/* Hamburger menu */}
          <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="hover:bg-green-700 text-white bg-green-600 py-2 px-4 rounded-md font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 cursor-pointer rounded-md font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Search Field */}
      {showSearch && (
        <form onSubmit={handleSearchSubmit} className="md:hidden mt-3 px-2 flex">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-r-md font-semibold"
          >
            Go
          </button>
        </form>
      )}

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden mt-4 flex flex-col gap-2 px-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setShowMobileMenu(false)}
                className="text-white bg-green-600 px-4 py-2 rounded-md font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setShowMobileMenu(false)}
                className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setShowMobileMenu(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
