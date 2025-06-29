import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Settings, AlertCircle, CheckCircle, RefreshCw, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { neolianeService } from '../services/neolianeService';

interface AuthConfigProps {
  onClose: () => void;
}

const AuthConfig: React.FC<AuthConfigProps> = ({ onClose }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const authStatus = neolianeService.getAuthStatus();

  useEffect(() => {
    // Afficher le statut initial
    setMessage('✅ Clé API pré-configurée et prête à l\'emploi. Aucune configuration manuelle nécessaire.');
    setMessageType('success');
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setMessage('Test de la connexion en cours...');
    setMessageType('info');

    try {
      const isAuthenticated = await neolianeService.testAuthentication();
      
      if (isAuthenticated) {
        setMessage('✅ Connexion réussie ! L\'API Neoliane est accessible et fonctionnelle.');
        setMessageType('success');
        toast.success('Connexion réussie !');
      } else {
        setMessage('❌ Échec de la connexion. Vérifiez la connectivité réseau ou consultez les logs de la console (F12).');
        setMessageType('error');
        toast.error('Échec de la connexion');
      }
    } catch (error: any) {
      setMessage(`❌ Erreur lors du test: ${error.message}`);
      setMessageType('error');
      toast.error(`Erreur lors du test: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleOpenConsole = () => {
    setMessage('Ouvrez la console de votre navigateur (F12) pour voir les détails des appels API et les erreurs.');
    setMessageType('info');
    toast.info('Consultez la console (F12) pour plus de détails');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Settings className="text-blue-600 mr-3" size={24} />
            <h3 className="text-lg font-semibold">Configuration API Neoliane</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Statut actuel */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-medium mb-3 text-green-800">Statut de l'API</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={16} />
                <span className="text-green-700">
                  Clé API: Pré-configurée
                </span>
              </div>
              <div className="flex items-center">
                {authStatus.hasToken ? (
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                ) : (
                  <AlertCircle className="text-orange-500 mr-2" size={16} />
                )}
                <span className="text-green-700">
                  Token: {authStatus.hasToken ? 'Valide' : 'Non disponible'}
                </span>
              </div>
            </div>
          </div>

          {/* Message de statut */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg ${
                messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              <div className="flex items-start">
                {messageType === 'success' && <CheckCircle className="mr-2 mt-0.5 flex-shrink-0" size={16} />}
                {messageType === 'error' && <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={16} />}
                {messageType === 'info' && <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={16} />}
                <span className="text-sm">{message}</span>
              </div>
            </motion.div>
          )}

          {/* Test de connexion */}
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all font-medium"
          >
            {isTesting ? (
              <>
                <RefreshCw className="animate-spin mr-2" size={16} />
                Test en cours...
              </>
            ) : (
              'Tester la connexion'
            )}
          </button>

          {/* Bouton pour ouvrir la console */}
          <button
            onClick={handleOpenConsole}
            className="w-full bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 text-sm transition-all font-medium"
          >
            📋 Voir les logs détaillés (Console F12)
          </button>
        </div>

        {/* Informations */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-800 mb-1">Configuration automatique</h5>
          <p className="text-xs text-blue-700">
            La clé API Neoliane est maintenant intégrée directement dans l'application.
            Aucune configuration manuelle n'est nécessaire.
          </p>
        </div>

        {/* Dépannage */}
        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
          <h5 className="font-medium text-orange-800 mb-1">En cas de problème</h5>
          <p className="text-xs text-orange-700">
            • Vérifiez que le fichier proxy-neoliane.php est bien uploadé sur evolivie.com<br/>
            • Consultez la console (F12) pour les détails<br/>
            • Vérifiez votre connexion internet<br/>
            • Contactez le support technique si nécessaire
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthConfig;