import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { neolianeService, type SubscriptionFlowState, type Offre, type TarificationRequest } from '../services/neolianeService';
import SubscriptionForm from '../components/SubscriptionForm';
import SubscriptionTracker from '../components/SubscriptionTracker';
import SEOHead from '../components/SEOHead';

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOffre, setSelectedOffre] = useState<Offre | null>(null);
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionFlowState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Récupérer les données depuis sessionStorage
    const offreData = sessionStorage.getItem('selectedOffre');
    const requestData = sessionStorage.getItem('tarificationRequest');

    if (!offreData || !requestData) {
      toast.error('Aucune offre sélectionnée. Redirection vers la page de devis.');
      navigate('/simulation');
      return;
    }

    const initializeSubscription = async () => {
      try {
        const offre: Offre = JSON.parse(offreData);
        const request: TarificationRequest = JSON.parse(requestData);

        setSelectedOffre(offre);

        console.log('🚀 Démarrage de la souscription pour:', offre.nom);
        
        // Démarrer le processus de souscription
        const subscriptionFlow = await neolianeService.startSubscriptionFlow(offre, request);

        console.log('📋 Paramètres de la demande:', request);
        const [yearRaw, monthRaw, dayRaw] = request.dateEffet.split('-');

        // Correction 100% conforme Neoliane
        const year = String(yearRaw);
        const month = String(monthRaw).padStart(2, '0');
        const day = String(dayRaw).padStart(2, '0');

        // Vérifie si la date est dans le futur
        const effetDate = new Date(`${year}-${month}-${day}`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (effetDate <= today) {
          throw new Error("La date d'effet doit être postérieure à aujourd'hui.");
        }

        setSubscriptionState(subscriptionFlow);
        toast.success('Processus de souscription initialisé avec succès !');
        
      } catch (err: any) {
        console.error('Erreur lors de l\'initialisation de la souscription:', err);
        const errorMessage = `Erreur lors du démarrage de la souscription: ${err.message}`;
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    initializeSubscription();
  }, [navigate]);

  const handleSubscriptionComplete = () => {
    // Nettoyer le sessionStorage
    sessionStorage.removeItem('selectedOffre');
    sessionStorage.removeItem('tarificationRequest');
    sessionStorage.removeItem('conjoint');
    sessionStorage.removeItem('enfants');
    
    toast.success('Souscription terminée avec succès !');
    navigate('/dashboard');
  };

  const handleSubscriptionError = (errorMessage: string) => {
    setError(errorMessage);
    toast.error(errorMessage);
  };

  const handleGoBack = () => {
    navigate('/simulation');
  };

  const handleStepClick = (stepId: string) => {
    // Permettre la navigation entre les étapes si nécessaire
    console.log('Navigation vers l\'étape:', stepId);
  };

  if (loading) {
    return (
      <>
        <SEOHead
          title="Souscription en cours - Evolivie"
          description="Finalisation de votre souscription mutuelle santé"
          noindex={true}
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Initialisation de votre souscription...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOHead
          title="Erreur de souscription - Evolivie"
          description="Une erreur est survenue lors de la souscription"
          noindex={true}
        />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Erreur lors de l'initialisation
              </h1>
              
              <p className="text-gray-600 mb-8">
                {error}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGoBack}
                  className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="mr-2" size={20} />
                  Retour au devis
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  if (!selectedOffre || !subscriptionState) {
    return (
      <>
        <SEOHead
          title="Données manquantes - Evolivie"
          description="Données de souscription manquantes"
          noindex={true}
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Données de souscription manquantes</p>
            <button
              onClick={handleGoBack}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour au devis
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Souscription mutuelle santé - Evolivie"
        description="Finalisez votre souscription mutuelle santé en quelques étapes simples"
        noindex={true}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleGoBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="mr-2" size={20} />
                Retour aux offres
              </button>
              
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Souscription - {selectedOffre.nom}
                </h1>
                <p className="text-sm text-gray-600">
                  {selectedOffre.prix}€ / mois
                </p>
              </div>
              
              <div className="w-24"></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tracker de progression */}
            <SubscriptionTracker
              currentStep={subscriptionState.step}
              subscriptionId={subscriptionState.subscription_id}
              onStepClick={handleStepClick}
            />

            {/* Formulaire de souscription */}
            <SubscriptionForm
              selectedOffre={selectedOffre}
              subscriptionState={subscriptionState}
              onComplete={handleSubscriptionComplete}
              onError={handleSubscriptionError}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;