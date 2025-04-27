import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../auth/authstore';

const NotFound = () => {
  const navigate = useNavigate();
  const { darkMode } = useThemeStore();

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-xl mb-8">The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate('/')}
        className={`px-6 py-3 rounded-lg text-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;