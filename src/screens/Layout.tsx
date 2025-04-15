import { Outlet } from 'react-router-dom'
import { useThemeStore } from '../auth/authstore'
import { useAuthStore } from '../auth/authstore'
import { useNavigate } from 'react-router-dom'

export const Layout = () => {
  const { darkMode, toggleTheme } = useThemeStore()
  const { clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <nav className="p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1>User Management</h1>
          <div className="flex gap-4">
            <button onClick={toggleTheme}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}