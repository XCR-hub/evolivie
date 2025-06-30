import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Heart, Phone, User, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ApiStatusIndicator from './ApiStatusIndicator';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/simulation', label: 'Simulation' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' }
  ];

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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
              {/* Indicateur API */}
              <ApiStatusIndicator />

              {/* Utilisateur connecté ou bouton de connexion */}
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 text-gray-700 hover:text-evolivie-mint transition-colors"
                  >
                    <User size={20} />
                    <span className="hidden sm:inline">Mon espace</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={20} />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-2 text-gray-700 hover:text-evolivie-mint transition-colors"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">Connexion</span>
                </Link>
              )}

              <Link
                to="/simulation"
                className="hidden sm:inline-flex btn-evolivie-primary text-sm"
              >
                Devis gratuit
              </Link>

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
    </>
  );
};

export default Header;