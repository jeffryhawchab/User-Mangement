import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './auth/authstore';
import { Suspense, lazy } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

const Dashboard = lazy(() => import('./screens/Dashboard'));
const CreateUser = lazy(() => import('./pages/AddUser'));
const EditUser = lazy(() => import('./pages/EditUser'));
const Login = lazy(() => import('./auth/Login'));

const App = () => {
  const { accessToken } = useAuthStore();

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={accessToken ? <Dashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/dashboard/new" 
            element={accessToken ? <CreateUser /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/dashboard/edit/:id" 
            element={accessToken ? <EditUser /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={accessToken ? '/dashboard' : '/login'} replace />} 
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;