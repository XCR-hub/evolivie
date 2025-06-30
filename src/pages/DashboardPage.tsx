import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Eye, Plus, Calendar, Euro, Shield, User, Phone, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

interface UserSubscription {
  id: string;
  product_name: string;
  formula_name: string;
  monthly_price: number;
  status: string;
  date_effect: string;
  created_at: string;
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      setUser({
        id: user.id,
        email: user.email || '',
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        phone: user.user_metadata?.phone || ''
      });

      // Charger les souscriptions de l'utilisateur
      await loadSubscriptions(user.id);
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const loadSubscriptions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des souscriptions:', error);
      toast.error('Erreur lors du chargement de vos contrats');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Résilié';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-evolivie-mint mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Mon espace client - Evolivie"
        description="Gérez vos contrats de mutuelle santé depuis votre espace client Evolivie"
        noindex={true}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold font-poppins text-gray-900 mb-2">
              Bonjour {user?.first_name} !
            </h1>
            <p className="text-gray-600 font-inter">
              Bienvenue dans votre espace client Evolivie
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informations personnelles */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <User className="text-evolivie-mint mr-3" size={24} />
                  <h2 className="text-xl font-semibold font-poppins">Mes informations</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="text-gray-400 mr-3" size={16} />
                    <div>
                      <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                      <p className="text-sm text-gray-500">Nom complet</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="text-gray-400 mr-3" size={16} />
                    <div>
                      <p className="font-medium">{user?.email}</p>
                      <p className="text-sm text-gray-500">Email</p>
                    </div>
                  </div>

                  {user?.phone && (
                    <div className="flex items-center">
                      <Phone className="text-gray-400 mr-3" size={16} />
                      <div>
                        <p className="font-medium">{user.phone}</p>
                        <p className="text-sm text-gray-500">Téléphone</p>
                      </div>
                    </div>
                  )}
                </div>

                <button className="w-full mt-6 btn-evolivie-outline">
                  Modifier mes informations
                </button>
              </div>
            </motion.div>

            {/* Contrats et souscriptions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Shield className="text-evolivie-mint mr-3" size={24} />
                    <h2 className="text-xl font-semibold font-poppins">Mes contrats</h2>
                  </div>
                  <button
                    onClick={() => navigate('/simulation')}
                    className="btn-evolivie-primary flex items-center"
                  >
                    <Plus className="mr-2" size={16} />
                    Nouvelle simulation
                  </button>
                </div>

                {subscriptions.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun contrat pour le moment
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Commencez par faire une simulation pour découvrir nos offres
                    </p>
                    <button
                      onClick={() => navigate('/simulation')}
                      className="btn-evolivie-primary"
                    >
                      Faire une simulation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subscriptions.map((subscription) => (
                      <motion.div
                        key={subscription.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {subscription.product_name}
                            </h3>
                            <p className="text-gray-600">{subscription.formula_name}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                            {getStatusText(subscription.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center">
                            <Euro className="text-gray-400 mr-2" size={16} />
                            <div>
                              <p className="font-medium">{subscription.monthly_price}€</p>
                              <p className="text-sm text-gray-500">/ mois</p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <Calendar className="text-gray-400 mr-2" size={16} />
                            <div>
                              <p className="font-medium">
                                {new Date(subscription.date_effect).toLocaleDateString('fr-FR')}
                              </p>
                              <p className="text-sm text-gray-500">Date d'effet</p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <FileText className="text-gray-400 mr-2" size={16} />
                            <div>
                              <p className="font-medium">
                                {new Date(subscription.created_at).toLocaleDateString('fr-FR')}
                              </p>
                              <p className="text-sm text-gray-500">Souscrit le</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            <Eye className="mr-2" size={14} />
                            Voir les détails
                          </button>
                          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            <Download className="mr-2" size={14} />
                            Télécharger les documents
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Actions rapides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
          >
            <h2 className="text-xl font-semibold font-poppins text-gray-900 mb-6">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate('/simulation')}
                className="card-evolivie text-center group"
              >
                <Plus className="mx-auto mb-4 text-evolivie-mint group-hover:scale-110 transition-transform" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Nouvelle simulation</h3>
                <p className="text-gray-600 text-sm">Comparez nos offres et trouvez la mutuelle idéale</p>
              </button>

              <button className="card-evolivie text-center group">
                <FileText className="mx-auto mb-4 text-evolivie-mint group-hover:scale-110 transition-transform" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Faire une demande</h3>
                <p className="text-gray-600 text-sm">Remboursement, modification, résiliation...</p>
              </button>

              <button className="card-evolivie text-center group">
                <Phone className="mx-auto mb-4 text-evolivie-mint group-hover:scale-110 transition-transform" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Nous contacter</h3>
                <p className="text-gray-600 text-sm">Besoin d'aide ? Notre équipe est là pour vous</p>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;