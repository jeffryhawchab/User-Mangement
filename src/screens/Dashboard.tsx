import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/authstore';
import { useThemeStore } from '../auth/authstore';
import Navbar from '../components/Navbar';

type User = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'locked';
  date: string;
};

export const Dashboard = () => {
  const { accessToken, clearAuth } = useAuthStore();
  const { darkMode } = useThemeStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accessToken) navigate('/login');
  }, [accessToken, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');

        const url = searchTerm
          ? `/api/users?search=${encodeURIComponent(searchTerm)}`
          : '/api/users';

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            clearAuth();
            navigate('/login');
            return;
          }
          throw new Error(response.statusText);
        }

        const json = await response.json();
        console.log('Raw API Response:', json);

        const apiUsers = json?.result?.data?.users ?? [];

        if (!Array.isArray(apiUsers)) {
          throw new Error('Unexpected API response format');
        }

        const formattedUsers: User[] = apiUsers.map((user: any): User => ({
          id: user.id ?? user._id ?? '',
          name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.name || 'Unknown',
          email: user.email || 'No email',
          status: (user.status === 'active' ? 'active' : 'locked') as 'active' | 'locked',
          date: user.dateOfBirth || user.date || new Date().toISOString(),
        }));

        setUsers(formattedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) fetchUsers();
  }, [accessToken, searchTerm, navigate, clearAuth]);

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error('Failed to delete user');
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete user. Try again.');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <Navbar />
      <div className="m-4">
        <input
          type="search"
          placeholder="Search users..."
          className={`border px-4 py-2 rounded w-full max-w-md ${
            darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-400 bg-white text-black'
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {error && (
          <p className={`mt-2 text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : users.length === 0 ? (
        <div className={`text-center p-8 ${darkMode ? 'text-white' : 'text-black'}`}>
          {searchTerm ? 'No matching users found.' : 'No users available.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={`shadow-md rounded-lg p-4 space-y-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex justify-center">
                <div className={`${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'} rounded-full h-4 w-4 absolute mt-1 mr-12`}></div>
                <div className="bg-[#3251D0] rounded-full flex items-center justify-center text-lg h-16 w-16 font-bold text-white">
                  {user.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                </div>
              </div>
              <h2 className={`font-bold text-lg text-center ${darkMode ? 'text-white' : 'text-black'}`}>{user.name}</h2>
              <div className="space-y-1">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Email: {user.email}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Status:
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {user.status}
                  </span>
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Date: {new Date(user.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <button className="bg-[#3251D0] hover:bg-[#3c5cff] text-white px-3 py-1 rounded text-sm">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
