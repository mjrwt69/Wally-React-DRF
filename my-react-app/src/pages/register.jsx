import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!username || !password || !password2) {
      setError('All fields are required')
      return
    }
    if (password !== password2) {
      setError('Passwords do not match')
      return
    }

    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        username,
        password,
        password2,
      })
      setSuccess('Registration successful! Redirecting to login...')
      setUsername('')
      setPassword('')
      setPassword2('')

      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(
        err.response?.data?.error || 'Registration failed. Try again.'
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 cursor-pointer font-mono rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
