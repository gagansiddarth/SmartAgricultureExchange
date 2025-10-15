import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-green-600 p-2 rounded-lg">
              <span className="text-white font-bold text-lg">🌱</span>
            </div>
            <span className="font-bold text-xl text-gray-900">{t('app.title')}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {user.role === 'farmer' && (
                  <>
                    <Link to="/crop-post" className="text-gray-700 hover:text-green-600 transition-colors">
                      {t('nav.post_crop')}
                    </Link>
                    <Link to="/my-posts" className="text-gray-700 hover:text-green-600 transition-colors">
                      {t('nav.my_posts')}
                    </Link>
                    <Link to="/crop-advice" className="text-gray-700 hover:text-green-600 transition-colors">
                      {t('nav.advice')}
                    </Link>
                  </>
                )}
                {user.role === 'buyer' && (
                  <Link to="/search" className="text-gray-700 hover:text-green-600 transition-colors">
                    {t('nav.search')}
                  </Link>
                )}
                <Link to="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors">
                  {t('nav.dashboard')}
                </Link>
                
                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleLanguage}
                    className="text-sm bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    {language === 'en' ? 'हिं' : 'EN'}
                  </button>
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">{t('nav.logout')}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleLanguage}
                  className="text-sm bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {language === 'en' ? 'हिं' : 'EN'}
                </button>
                <Link to="/login" className="text-gray-700 hover:text-green-600 transition-colors">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn-primary">
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {user ? (
                <>
                  {user.role === 'farmer' && (
                    <>
                      <Link 
                        to="/crop-post" 
                        className="text-gray-700 hover:text-green-600 transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('nav.post_crop')}
                      </Link>
                      <Link 
                        to="/my-posts" 
                        className="text-gray-700 hover:text-green-600 transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('nav.my_posts')}
                      </Link>
                      <Link 
                        to="/crop-advice" 
                        className="text-gray-700 hover:text-green-600 transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('nav.advice')}
                      </Link>
                    </>
                  )}
                  {user.role === 'buyer' && (
                    <Link 
                      to="/search" 
                      className="text-gray-700 hover:text-green-600 transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('nav.search')}
                    </Link>
                  )}
                  <Link 
                    to="/dashboard" 
                    className="text-gray-700 hover:text-green-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700">{user.name}</span>
                      </div>
                      <button
                        onClick={toggleLanguage}
                        className="text-sm bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        {language === 'en' ? 'हिं' : 'EN'}
                      </button>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors py-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">{t('nav.logout')}</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-green-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('auth.register')}
                  </Link>
                  <div className="pt-3 border-t border-gray-200">
                    <button
                      onClick={toggleLanguage}
                      className="text-sm bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      {language === 'en' ? 'हिं' : 'EN'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
