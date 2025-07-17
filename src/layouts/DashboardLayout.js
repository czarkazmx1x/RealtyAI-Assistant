import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Users, 
  ImageIcon, 
  MessageSquare, 
  Calendar, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Plus, 
  ChevronDown,
  LogOut
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Nav links configuration
  const navLinks = [
    { to: '/', label: 'Dashboard', icon: <Home size={18} className="mr-3" /> },
    { to: '/listings', label: 'Listings', icon: <Home size={18} className="mr-3" /> },
    { to: '/staging', label: 'Virtual Staging', icon: <ImageIcon size={18} className="mr-3" /> },
    { to: '/social', label: 'Social Content', icon: <MessageSquare size={18} className="mr-3" /> },
    { to: '/leads', label: 'CRM & Campaigns', icon: <Users size={18} className="mr-3" /> },
    { to: '/tasks', label: 'Calendar & Tasks', icon: <Calendar size={18} className="mr-3" /> },
  ];

  return (
    <div className={`flex h-screen w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Left Sidebar */}
      <div className={`w-64 h-full flex-shrink-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold flex items-center">
            <span className="bg-blue-500 text-white rounded p-1 mr-2">
              <Home size={18} />
            </span>
            RealtyAI Assistant
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.name || 'Matt Baker'}</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => 
                    `flex items-center w-full p-2 rounded-lg ${
                      isActive 
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className={`h-16 flex items-center justify-between px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center space-x-4">
            <div className={`relative rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <input 
                type="text" 
                placeholder="Search listings, contacts..." 
                className="px-10 py-2 rounded-md bg-transparent focus:outline-none w-64"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} flex items-center`}>
                <Plus size={18} className="mr-1" />
                <span className="text-sm font-medium">Quick Add</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              {/* Quick Add Dropdown would appear here */}
            </div>
            
            <button className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} relative`}>
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </button>
            
            <button 
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={toggleTheme}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="flex items-center">
              <div 
                className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold cursor-pointer"
                onClick={handleLogout}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'MB'}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Dashboard Area */}
        <main className={`flex-1 overflow-auto p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;