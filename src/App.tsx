import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import { Searchbar } from './components/SearchBar';
import { Cardcontainer } from './components/cardContaier';
import Login from './auth/Login';
import ProtectedRoute from './components/ProtectedRoute';

function DashboardLayout() {
  return (
    <div>
      <Navbar />
      <Searchbar />
      <Cardcontainer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
