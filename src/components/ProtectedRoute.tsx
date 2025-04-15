import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../auth/authstore'
import { JSX } from 'react'

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { accessToken } = useAuthStore()
  return accessToken ? children : <Navigate to="/login" replace />
}