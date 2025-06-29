import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Heart, Phone, Activity } from 'lucide-react';
import { neolianeService } from '../services/neolianeService';
import AuthConfig from './AuthConfig';

const Header: React.FC = () => {
  const [showAuthConfig, setShowAuthConfig] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiHealthy, setApiHealthy] = useState(true);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/simulation', label: 'Simulation' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' }
  ];

  // Vérifier la santé de l'API au chargement et périodiquement
  useEffect(() => {
    const checkApiHealth = async () => {
      setIsCheckingHealth(true);
      try {
        const isHealthy = await neolianeService.testAuthentication();
        setApiHealthy(isHealthy);
      } catch (error) {
        setApiHealthy(false);
      } finally {
        setIsCheckingHealth(false);
      }
    };

    // Vérification initiale
    checkApiHealth();

    // Vérification périodique toutes les 5 minutes
    const interval = setInterval(checkApiHealth, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleHealthIndicatorClick = () => {
    setShowAuthConfig(true);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100"
      >
        {/* Barre d'info */}
        <div className="bg-gradient-to-r from-evolivie-mint to-evolivie-mint-light text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center text-sm font-medium">
              <Phone className="mr-2" size={16} />
              <span>Besoin d'aide ? Appelez-nous au 01 80 85 57 86</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-evolivie-mint to-evolivie-mint-light rounded-xl flex items-center justify-center mr-3 group-hover:scale-105 transition-transform">
                  <Heart className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-poppins text-gray-900">
                    Evolivie
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">Votre mutuelle santé</p>
                </div>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-gray-700 hover:text-evolivie-mint px-3 py-2 rounded-lg text-sm font-medium font-poppins transition-all duration-300 ${
                    location.pathname === item.path 
                      ? 'text-evolivie-mint bg-evolivie-mint bg-opacity-10' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Link
                to="/simulation"
                className="hidden sm:inline-flex btn-evolivie-primary text-sm"
              >
                Devis gratuit
              </Link>

              {/* Indicateur de santé API */}
              <motion.button
                onClick={handleHealthIndicatorClick}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                title={apiHealthy ? "API Neoliane opérationnelle" : "Problème avec l'API Neoliane"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCheckingHealth ? (
                  <Activity className="text-blue-500 animate-pulse" size={20} />
                ) : apiHealthy ? (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Heart className="text-green-500" size={20} fill="currentColor" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Heart className="text-red-500" size={20} fill="currentColor" />
                  </motion.div>
                )}
              </motion.button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-700 hover:text-evolivie-mint hover:bg-gray-50 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium font-poppins transition-colors ${
                      location.pathname === item.path
                        ? 'text-evolivie-mint bg-evolivie-mint bg-opacity-10'
                        : 'text-gray-700 hover:text-evolivie-mint hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/simulation"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block mx-4 mt-4 btn-evolivie-primary text-center"
                >
                  Devis gratuit
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Modal de configuration API */}
      {showAuthConfig && (
        <AuthConfig onClose={() => setShowAuthConfig(false)} />
      )}
    </>
  );
};

export default Header;