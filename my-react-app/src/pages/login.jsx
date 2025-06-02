import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('') // ✅ New state
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      })
      const { access, refresh } = response.data
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      setError('')
      setSuccess('Login successful! Redirecting...') // ✅ Set success message

      // Optional delay to show success message
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (err) {
      setError('Invalid username or password')
      setSuccess('') // Clear success on error
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <button type="submit" className="w-full bg-blue-600 text-lg font-bold font-mono cursor-pointer hover:bg-blue-800 text-white py-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
