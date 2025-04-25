import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ExternalLink, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-10 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-primary font-semibold text-xl"
          >
            <ExternalLink className="h-6 w-6" />
            <span>Shorty</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-gray-600 hover:text-primary transition-colors ${
                location.pathname === '/' ? 'text-primary font-medium' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/pricing" 
              className={`text-gray-600 hover:text-primary transition-colors ${
                location.pathname === '/pricing' ? 'text-primary font-medium' : ''
              }`}
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className={`text-gray-600 hover:text-primary transition-colors ${
                location.pathname === '/about' ? 'text-primary font-medium' : ''
              }`}
            >
              About
            </Link>
          </nav>

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className="btn btn-primary"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary-dark transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-4 pt-2 pb-4 space-y-4">
            <Link 
              to="/" 
              className="block py-2 text-gray-600 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/pricing" 
              className="block py-2 text-gray-600 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-gray-600 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            
            <div className="pt-4 border-t border-gray-100 space-y-3">
              {isAuthenticated ? (
                <Link 
                  to="/dashboard" 
                  className="block w-full py-2 text-center bg-primary text-white rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block w-full py-2 text-center text-primary border border-primary rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full py-2 text-center bg-primary text-white rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;