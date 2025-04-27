import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../auth/authstore';
import { useThemeStore } from '../auth/authstore';
import Navbar from '../components/Navbar';
import ConfirmationModal from '../components/ConfirmationModal';

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
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Fetch users with React Query
  const { data: users = [], isLoading, error } = useQuery<User[], Error>({
    queryKey: ['users', searchTerm],
    queryFn: async () => {
      if (!accessToken) {
        navigate('/login');
        return [];
      }

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
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch users');
      }

      const json = await response.json();
      const apiUsers = json?.result?.data?.users ?? json?.data?.users ?? [];

      if (!Array.isArray(apiUsers)) {
        throw new Error('Unexpected API response format');
      }

      return apiUsers.map((user: any): User => ({
        id: user.id ?? user._id ?? '',
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.name || 'Unknown',
        email: user.email || 'No email',
        status: (user.status === 'active' ? 'active' : 'locked') as 'active' | 'locked',
        date: user.dateOfBirth || user.date || new Date().toISOString(),
      }));
    },
    // Handle errors directly in the query function or globally
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    }
  });

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete);
      setUserToDelete(null);
    }
  };

  const handleEditClick = (userId: string) => {
    navigate(`/dashboard/edit/${userId}`);
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
          <p className={`mt-2 text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            {error.message}
          </p>
        )}
      </div>

      {isLoading ? (
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
              className={`shadow-md rounded-lg p-4 space-y-3 transition-all hover:shadow-lg ${
                darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-center relative">
                <div 
                  className={`absolute -top-1 -right-1 rounded-full h-4 w-4 ${
                    user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <div className="bg-[#3251D0] rounded-full flex items-center justify-center text-lg h-16 w-16 font-bold text-white">
                  {user.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                </div>
              </div>
              <h2 className={`font-bold text-lg text-center truncate ${darkMode ? 'text-white' : 'text-black'}`}>
                {user.name}
              </h2>
              <div className="space-y-1">
                <p className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Email: {user.email}
                </p>
                <div className="flex items-center">
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Status:
                  </p>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  } text-white`}>
                    {user.status}
                  </span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Date: {new Date(user.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  onClick={() => handleEditClick(user.id)}
                  className="bg-[#3251D0] hover:bg-[#3c5cff] text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(user.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  disabled={deleteUserMutation.isPending}
                >
                  {deleteUserMutation.isPending && userToDelete === user.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Dashboard;