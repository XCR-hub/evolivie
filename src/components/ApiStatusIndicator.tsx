import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { neolianeApiService } from '../services/neolianeApiService';

const ApiStatusIndicator: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const status = await neolianeApiService.checkApiStatus();
        setIsConnected(status);
        setLastCheck(new Date());
      } catch (error) {
        setIsConnected(false);
        setLastCheck(new Date());
      }
    };

    // Vérification initiale
    checkApiStatus();

    // Vérification toutes les 30 secondes
    const interval = setInterval(checkApiStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isConnected === null) return 'text-gray-400';
    return isConnected ? 'text-green-500' : 'text-red-500';
  };

  const getStatusText = () => {
    if (isConnected === null) return 'Vérification...';
    return isConnected ? 'API Connectée' : 'API Déconnectée';
  };

  return (
    <div className="flex items-center space-x-2 p-2 rounded-lg bg-white shadow-sm border">
      <motion.div
        animate={isConnected ? {
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8]
        } : {
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: isConnected ? 2 : 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {isConnected === null ? (
          <Wifi className="text-gray-400" size={20} />
        ) : isConnected ? (
          <Heart className={getStatusColor()} size={20} fill="currentColor" />
        ) : (
          <WifiOff className={getStatusColor()} size={20} />
        )}
      </motion.div>
      
      <div className="text-sm">
        <div className={`font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>
        <div className="text-xs text-gray-500">
          {lastCheck.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default ApiStatusIndicator;