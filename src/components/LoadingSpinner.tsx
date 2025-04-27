import { useThemeStore } from '../auth/authstore';

export const LoadingSpinner = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  const { darkMode } = useThemeStore();
  
  return (
    <div className={`flex justify-center items-center ${fullScreen ? 'h-screen' : 'h-full'} ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-blue-500' : 'border-blue-600'}`}></div>
    </div>
  );
};

export default LoadingSpinner;