import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, User, ArrowRight, Tag, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import SEOHead from '../components/SEOHead';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  category: 'TNS' | 'Particuliers' | 'Entreprises' | 'Conseils';
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Mutuelle santé pour indépendants : quelles garanties choisir ?',
      excerpt: 'Guide complet pour choisir la mutuelle santé adaptée aux travailleurs non-salariés. Découvrez les garanties essentielles et les pièges à éviter.',
      slug: 'mutuelle-sante-independants-garanties',
      category: 'TNS',
      author: 'Dr. Marie Dubois',
      date: '2024-01-15',
      readTime: '8 min',
      image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['TNS', 'Garanties', 'Indépendants']
    },
    {
      id: '2',
      title: 'Souscrire une mutuelle en ligne en moins de 5 minutes',
      excerpt: 'Découvrez comment la digitalisation révolutionne la souscription d\'assurance santé. Processus simplifié, transparence et rapidité.',
      slug: 'souscrire-mutuelle-en-ligne-5-minutes',
      category: 'Conseils',
      author: 'Thomas Martin',
      date: '2024-01-12',
      readTime: '5 min',
      image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Digital', 'Souscription', 'Rapidité']
    },
    {
      id: '3',
      title: 'Comparatif des mutuelles sans délai de carence',
      excerpt: 'Analyse détaillée des mutuelles proposant une prise en charge immédiate. Avantages, inconvénients et conseils pour bien choisir.',
      slug: 'comparatif-mutuelles-sans-delai-carence',
      category: 'Particuliers',
      author: 'Sophie Laurent',
      date: '2024-01-10',
      readTime: '12 min',
      image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Comparatif', 'Délai de carence', 'Prise en charge']
    },
    {
      id: '4',
      title: 'Mutuelle TNS : comment bien choisir en 2025 ?',
      excerpt: 'Les spécificités des mutuelles pour travailleurs non-salariés en 2025. Nouveautés réglementaires et meilleures pratiques.',
      slug: 'mutuelle-tns-bien-choisir-2025',
      category: 'TNS',
      author: 'Pierre Durand',
      date: '2024-01-08',
      readTime: '10 min',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['TNS', '2025', 'Réglementation']
    },
    {
      id: '5',
      title: 'Peut-on déduire sa mutuelle de ses impôts ?',
      excerpt: 'Guide fiscal complet sur la déductibilité des cotisations de mutuelle santé. Cas particuliers et optimisation fiscale.',
      slug: 'deduire-mutuelle-impots',
      category: 'Conseils',
      author: 'Isabelle Moreau',
      date: '2024-01-05',
      readTime: '7 min',
      image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Fiscalité', 'Déduction', 'Impôts']
    },
    {
      id: '6',
      title: 'Mutuelle famille : protéger tous vos proches',
      excerpt: 'Comment choisir une mutuelle famille qui couvre efficacement tous les membres. Garanties enfants, adultes et seniors.',
      slug: 'mutuelle-famille-proteger-proches',
      category: 'Particuliers',
      author: 'Dr. Marie Dubois',
      date: '2024-01-03',
      readTime: '9 min',
      image: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Famille', 'Protection', 'Enfants']
    }
  ];

  const categories = ['Tous', 'TNS', 'Particuliers', 'Entreprises', 'Conseils'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Tous' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Veuillez saisir une adresse email valide');
      return;
    }

    setIsSubscribing(true);
    
    try {
      // Simulation d'abonnement
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Merci pour votre abonnement ! Vous recevrez bientôt nos derniers articles.');
      setNewsletterEmail('');
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog Evolivie",
    "description": "Conseils et guides sur l'assurance santé pour particuliers et TNS",
    "url": "https://www.evolivie.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Evolivie",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.evolivie.com/logo-evolivie.png"
      }
    }
  };

  return (
    <>
      <SEOHead
        title="Blog Evolivie - Conseils mutuelle santé TNS et particuliers"
        description="Découvrez nos guides et conseils d'experts sur l'assurance santé. Mutuelle TNS, particuliers, comparatifs et actualités santé."
        keywords="blog mutuelle, conseils assurance santé, mutuelle TNS, guides santé, comparatif mutuelle"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-poppins text-gray-900 mb-4">
              Blog Evolivie
            </h1>
            <p className="text-xl text-gray-600 font-inter max-w-3xl mx-auto">
              Conseils d'experts, guides pratiques et actualités pour bien choisir votre mutuelle santé
            </p>
          </motion.div>

          {/* Filtres et recherche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-12"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Barre de recherche */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-evolivie-mint focus:border-transparent transition-all font-inter"
                />
              </div>

              {/* Filtres par catégorie */}
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400" size={20} />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-medium font-poppins text-sm transition-all ${
                        selectedCategory === category
                          ? 'bg-evolivie-mint text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-evolivie group"
              >
                <div className="relative overflow-hidden rounded-xl mb-6">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`badge-evolivie ${
                      post.category === 'TNS' ? 'badge-evolivie-mint' : 
                      post.category === 'Particuliers' ? 'badge-evolivie-coral' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold font-poppins text-gray-900 group-hover:text-evolivie-mint transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 font-inter leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 font-inter">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User size={14} className="mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(post.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <span>{post.readTime}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-inter"
                      >
                        <Tag size={10} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/article/${post.slug}`}
                    className="inline-flex items-center text-evolivie-mint font-medium font-poppins hover:text-evolivie-mint-dark transition-colors"
                  >
                    Lire l'article
                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Message si aucun résultat */}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold font-poppins text-gray-600 mb-2">
                Aucun article trouvé
              </h3>
              <p className="text-gray-500 font-inter">
                Essayez de modifier vos critères de recherche ou de filtrage.
              </p>
            </motion.div>
          )}

          {/* CTA Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-evolivie-primary rounded-2xl p-8 text-center text-white mt-16"
          >
            <Mail className="mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold font-poppins mb-4">
              Restez informé des dernières actualités santé
            </h3>
            <p className="text-white text-opacity-90 font-inter mb-6 max-w-2xl mx-auto">
              Recevez nos conseils d'experts et nos guides pratiques directement dans votre boîte mail.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 font-inter focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button 
                type="submit"
                disabled={isSubscribing}
                className="px-6 py-3 bg-white text-evolivie-mint font-semibold font-poppins rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubscribing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-evolivie-mint mr-2"></div>
                    Abonnement...
                  </>
                ) : (
                  'S\'abonner'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;