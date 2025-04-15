// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './screens/Dashboard';
import { Login } from './auth/Login';
import { useAuthStore } from './auth/authstore';

// Change this to default export
const App = () => {
  const { accessToken } = useAuthStore();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={accessToken ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/" 
          element={accessToken ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App; // This is the crucial line