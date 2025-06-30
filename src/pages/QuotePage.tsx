import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Calendar, MapPin, User, Briefcase, UserPlus, Baby, ArrowRight, FileText } from 'lucide-react';
import { neolianeService, type TarificationRequest, type Offre } from '../services/neolianeService';
import ProductDocuments from '../components/ProductDocuments';
import ExpertRecommendation from '../components/ExpertRecommendation';
import SEOHead from '../components/SEOHead';

const QuotePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Calculate the first day of next month as default date in YYYY-MM-DD format
  const getFirstDayOfNextMonth = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const year = nextMonth.getFullYear();
    const month = String(nextMonth.getMonth() + 1).padStart(2, '0');
    const day = String(nextMonth.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    dateEffet: getFirstDayOfNextMonth(),
    codePostal: '',
    anneeNaissance: '',
    regime: ''
  });

  const [loading, setLoading] = useState(false);
  const [offres, setOffres] = useState<Offre[]>([]);
  const [error, setError] = useState('');
  const [showProductDocuments, setShowProductDocuments] = useState(false);
  const [selectedOffreForDocs, setSelectedOffreForDocs] = useState<Offre | null>(null);
  const [showExpertMode, setShowExpertMode] = useState(false);

  // États pour les bénéficiaires
  const [conjoint, setConjoint] = useState<any>(null);
  const [enfants, setEnfants] = useState<any[]>([]);

  const regimes = [
    'Salarié',
    'Retraité salarié',
    'TNS Indépendant',
    'Retraité TNS',
    'Exploitant agricole',
    'Salarié Agricole',
    'Alsace-Moselle',
    'Sans emploi',
    'Fonctionnaire',
    'Etudiant',
    'Enseignant',
    'Expatrié'
  ];

  // Helper function to calculate age from birth year
  const calculateAge = (birthYear: number): number => {
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  // Helper function to validate age range
  const isValidAge = (age: number): boolean => {
    return age >= 18 && age <= 99;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleTarifer = async () => {
    // Validation des champs
    if (!formData.dateEffet) {
      setError('Veuillez sélectionner une date d\'effet');
      toast.error('Veuillez sélectionner une date d\'effet');
      return;
    }
    
    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.dateEffet)) {
      setError('Format de date invalide. Utilisez le format YYYY-MM-DD');
      toast.error('Format de date invalide');
      return;
    }
    
    // Validate that the date is not in the past
    const selectedDate = new Date(formData.dateEffet);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('La date d\'effet doit être dans le futur');
      toast.error('La date d\'effet doit être dans le futur');
      return;
    }
    
    if (!formData.codePostal || formData.codePostal.length !== 5) {
      setError('Veuillez saisir un code postal valide (5 chiffres)');
      toast.error('Veuillez saisir un code postal valide');
      return;
    }
    
    if (!formData.anneeNaissance || formData.anneeNaissance.length !== 4) {
      setError('Veuillez saisir une année de naissance valide (4 chiffres)');
      toast.error('Veuillez saisir une année de naissance valide');
      return;
    }

    // Validate age range for main applicant
    const birthYear = parseInt(formData.anneeNaissance);
    const age = calculateAge(birthYear);
    if (!isValidAge(age)) {
      setError(`L'âge doit être compris entre 18 et 99 ans. Âge calculé: ${age} ans`);
      toast.error(`Âge invalide: ${age} ans. L'âge doit être compris entre 18 et 99 ans.`);
      return;
    }
    
    if (!formData.regime) {
      setError('Veuillez sélectionner un régime');
      toast.error('Veuillez sélectionner un régime');
      return;
    }

    // Validate conjoint age if present
    if (conjoint && conjoint.anneeNaissance) {
      const conjointBirthYear = parseInt(conjoint.anneeNaissance);
      if (conjointBirthYear > 0) {
        const conjointAge = calculateAge(conjointBirthYear);
        if (!isValidAge(conjointAge)) {
          setError(`L'âge du conjoint doit être compris entre 18 et 99 ans. Âge calculé: ${conjointAge} ans`);
          toast.error(`Âge du conjoint invalide: ${conjointAge} ans`);
          return;
        }
      }
    }

    // Validate enfants ages if present
    for (let i = 0; i < enfants.length; i++) {
      const enfant = enfants[i];
      if (enfant.anneeNaissance) {
        const enfantBirthYear = parseInt(enfant.anneeNaissance);
        if (enfantBirthYear > 0) {
          const enfantAge = calculateAge(enfantBirthYear);
          if (enfantAge < 0 || enfantAge > 25) {
            setError(`L'âge de l'enfant ${i + 1} doit être compris entre 0 et 25 ans. Âge calculé: ${enfantAge} ans`);
            toast.error(`Âge de l'enfant ${i + 1} invalide: ${enfantAge} ans`);
            return;
          }
        }
      }
    }

    setLoading(true);
    setError('');
    setOffres([]);
    
    try {
      const request: TarificationRequest = {
        dateEffet: formData.dateEffet, // Already in YYYY-MM-DD format
        codePostal: formData.codePostal,
        anneeNaissance: parseInt(formData.anneeNaissance),
        regime: formData.regime,
        // Inclure les bénéficiaires dans la demande de tarification
        conjoint: conjoint ? {
          anneeNaissance: parseInt(conjoint.anneeNaissance || '0'),
          regime: conjoint.regime || formData.regime
        } : undefined,
        enfants: enfants.length > 0 ? enfants.map(enfant => ({
          anneeNaissance: parseInt(enfant.anneeNaissance || '0')
        })).filter(enfant => enfant.anneeNaissance > 0) : undefined
      };

      console.log('📤 Envoi de la demande de tarification:', request);

      const result = await neolianeService.getTarification(request);
      
      if (result.success && result.offres.length > 0) {
        setOffres(result.offres);
        toast.success(`${result.offres.length} offres récupérées avec succès !`);
      } else {
        setError(result.message || 'Aucune offre disponible');
        toast.warning('Aucune offre disponible pour ces critères');
      }

    } catch (err: any) {
      console.error('Erreur complète:', err);
      const errorMessage = `Erreur lors de la récupération des offres: ${err.message}`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSouscrire = (offre: Offre) => {
    // Stocker les données dans sessionStorage pour la page de souscription
    sessionStorage.setItem('selectedOffre', JSON.stringify(offre));
    sessionStorage.setItem('tarificationRequest', JSON.stringify({
      ...formData,
      conjoint,
      enfants
    }));
    
    navigate('/souscription');
  };

  const handleShowDocuments = (offre: Offre) => {
    if (!offre.gammeId) {
      toast.error('Impossible de charger les documents pour cette offre');
      return;
    }
    setSelectedOffreForDocs(offre);
    setShowProductDocuments(true);
  };

  // Fonctions pour ajouter des bénéficiaires
  const handleAjouterConjoint = () => {
    setConjoint({
      civilite: 'M',
      nom: '',
      prenom: '',
      anneeNaissance: '',
      regime: formData.regime
    });
  };

  const handleAjouterEnfant = () => {
    const nouvelEnfant = {
      id: Date.now(),
      nom: '',
      prenom: '',
      anneeNaissance: '',
      regime: formData.regime
    };
    setEnfants([...enfants, nouvelEnfant]);
  };

  const handleSupprimerConjoint = () => {
    setConjoint(null);
  };

  const handleSupprimerEnfant = (id: number) => {
    setEnfants(enfants.filter(enfant => enfant.id !== id));
  };

  // Fonctions pour gérer les changements des bénéficiaires
  const handleConjointChange = (field: string, value: string) => {
    if (conjoint) {
      setConjoint({ ...conjoint, [field]: value });
    }
  };

  const handleEnfantChange = (enfantId: number, field: string, value: string) => {
    setEnfants(enfants.map(enfant => 
      enfant.id === enfantId ? { ...enfant, [field]: value } : enfant
    ));
  };

  // Calculer le nombre total de bénéficiaires pour l'affichage
  const getTotalBeneficiaires = () => {
    let total = 1; // Adhérent principal
    if (conjoint) total += 1;
    total += enfants.length;
    return total;
  };

  return (
    <>
      <SEOHead
        title="Simulation mutuelle santé - Devis gratuit en ligne | Evolivie"
        description="Obtenez votre devis mutuelle santé personnalisé en 2 minutes. Comparez les garanties et prix pour particuliers et TNS. Simulation gratuite et sans engagement."
        keywords="simulation mutuelle, devis mutuelle santé, comparateur mutuelle, TNS, particuliers"
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Obtenez votre devis santé
            </h1>
            <p className="text-xl text-gray-600">
              Remplissez le formulaire ci-dessous pour obtenir vos offres personnalisées
            </p>
            {getTotalBeneficiaires() > 1 && (
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <User className="mr-2" size={16} />
                {getTotalBeneficiaires()} bénéficiaire{getTotalBeneficiaires() > 1 ? 's' : ''}
              </div>
            )}
          </motion.div>

          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <div className="space-y-8">
              {/* Informations du projet */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="mr-2 text-blue-600" size={20} />
                  Informations du projet
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'effet *
                    </label>
                    <input
                      type="date"
                      value={formData.dateEffet}
                      onChange={(e) => handleInputChange('dateEffet', e.target.value)}
                      min={getFirstDayOfNextMonth()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format requis: YYYY-MM-DD (ex: {getFirstDayOfNextMonth()})
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={formData.codePostal}
                        onChange={(e) => handleInputChange('codePostal', e.target.value.replace(/\D/g, '').slice(0, 5))}
                        placeholder="Ex: 75001"
                        maxLength={5}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Adhérent principal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="mr-2 text-blue-600" size={20} />
                  Adhérent principal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Année de naissance *
                    </label>
                    <input
                      type="text"
                      value={formData.anneeNaissance}
                      onChange={(e) => handleInputChange('anneeNaissance', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="Ex: 1985"
                      maxLength={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Âge requis: entre 18 et 99 ans
                      {formData.anneeNaissance && formData.anneeNaissance.length === 4 && (
                        <span className="ml-2 text-blue-600">
                          (Âge: {calculateAge(parseInt(formData.anneeNaissance))} ans)
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Régime *
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <select
                        value={formData.regime}
                        onChange={(e) => handleInputChange('regime', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                      >
                        <option value="">Sélectionnez un régime</option>
                        {regimes.map((regime) => (
                          <option key={regime} value={regime}>
                            {regime}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Conjoint */}
              {conjoint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t pt-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <UserPlus className="mr-2 text-blue-600" size={20} />
                      Conjoint
                    </h3>
                    <button
                      onClick={handleSupprimerConjoint}
                      className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select
                      value={conjoint.civilite}
                      onChange={(e) => handleConjointChange('civilite', e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="M">Monsieur</option>
                      <option value="F">Madame</option>
                    </select>
                    <input
                      type="text"
                      value={conjoint.nom}
                      onChange={(e) => handleConjointChange('nom', e.target.value)}
                      placeholder="Nom"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={conjoint.prenom}
                      onChange={(e) => handleConjointChange('prenom', e.target.value)}
                      placeholder="Prénom"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div>
                      <input
                        type="text"
                        value={conjoint.anneeNaissance}
                        onChange={(e) => handleConjointChange('anneeNaissance', e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="Année de naissance"
                        maxLength={4}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                      />
                      {conjoint.anneeNaissance && conjoint.anneeNaissance.length === 4 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Âge: {calculateAge(parseInt(conjoint.anneeNaissance))} ans
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Section Enfants */}
              {enfants.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t pt-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Baby className="mr-2 text-blue-600" size={20} />
                    Enfants
                  </h3>
                  {enfants.map((enfant, index) => (
                    <div key={enfant.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Enfant {index + 1}</h4>
                        <button
                          onClick={() => handleSupprimerEnfant(enfant.id)}
                          className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          value={enfant.nom}
                          onChange={(e) => handleEnfantChange(enfant.id, 'nom', e.target.value)}
                          placeholder="Nom"
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={enfant.prenom}
                          onChange={(e) => handleEnfantChange(enfant.id, 'prenom', e.target.value)}
                          placeholder="Prénom"
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div>
                          <input
                            type="text"
                            value={enfant.anneeNaissance}
                            onChange={(e) => handleEnfantChange(enfant.id, 'anneeNaissance', e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="Année de naissance"
                            maxLength={4}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                          />
                          {enfant.anneeNaissance && enfant.anneeNaissance.length === 4 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Âge: {calculateAge(parseInt(enfant.anneeNaissance))} ans
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Boutons d'ajout */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleAjouterConjoint}
                  disabled={!!conjoint}
                  className="flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UserPlus className="mr-2" size={20} />
                  {conjoint ? 'Conjoint ajouté' : 'Ajouter un conjoint'}
                </button>
                <button
                  onClick={handleAjouterEnfant}
                  className="flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Baby className="mr-2" size={20} />
                  Ajouter un enfant
                </button>
              </div>

              {/* Bouton de tarification */}
              <div className="flex justify-end">
                <button
                  onClick={handleTarifer}
                  disabled={loading}
                  className="flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Chargement...
                    </>
                  ) : (
                    <>
                      Obtenir mes offres
                      <ArrowRight className="ml-2" size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Message d'erreur */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8"
            >
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}

          {/* Affichage des offres */}
          {offres.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              {/* Toggle entre mode standard et mode expert */}
              <div className="flex justify-center mb-8">
                <div className="bg-white rounded-lg p-1 shadow-lg border">
                  <button
                    onClick={() => setShowExpertMode(false)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      !showExpertMode 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Vue standard
                  </button>
                  <button
                    onClick={() => setShowExpertMode(true)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      showExpertMode 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    🎯 Analyse d'expert
                  </button>
                </div>
              </div>

              {showExpertMode ? (
                <ExpertRecommendation 
                  offres={offres}
                  onOffreSelect={handleSouscrire}
                  totalBeneficiaires={getTotalBeneficiaires()}
                />
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Vos offres personnalisées
                    {getTotalBeneficiaires() > 1 && (
                      <span className="block text-sm text-gray-600 font-normal mt-1">
                        Prix calculé pour {getTotalBeneficiaires()} bénéficiaire{getTotalBeneficiaires() > 1 ? 's' : ''}
                      </span>
                    )}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offres.map((offre, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          {offre.nom}
                        </h3>
                        
                        <div className="text-3xl font-bold text-blue-600 mb-6">
                          {offre.prix}€ <span className="text-sm text-gray-500 font-normal">/ mois</span>
                        </div>

                        {offre.garanties && offre.garanties.length > 0 && (
                          <ul className="space-y-2 mb-6">
                            {offre.garanties.slice(0, 4).map((garantie, idx) => (
                              <li key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-700">{garantie.nom}</span>
                                <span className="font-medium text-gray-900">{garantie.niveau}</span>
                              </li>
                            ))}
                            {offre.garanties.length > 4 && (
                              <li className="text-sm text-gray-500 italic">
                                +{offre.garanties.length - 4} autres garanties
                              </li>
                            )}
                          </ul>
                        )}

                        <div className="space-y-3">
                          <button
                            onClick={() => handleSouscrire(offre)}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Souscrire
                          </button>
                          
                          {offre.gammeId && (
                            <button
                              onClick={() => handleShowDocuments(offre)}
                              className="w-full flex items-center justify-center border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <FileText className="mr-2" size={16} />
                              Documents
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.section>
          )}

          {/* Modal des documents produit */}
          {showProductDocuments && selectedOffreForDocs && (
            <ProductDocuments
              offre={selectedOffreForDocs}
              onClose={() => {
                setShowProductDocuments(false);
                setSelectedOffreForDocs(null);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default QuotePage;