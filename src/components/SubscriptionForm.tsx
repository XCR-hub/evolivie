import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { User, CreditCard, FileText, CheckCircle, Download, Upload, X, Shield, AlertCircle } from 'lucide-react';
import { neolianeService, type StepConcernRequest, type StepBankRequest, type StepFuneralRequest, type StepCancellationRequest, type SubscriptionFlowState, type Offre } from '../services/neolianeService';
import { supabase } from '../lib/supabase';
import FileUpload from './FileUpload';

interface SubscriptionFormProps {
  selectedOffre: Offre;
  subscriptionState: SubscriptionFlowState;
  onComplete: () => void;
  onError: (error: string) => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  selectedOffre,
  subscriptionState,
  onComplete,
  onError
}) => {
  const [currentStep, setCurrentStep] = useState(subscriptionState.step);
  const [loading, setLoading] = useState(false);
  const [currentSubscriptionState, setCurrentSubscriptionState] = useState(subscriptionState);
  
  // Données du formulaire
  const [concernData, setConcernData] = useState({
    gender: 'M',
    lastname: '',
    firstname: '',
    birthdate: { day: '', month: '', year: '' },
    birthplace: '',
    birthzipcode: '',
    birthcountry: 'France',
    numss: '',
    streetnumber: '',
    street: '',
    zipcode: '',
    city: '',
    email: '',
    phone: ''
  });

  const [bankData, setBankData] = useState({
    levydate: '5',
    levyfrequency: 'Mensuel',
    iban: '',
    bic: '',
    isDifferentFromStepConcern: '0'
  });

  const [funeralData, setFuneralData] = useState({
    identitytype_id: '1',
    identitynumber: '',
    issuedate: '',
    issuecity: '',
    expirationdate: '',
    birthcountry: 'FRANCE',
    birthcity: '',
    birthzipcode: '',
    fiscalresident: '1',
    enumobsequetypeclause_id: '1'
  });

  const [cancellationData, setCancellationData] = useState({
    disable_cancellations: 0,
    enable_cancellation: 0,
    email: '',
    contract_name: '',
    contract_number: ''
  });

  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: string}>({});

  // Étape 1: Informations des adhérents (stepconcern)
  const handleStepConcern = async () => {
    if (!currentSubscriptionState.subscription_id) {
      onError('ID de souscription manquant');
      return;
    }

    // Validation des champs obligatoires
    if (!concernData.lastname || !concernData.firstname || !concernData.numss || 
        !concernData.birthdate.day || !concernData.birthdate.month || !concernData.birthdate.year ||
        !concernData.birthplace || !concernData.birthzipcode || !concernData.streetnumber ||
        !concernData.street || !concernData.zipcode || !concernData.city || 
        !concernData.email || !concernData.phone) {
      onError('Veuillez remplir tous les champs obligatoires');
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation du numéro de sécurité sociale (13 chiffres minimum)
    if (concernData.numss.length < 13) {
      onError('Le numéro de sécurité sociale doit contenir au moins 13 chiffres');
      toast.error('Le numéro de sécurité sociale doit contenir au moins 13 chiffres');
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(concernData.email)) {
      onError('Veuillez saisir une adresse email valide');
      toast.error('Veuillez saisir une adresse email valide');
      return;
    }

    setLoading(true);
    try {
      const stepConcernData: StepConcernRequest = {
        members: [
          {
            is_politically_exposed: 0,
            gender: concernData.gender,
            lastname: concernData.lastname,
            firstname: concernData.firstname,
            regime: 'Salarié', // Valeur texte selon la documentation
            birthdate: concernData.birthdate,
            birthplace: concernData.birthplace,
            birthzipcode: concernData.birthzipcode,
            birthcountry: concernData.birthcountry,
            csp: neolianeService.mapCSP('Salarié'), // Mapping automatique
            numss: concernData.numss,
            numorganisme: ''
          }
        ],
        streetnumber: concernData.streetnumber,
        street: concernData.street,
        streetbis: '',
        zipcode: concernData.zipcode,
        city: concernData.city,
        email: concernData.email,
        phone: concernData.phone
      };

      console.log('📤 Envoi des données stepconcern:', stepConcernData);

      await neolianeService.submitStepConcern(
        currentSubscriptionState.subscription_id,
        currentSubscriptionState.subscription_id,
        stepConcernData
      );

      // Sauvegarder en base Supabase
      await saveSubscriptionToDatabase();

      // Récupérer l'état mis à jour de la souscription
      const updatedState = await neolianeService.getSubscription(currentSubscriptionState.subscription_id);
      setCurrentSubscriptionState(prev => ({ ...prev, ...updatedState }));

      // Déterminer la prochaine étape
      const nextStep = getNextStep(updatedState);
      setCurrentStep(nextStep);
      
      toast.success('Informations personnelles enregistrées avec succès !');
    } catch (error: any) {
      console.error('❌ Erreur stepconcern:', error);
      const errorMessage = `Erreur lors de la soumission des informations personnelles: ${error.message}`;
      onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Étape 2: Informations bancaires (stepbank)
  const handleStepBank = async () => {
    if (!currentSubscriptionState.subscription_id) {
      onError('ID de souscription manquant');
      return;
    }

    // Validation IBAN et BIC
    if (!bankData.iban || bankData.iban.length !== 27) {
      onError('Veuillez saisir un IBAN valide (27 caractères)');
      toast.error('Veuillez saisir un IBAN valide (27 caractères)');
      return;
    }
    if (!bankData.bic || bankData.bic.length < 8 || bankData.bic.length > 11) {
      onError('Veuillez saisir un code BIC valide (8 à 11 caractères)');
      toast.error('Veuillez saisir un code BIC valide (8 à 11 caractères)');
      return;
    }

    setLoading(true);
    try {
      const stepBankData: StepBankRequest = {
        details: [
          {
            levydate: bankData.levydate,
            levyfrequency: bankData.levyfrequency,
            iban: bankData.iban,
            bic: bankData.bic,
            isDifferentFromStepConcern: bankData.isDifferentFromStepConcern
          }
        ]
      };

      console.log('📤 Envoi des données stepbank:', stepBankData);

      await neolianeService.submitStepBank(
        currentSubscriptionState.subscription_id,
        currentSubscriptionState.subscription_id,
        stepBankData
      );

      // Récupérer l'état mis à jour de la souscription
      const updatedState = await neolianeService.getSubscription(currentSubscriptionState.subscription_id);
      setCurrentSubscriptionState(prev => ({ ...prev, ...updatedState }));

      // Déterminer la prochaine étape
      const nextStep = getNextStep(updatedState);
      setCurrentStep(nextStep);

      toast.success('Informations bancaires enregistrées avec succès !');
    } catch (error: any) {
      console.error('❌ Erreur stepbank:', error);
      const errorMessage = `Erreur lors de la soumission des informations bancaires: ${error.message}`;
      onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Étape 3: Informations obsèques (stepfuneral) - uniquement pour les contrats obsèques
  const handleStepFuneral = async () => {
    if (!currentSubscriptionState.subscription_id) {
      onError('ID de souscription manquant');
      return;
    }

    setLoading(true);
    try {
      const stepFuneralData: StepFuneralRequest = {
        details: [
          {
            identity: {
              identitytype_id: funeralData.identitytype_id,
              identitynumber: funeralData.identitynumber,
              issuedate: funeralData.issuedate,
              issuecity: funeralData.issuecity,
              expirationdate: funeralData.expirationdate,
              birthcountry: funeralData.birthcountry,
              birthcity: funeralData.birthcity,
              birthzipcode: funeralData.birthzipcode,
              fiscalresident: funeralData.fiscalresident
            },
            enumobsequetypeclause_id: funeralData.enumobsequetypeclause_id
          }
        ]
      };

      console.log('📤 Envoi des données stepfuneral:', stepFuneralData);

      await neolianeService.submitStepFuneral(
        currentSubscriptionState.subscription_id,
        currentSubscriptionState.subscription_id,
        stepFuneralData
      );

      // Récupérer l'état mis à jour de la souscription
      const updatedState = await neolianeService.getSubscription(currentSubscriptionState.subscription_id);
      setCurrentSubscriptionState(prev => ({ ...prev, ...updatedState }));

      // Déterminer la prochaine étape
      const nextStep = getNextStep(updatedState);
      setCurrentStep(nextStep);

      toast.success('Informations obsèques enregistrées avec succès !');
    } catch (error: any) {
      console.error('❌ Erreur stepfuneral:', error);
      const errorMessage = `Erreur lors de la soumission des informations obsèques: ${error.message}`;
      onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Étape 4: Gestion de la résiliation (stepcancellation)
  const handleStepCancellation = async () => {
    if (!currentSubscriptionState.subscription_id) {
      onError('ID de souscription manquant');
      return;
    }

    setLoading(true);
    try {
      const stepCancellationData: StepCancellationRequest = {
        disable_cancellations: cancellationData.disable_cancellations,
        details: [
          {
            enable_cancellation: cancellationData.enable_cancellation,
            email: cancellationData.email,
            contract_name: cancellationData.contract_name,
            contract_number: cancellationData.contract_number
          }
        ]
      };

      console.log('📤 Envoi des données stepcancellation:', stepCancellationData);

      await neolianeService.submitStepCancellation(
        currentSubscriptionState.subscription_id,
        currentSubscriptionState.subscription_id,
        stepCancellationData
      );

      // Récupérer l'état mis à jour de la souscription
      const updatedState = await neolianeService.getSubscription(currentSubscriptionState.subscription_id);
      setCurrentSubscriptionState(prev => ({ ...prev, ...updatedState }));

      // Déterminer la prochaine étape
      const nextStep = getNextStep(updatedState);
      setCurrentStep(nextStep);

      toast.success('Informations de résiliation enregistrées avec succès !');
    } catch (error: any) {
      console.error('❌ Erreur stepcancellation:', error);
      const errorMessage = `Erreur lors de la soumission des informations de résiliation: ${error.message}`;
      onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Étape 5: Gestion des documents
  const handleDocuments = async () => {
    setLoading(true);
    try {
      console.log('📄 Traitement des documents...');
      
      // Récupérer les documents pré-remplis
      if (currentSubscriptionState.subscription_id) {
        const documentsBlob = await neolianeService.getPrefilledDocuments(currentSubscriptionState.subscription_id);
        console.log('✅ Documents récupérés:', documentsBlob.size, 'bytes');
      }

      // Upload des documents signés
      for (const [docType, base64Content] of Object.entries(uploadedDocuments)) {
        const documentData = {
          type: getDocumentTypeId(docType),
          content: base64Content,
          contract_ids: currentSubscriptionState.contracts?.map(c => c.id) || []
        };

        await neolianeService.uploadDocument(currentSubscriptionState.subscription_id!, documentData);
        console.log(`✅ Document ${docType} uploadé avec succès`);
      }
      
      // Validation des contrats
      if (currentSubscriptionState.contracts) {
        for (const contract of currentSubscriptionState.contracts) {
          await neolianeService.validateContract(contract.id);
          console.log(`✅ Contrat ${contract.id} validé`);
        }
      }

      // Mettre à jour le statut en base
      await updateSubscriptionStatus('active');
      
      setCurrentStep('completed');
      toast.success('Documents traités avec succès !');
    } catch (error: any) {
      console.error('❌ Erreur documents:', error);
      const errorMessage = `Erreur lors du traitement des documents: ${error.message}`;
      onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Utilitaires
  const getNextStep = (state: any): string => {
    if (state.currentstep > state.totalstep) {
      return 'documents';
    }

    // Utiliser les informations de l'état pour déterminer la prochaine étape
    if (state.steps) {
      const stepKeys = Object.keys(state.steps);
      const currentStepIndex = state.currentstep - 1;
      
      if (currentStepIndex < stepKeys.length) {
        const nextStepKey = stepKeys[currentStepIndex];
        return nextStepKey.toLowerCase();
      }
    }

    return 'documents';
  };

  const getDocumentTypeId = (docType: string): number => {
    switch (docType) {
      case 'BA': return 2;
      case 'SEPA': return 3;
      case 'MANDAT_RESILIATION': return 226;
      default: return 2;
    }
  };

  const saveSubscriptionToDatabase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          lead_id: currentSubscriptionState.lead_id,
          subscription_id: currentSubscriptionState.subscription_id,
          product_name: selectedOffre.nom,
          formula_name: selectedOffre.nom,
          monthly_price: selectedOffre.prix,
          status: 'pending',
          date_effect: new Date().toISOString().split('T')[0] // Date d'aujourd'hui par défaut
        });

      if (error) throw error;
      console.log('✅ Souscription sauvegardée en base');
    } catch (error) {
      console.error('❌ Erreur sauvegarde base:', error);
    }
  };

  const updateSubscriptionStatus = async (status: string) => {
    try {
      if (!currentSubscriptionState.subscription_id) return;

      const { error } = await supabase
        .from('subscriptions')
        .update({ status })
        .eq('subscription_id', currentSubscriptionState.subscription_id);

      if (error) throw error;
      console.log(`✅ Statut mis à jour: ${status}`);
    } catch (error) {
      console.error('❌ Erreur mise à jour statut:', error);
    }
  };

  const handleDownloadDocuments = async () => {
    try {
      if (!currentSubscriptionState.subscription_id) {
        onError('ID de souscription manquant');
        return;
      }

      const documentsBlob = await neolianeService.getPrefilledDocuments(currentSubscriptionState.subscription_id);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(documentsBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `documents-neoliane-${currentSubscriptionState.subscription_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('✅ Documents téléchargés avec succès');
      toast.success('Documents téléchargés avec succès !');
    } catch (error: any) {
      console.error('❌ Erreur téléchargement:', error);
      const errorMessage = `Erreur lors du téléchargement des documents: ${error.message}`;
      onError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleFileUpload = (documentType: string, base64Content: string) => {
    setUploadedDocuments(prev => ({
      ...prev,
      [documentType]: base64Content
    }));
    toast.success(`Document ${documentType} uploadé avec succès !`);
  };

  const handleRemoveFile = (documentType: string) => {
    setUploadedDocuments(prev => {
      const newDocs = { ...prev };
      delete newDocs[documentType];
      return newDocs;
    });
    toast.info(`Document ${documentType} supprimé`);
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'stepconcern', label: 'Informations personnelles', icon: User },
      { key: 'stepbank', label: 'Informations bancaires', icon: CreditCard },
      { key: 'stepfuneral', label: 'Informations obsèques', icon: Shield },
      { key: 'stepcancellation', label: 'Résiliation', icon: AlertCircle },
      { key: 'documents', label: 'Documents', icon: FileText },
      { key: 'completed', label: 'Terminé', icon: CheckCircle }
    ];

    return (
      <div className="flex justify-between mb-8 overflow-x-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.key === currentStep;
          const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
          
          return (
            <div key={step.key} className="flex flex-col items-center flex-1 min-w-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                isActive ? 'bg-blue-600 text-white scale-110' :
                isCompleted ? 'bg-green-600 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                <Icon size={20} />
              </div>
              <span className={`text-xs text-center transition-colors ${
                isActive ? 'text-blue-600 font-medium' : 
                isCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`hidden sm:block absolute top-6 left-1/2 w-full h-0.5 transition-colors ${
                  isCompleted ? 'bg-green-600' : 'bg-gray-200'
                }`} style={{ transform: 'translateX(50%)', zIndex: -1 }} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderStepConcern = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Informations personnelles</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Civilité *</label>
          <select
            value={concernData.gender}
            onChange={(e) => setConcernData({...concernData, gender: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="M">Monsieur</option>
            <option value="F">Madame</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
          <input
            type="text"
            value={concernData.lastname}
            onChange={(e) => setConcernData({...concernData, lastname: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Nom de famille"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
          <input
            type="text"
            value={concernData.firstname}
            onChange={(e) => setConcernData({...concernData, firstname: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Prénom"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de sécurité sociale *</label>
          <input
            type="text"
            value={concernData.numss}
            onChange={(e) => setConcernData({...concernData, numss: e.target.value.replace(/\D/g, '')})}
            placeholder="1234567890123"
            maxLength={15}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
            required
          />
          <p className="text-xs text-gray-500 mt-1">13 à 15 chiffres</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Jour de naissance *</label>
          <input
            type="text"
            value={concernData.birthdate.day}
            onChange={(e) => setConcernData({
              ...concernData, 
              birthdate: {...concernData.birthdate, day: e.target.value.replace(/\D/g, '').slice(0, 2)}
            })}
            placeholder="01"
            maxLength={2}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mois de naissance *</label>
          <input
            type="text"
            value={concernData.birthdate.month}
            onChange={(e) => setConcernData({
              ...concernData, 
              birthdate: {...concernData.birthdate, month: e.target.value.replace(/\D/g, '').slice(0, 2)}
            })}
            placeholder="01"
            maxLength={2}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Année de naissance *</label>
          <input
            type="text"
            value={concernData.birthdate.year}
            onChange={(e) => setConcernData({
              ...concernData, 
              birthdate: {...concernData.birthdate, year: e.target.value.replace(/\D/g, '').slice(0, 4)}
            })}
            placeholder="1990"
            maxLength={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de naissance *</label>
          <input
            type="text"
            value={concernData.birthplace}
            onChange={(e) => setConcernData({...concernData, birthplace: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Ville de naissance"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Code postal de naissance *</label>
          <input
            type="text"
            value={concernData.birthzipcode}
            onChange={(e) => setConcernData({...concernData, birthzipcode: e.target.value.replace(/\D/g, '').slice(0, 5)})}
            placeholder="75001"
            maxLength={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de rue *</label>
          <input
            type="text"
            value={concernData.streetnumber}
            onChange={(e) => setConcernData({...concernData, streetnumber: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="123"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la rue *</label>
          <input
            type="text"
            value={concernData.street}
            onChange={(e) => setConcernData({...concernData, street: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Rue de la Paix"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Code postal *</label>
          <input
            type="text"
            value={concernData.zipcode}
            onChange={(e) => setConcernData({...concernData, zipcode: e.target.value.replace(/\D/g, '').slice(0, 5)})}
            placeholder="75001"
            maxLength={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
          <input
            type="text"
            value={concernData.city}
            onChange={(e) => setConcernData({...concernData, city: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Paris"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={concernData.email}
            onChange={(e) => setConcernData({...concernData, email: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="exemple@email.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
          <input
            type="tel"
            value={concernData.phone}
            onChange={(e) => setConcernData({...concernData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
            placeholder="0123456789"
            maxLength={10}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleStepConcern}
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
              Traitement...
            </>
          ) : (
            'Continuer'
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderStepBank = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Informations bancaires</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date de prélèvement</label>
          <select
            value={bankData.levydate}
            onChange={(e) => setBankData({...bankData, levydate: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="5">5 du mois</option>
            <option value="10">10 du mois</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fréquence de prélèvement</label>
          <select
            value={bankData.levyfrequency}
            onChange={(e) => setBankData({...bankData, levyfrequency: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="Mensuel">Mensuel</option>
            <option value="Trimestriel">Trimestriel</option>
            <option value="Semestriel">Semestriel</option>
            <option value="Annuel">Annuel</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">IBAN *</label>
        <input
          type="text"
          value={bankData.iban}
          onChange={(e) => setBankData({...bankData, iban: e.target.value.toUpperCase().replace(/\s/g, '').slice(0, 27)})}
          placeholder="FR7610057191370188512730284"
          maxLength={27}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
          required
        />
        <p className="text-sm text-gray-500 mt-1">27 caractères alphanumériques (espaces automatiquement supprimés)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Code BIC *</label>
        <input
          type="text"
          value={bankData.bic}
          onChange={(e) => setBankData({...bankData, bic: e.target.value.toUpperCase().slice(0, 11)})}
          placeholder="CMCIFRPPXXX"
          minLength={8}
          maxLength={11}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
          required
        />
        <p className="text-sm text-gray-500 mt-1">8 à 11 caractères</p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep('stepconcern')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Retour
        </button>
        <button
          onClick={handleStepBank}
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
              Traitement...
            </>
          ) : (
            'Continuer'
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderStepFuneral = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Informations obsèques</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-blue-800 text-sm">
          Cette étape est spécifique aux contrats obsèques. Veuillez remplir les informations ci-dessous.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type de pièce d'identité</label>
          <select
            value={funeralData.identitytype_id}
            onChange={(e) => setFuneralData({...funeralData, identitytype_id: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="1">Carte d'identité</option>
            <option value="2">Passeport</option>
            <option value="3">Carte de séjour</option>
            <option value="4">Carte de résident</option>
            <option value="5">Permis de conduire</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de pièce d'identité *</label>
          <input
            type="text"
            value={funeralData.identitynumber}
            onChange={(e) => setFuneralData({...funeralData, identitynumber: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="123456789"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date de délivrance *</label>
          <input
            type="date"
            value={funeralData.issuedate}
            onChange={(e) => setFuneralData({...funeralData, issuedate: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ville de délivrance *</label>
          <input
            type="text"
            value={funeralData.issuecity}
            onChange={(e) => setFuneralData({...funeralData, issuecity: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Paris"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expiration *</label>
          <input
            type="date"
            value={funeralData.expirationdate}
            onChange={(e) => setFuneralData({...funeralData, expirationdate: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type de clause</label>
          <select
            value={funeralData.enumobsequetypeclause_id}
            onChange={(e) => setFuneralData({...funeralData, enumobsequetypeclause_id: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="1">Standard (par défaut)</option>
            <option value="2">Clause libre</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep('stepbank')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Retour
        </button>
        <button
          onClick={handleStepFuneral}
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
              Traitement...
            </>
          ) : (
            'Continuer'
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderStepCancellation = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Résiliation de votre contrat actuel</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-blue-800 text-sm">
          Si vous avez déjà un contrat de mutuelle, nous pouvons nous occuper de sa résiliation pour vous.
        </p>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="enable_cancellation"
          checked={cancellationData.enable_cancellation === 1}
          onChange={(e) => setCancellationData({
            ...cancellationData,
            enable_cancellation: e.target.checked ? 1 : 0
          })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="enable_cancellation" className="ml-2 block text-sm text-gray-900">
          Je souhaite résilier mon contrat actuel
        </label>
      </div>

      {cancellationData.enable_cancellation === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email de confirmation *</label>
            <input
              type="email"
              value={cancellationData.email}
              onChange={(e) => setCancellationData({...cancellationData, email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom du contrat actuel *</label>
            <input
              type="text"
              value={cancellationData.contract_name}
              onChange={(e) => setCancellationData({...cancellationData, contract_name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ex: Mutuelle XYZ"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de contrat actuel *</label>
            <input
              type="text"
              value={cancellationData.contract_number}
              onChange={(e) => setCancellationData({...cancellationData, contract_number: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ex: 123456789"
              required
            />
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => {
            // Déterminer l'étape précédente en fonction du flux
            const prevStep = currentSubscriptionState.steps && 
                            Object.values(currentSubscriptionState.steps).includes('Stepfuneral') 
                            ? 'stepfuneral' 
                            : 'stepbank';
            setCurrentStep(prevStep);
          }}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Retour
        </button>
        <button
          onClick={handleStepCancellation}
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
              Traitement...
            </>
          ) : (
            'Continuer'
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderDocuments = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Documents à signer</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <FileText className="text-blue-600 mr-3" size={24} />
          <h4 className="text-lg font-medium">Documents requis</h4>
        </div>
        
        <ul className="space-y-2 mb-6">
          <li className="flex items-center">
            <CheckCircle className="text-green-600 mr-2" size={16} />
            <span>Bulletin d'adhésion</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="text-green-600 mr-2" size={16} />
            <span>Mandat SEPA</span>
          </li>
          {cancellationData.enable_cancellation === 1 && (
            <li className="flex items-center">
              <CheckCircle className="text-green-600 mr-2" size={16} />
              <span>Mandat de résiliation</span>
            </li>
          )}
        </ul>
        
        <p className="text-sm text-gray-600 mb-4">
          Les documents ont été pré-remplis avec vos informations. Vous devez les télécharger, les signer et les renvoyer.
        </p>
        
        <button
          onClick={handleDownloadDocuments}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
        >
          <Download className="mr-2" size={16} />
          Télécharger les documents
        </button>
      </div>

      {/* Upload des documents signés */}
      <div className="space-y-6">
        <h4 className="text-lg font-medium text-gray-900">Upload des documents signés</h4>
        
        {['BA', 'SEPA', ...(cancellationData.enable_cancellation === 1 ? ['MANDAT_RESILIATION'] : [])].map((docType) => (
          <div key={docType} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-900">
                {docType === 'BA' ? 'Bulletin d\'adhésion' :
                 docType === 'SEPA' ? 'Mandat SEPA' :
                 'Mandat de résiliation'}
              </h5>
              {uploadedDocuments[docType] && (
                <button
                  onClick={() => handleRemoveFile(docType)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            
            {uploadedDocuments[docType] ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2" size={16} />
                <span className="text-sm">Document uploadé avec succès</span>
              </div>
            ) : (
              <FileUpload
                onFileUpload={(base64) => handleFileUpload(docType, base64)}
                acceptedTypes={['application/pdf']}
                maxSize={10 * 1024 * 1024} // 10MB
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => {
            // Déterminer l'étape précédente en fonction du flux
            const prevStep = currentSubscriptionState.steps && 
                            Object.values(currentSubscriptionState.steps).includes('Stepcancellation') 
                            ? 'stepcancellation' 
                            : currentSubscriptionState.steps && 
                              Object.values(currentSubscriptionState.steps).includes('Stepfuneral')
                              ? 'stepfuneral'
                              : 'stepbank';
            setCurrentStep(prevStep);
          }}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Retour
        </button>
        <button
          onClick={handleDocuments}
          disabled={loading || Object.keys(uploadedDocuments).length === 0}
          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
              Finalisation...
            </>
          ) : (
            'Finaliser la souscription'
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderCompleted = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="text-green-600" size={40} />
      </div>
      
      <h3 className="text-3xl font-bold text-green-600">
        Souscription terminée !
      </h3>
      
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Votre souscription a été enregistrée avec succès. Vous recevrez un email de confirmation avec tous les détails de votre contrat.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
        <h4 className="font-medium mb-4">Récapitulatif</h4>
        <div className="space-y-2 text-sm">
          <p><strong>Formule :</strong> {selectedOffre.nom}</p>
          <p><strong>Prix :</strong> {selectedOffre.prix}€ / mois</p>
          <p><strong>ID de souscription :</strong> {currentSubscriptionState.subscription_id}</p>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
      >
        Accéder à mon espace client
      </button>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {renderStepIndicator()}
        
        {currentStep === 'stepconcern' && renderStepConcern()}
        {currentStep === 'stepbank' && renderStepBank()}
        {currentStep === 'stepfuneral' && renderStepFuneral()}
        {currentStep === 'stepcancellation' && renderStepCancellation()}
        {currentStep === 'documents' && renderDocuments()}
        {currentStep === 'completed' && renderCompleted()}
      </div>
    </div>
  );
};

export default SubscriptionForm;