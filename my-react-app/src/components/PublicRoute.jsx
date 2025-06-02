import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('access_token')
  return token ? <Navigate to="/" replace /> : children
}

export default PublicRoute
