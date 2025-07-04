import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Settings } from 'lucide-react';
import { neolianeService } from '../services/neolianeService';
import { toast } from 'react-toastify';

interface ApiStatusIndicatorProps {
  onClick?: () => void;
}

const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({ onClick }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  useEffect(() => {
    const checkApiStatus = async () => {
      if (isChecking) return;
      
      setIsChecking(true);
      try {
        const status = await neolianeService.testAuthentication();
        setIsConnected(status);
        setLastCheck(new Date());
      } catch (error) {
        console.error('Erreur lors de la vérification du statut API:', error);
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    // Vérification initiale
    checkApiStatus();

    // Vérification toutes les 60 secondes
    const interval = setInterval(checkApiStatus, 60000);

    return () => clearInterval(interval);
  }, [isChecking]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Si aucun gestionnaire de clic n'est fourni, afficher un toast avec le statut
      toast.info('Mode simulation activé - Les prix affichés sont des estimations');
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors relative"
      title="Mode simulation activé - Les prix affichés sont des estimations"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isChecking ? (
        <motion.div
          animate={{ 
            rotate: 360 
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Settings className="text-blue-500" size={20} />
        </motion.div>
      ) : (
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
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            S
          </span>
        </motion.div>
      )}
    </motion.button>
  );
};

export default ApiStatusIndicator;