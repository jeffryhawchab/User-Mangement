
import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle dark mode and save preference to localStorage
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  // Check for saved user preference on component mount
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  // Apply dark mode class to document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <nav className="bg-[#3251D0] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold">User Management</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              className="px-3 py-2 rounded-md text-sm font-medium bg-white text-[#3251D0] hover:bg-gray-300 transition-colors"
              onClick={() => console.log('Create User clicked')}
            >
              Create User
            </button>
            
            <button
              className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 transition-colors"
              onClick={() => console.log('Logout clicked')}
            >
              Logout
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[#4a65d8] transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-[#4a65d8] focus:outline-none transition-colors"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <button
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-[#4a65d8] transition-colors"
            onClick={() => {
              console.log('Create User clicked');
              setIsMenuOpen(false);
            }}
          >
            Create User
          </button>
          
          <button
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-[#4a65d8] transition-colors flex items-center"
            onClick={() => {
              toggleTheme();
              setIsMenuOpen(false);
            }}
          >
            {darkMode ? (
              <>
                <SunIcon className="h-5 w-5 mr-2" />
                Light Mode
              </>
            ) : (
              <>
                <MoonIcon className="h-5 w-5 mr-2" />
                Dark Mode
              </>
            )}
          </button>
          
          <button
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-[#4a65d8] transition-colors"
            onClick={() => {
              console.log('Logout clicked');
              setIsMenuOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
