import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Award, TrendingUp, Shield, Eye, Zap, Users } from 'lucide-react';
import { Offre } from '../services/neolianeService';

interface ExpertRecommendationProps {
  offres: Offre[];
  onOffreSelect: (offre: Offre) => void;
  totalBeneficiaires: number;
}

interface UserPreferences {
  budget: number;
  priorities: {
    hospitalisation: number;
    specialistes: number;
    optique: number;
    dentaire: number;
    medecinesDouces: number;
  };
  protectionLevel: 1 | 2 | 3 | 4 | 5;
}

const ExpertRecommendation: React.FC<ExpertRecommendationProps> = ({
  offres,
  onOffreSelect,
  totalBeneficiaires
}) => {
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: 100,
    priorities: {
      hospitalisation: 5,
      specialistes: 4,
      optique: 3,
      dentaire: 3,
      medecinesDouces: 2
    },
    protectionLevel: 3
  });

  const [showRecommendations, setShowRecommendations] = useState(false);

  // Calcul du score d'une offre selon les préférences
  const calculateOffreScore = (offre: Offre): number => {
    let score = 0;
    
    // Score basé sur le budget (plus c'est proche du budget, mieux c'est)
    const budgetScore = Math.max(0, 100 - Math.abs(offre.prix - preferences.budget));
    score += budgetScore * 0.3;
    
    // Score basé sur le niveau de protection
    const protectionMultipliers = {
      'Essentielle': 1,
      'Confort': 2,
      'Premium': 3,
      'Sérénité': 4,
      'Excellence': 5,
      'Prestige': 5
    };
    
    const offreLevel = Object.keys(protectionMultipliers).find(key => 
      offre.nom.includes(key)
    ) as keyof typeof protectionMultipliers;
    
    if (offreLevel) {
      const levelScore = Math.max(0, 100 - Math.abs(protectionMultipliers[offreLevel] - preferences.protectionLevel) * 20);
      score += levelScore * 0.4;
    }
    
    // Score basé sur les garanties disponibles
    const garantieScore = offre.garanties ? offre.garanties.length * 10 : 0;
    score += garantieScore * 0.3;
    
    return Math.min(100, score);
  };

  // Obtenir les recommandations triées
  const getRecommendations = () => {
    const offresWithScores = offres.map(offre => ({
      ...offre,
      score: calculateOffreScore(offre),
      isRecommended: calculateOffreScore(offre) >= 70
    }));

    // Séparer en deux catégories
    const recommended = offresWithScores
      .filter(offre => offre.prix <= preferences.budget * 1.2)
      .sort((a, b) => b.score - a.score);
    
    const others = offresWithScores
      .filter(offre => offre.prix > preferences.budget * 1.2)
      .sort((a, b) => a.prix - b.prix);

    return { recommended, others };
  };

  const getProtectionLevel = (offre: Offre): number => {
    if (offre.nom.includes('Essentielle')) return 1;
    if (offre.nom.includes('Confort')) return 2;
    if (offre.nom.includes('Premium')) return 3;
    if (offre.nom.includes('Sérénité')) return 4;
    if (offre.nom.includes('Excellence') || offre.nom.includes('Prestige')) return 5;
    return 3;
  };

  const renderHearts = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Heart
        key={i}
        size={16}
        className={i < level ? 'text-red-500 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const getOffreAdvantages = (offre: Offre): string[] => {
    const advantages = [];
    
    if (offre.nom.includes('Essentielle')) {
      advantages.push('Prix attractif', 'Couverture de base solide');
    } else if (offre.nom.includes('Confort')) {
      advantages.push('Excellent rapport qualité-prix', 'Optique incluse');
    } else if (offre.nom.includes('Premium')) {
      advantages.push('Couverture étendue', 'Dentaire renforcé');
    } else if (offre.nom.includes('Sérénité')) {
      advantages.push('Très haut niveau', 'Médecines douces');
    } else if (offre.nom.includes('Excellence')) {
      advantages.push('Couverture maximale', 'Chambre particulière illimitée');
    } else if (offre.nom.includes('Prestige')) {
      advantages.push('Formule premium', 'Assistance internationale');
    }
    
    return advantages;
  };

  if (!showPreferences) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center mb-8"
      >
        <Award className="mx-auto mb-4" size={48} />
        <h2 className="text-2xl font-bold font-poppins mb-4">
          🎯 Analyse d'expert personnalisée
        </h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          En tant qu'expert en assurance santé, je vais analyser toutes les offres disponibles 
          selon vos critères pour vous proposer les solutions les plus adaptées.
        </p>
        <button
          onClick={() => setShowPreferences(true)}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Obtenir mes recommandations d'expert
        </button>
      </motion.div>
    );
  }

  if (!showRecommendations) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 mb-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-poppins text-gray-900 mb-4">
            📋 Questionnaire d'expert
          </h2>
          <p className="text-gray-600">
            Pour une recommandation personnalisée, merci de préciser vos besoins :
          </p>
        </div>

        <div className="space-y-8">
          {/* Budget */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              1. Votre budget mensuel maximum
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="30"
                max="200"
                value={preferences.budget}
                onChange={(e) => setPreferences({
                  ...preferences,
                  budget: parseInt(e.target.value)
                })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xl font-bold text-blue-600 min-w-[80px]">
                {preferences.budget}€
              </span>
            </div>
          </div>

          {/* Priorités */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              2. Vos besoins prioritaires (classez de 1 à 5 par ordre d'importance)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(preferences.priorities).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                  <span className="font-medium capitalize">
                    {key === 'medecinesDouces' ? 'Médecines douces' : 
                     key === 'specialistes' ? 'Spécialistes' : key}
                  </span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setPreferences({
                          ...preferences,
                          priorities: { ...preferences.priorities, [key]: level }
                        })}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${
                          level <= value 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'border-gray-300 text-gray-400 hover:border-blue-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Niveau de protection */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              3. Votre niveau de protection souhaité
            </label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { level: 1, name: 'Eco', desc: 'Couverture minimale' },
                { level: 2, name: 'Essentielle', desc: 'Couverture basique' },
                { level: 3, name: 'Confort', desc: 'Couverture intermédiaire' },
                { level: 4, name: 'Confort+', desc: 'Très bonne couverture' },
                { level: 5, name: 'Premium', desc: 'Remboursements maximums' }
              ].map((option) => (
                <button
                  key={option.level}
                  onClick={() => setPreferences({
                    ...preferences,
                    protectionLevel: option.level as 1 | 2 | 3 | 4 | 5
                  })}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    preferences.protectionLevel === option.level
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    {renderHearts(option.level)}
                  </div>
                  <div className="font-semibold text-gray-900">{option.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowRecommendations(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
            >
              🎯 Obtenir mes recommandations d'expert
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const { recommended, others } = getRecommendations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header expert */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
        <Award className="mx-auto mb-4" size={48} />
        <h2 className="text-2xl font-bold font-poppins mb-4">
          🎯 Analyse d'expert terminée
        </h2>
        <p className="text-green-100 mb-4">
          Budget: <strong>{preferences.budget}€</strong> • 
          Protection: <span className="inline-flex ml-2">{renderHearts(preferences.protectionLevel)}</span> • 
          {totalBeneficiaires} bénéficiaire{totalBeneficiaires > 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setShowRecommendations(false)}
          className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm"
        >
          Modifier mes critères
        </button>
      </div>

      {/* Recommandations */}
      {recommended.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="mr-3 text-green-600" size={28} />
            A) Formules recommandées pour votre profil
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((offre, index) => (
              <motion.div
                key={offre.nom}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
                  index === 0 ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'
                }`}
              >
                {index === 0 && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-4 inline-flex items-center">
                    <Star className="mr-1" size={12} />
                    RECOMMANDATION #1
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-semibold text-gray-900">{offre.nom}</h4>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {offre.prix}€
                    </div>
                    <div className="text-xs text-gray-500">/ mois</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Protection:</span>
                    <div className="flex">
                      {renderHearts(getProtectionLevel(offre))}
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                    {Math.round(offre.score)}% compatible
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">✓ Avantages distinctifs</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {getOffreAdvantages(offre).map((advantage, idx) => (
                      <li key={idx} className="flex items-center">
                        <Zap className="mr-2 text-green-500" size={12} />
                        {advantage}
                      </li>
                    ))}
                  </ul>
                </div>

                {offre.garanties && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Principales garanties</h5>
                    <ul className="text-sm space-y-1">
                      {offre.garanties.slice(0, 3).map((garantie, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span className="text-gray-600">{garantie.nom}</span>
                          <span className="font-medium text-gray-900">{garantie.niveau}</span>
                        </li>
                      ))}
                      {offre.garanties.length > 3 && (
                        <li className="text-xs text-gray-500 italic">
                          +{offre.garanties.length - 3} autres garanties
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <button
                    onClick={() => onOffreSelect(offre)}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      index === 0 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {index === 0 ? '🏆 Choisir cette formule' : 'Souscrire'}
                  </button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    • Sans délai de carence • Résiliation à tout moment
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Autres formules */}
      {others.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="mr-3 text-gray-600" size={28} />
            B) Autres formules disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((offre, index) => (
              <motion.div
                key={offre.nom}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (recommended.length + index) * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-semibold text-gray-900">{offre.nom}</h4>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-600">
                      {offre.prix}€
                    </div>
                    <div className="text-xs text-gray-500">/ mois</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Protection:</span>
                    <div className="flex">
                      {renderHearts(getProtectionLevel(offre))}
                    </div>
                  </div>
                  <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    Hors budget
                  </div>
                </div>

                {offre.garanties && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Garanties principales</h5>
                    <ul className="text-sm space-y-1">
                      {offre.garanties.slice(0, 3).map((garantie, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span className="text-gray-600">{garantie.nom}</span>
                          <span className="font-medium text-gray-900">{garantie.niveau}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => onOffreSelect(offre)}
                  className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Voir cette formule
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Note d'expert */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start">
          <Users className="text-blue-600 mr-3 mt-1" size={24} />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">💡 Conseil d'expert</h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              Les formules recommandées correspondent à votre budget et vos priorités. 
              La formule #{recommended.length > 0 ? '1' : 'Premium'} offre le meilleur rapport qualité-prix pour votre profil. 
              N'hésitez pas à ajuster vos critères si vous souhaitez explorer d'autres options.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpertRecommendation;