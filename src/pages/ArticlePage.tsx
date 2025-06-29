import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, ArrowLeft, Share2, Tag, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Simulation d'un article (en production, ceci viendrait d'une API ou CMS)
  const article = {
    title: 'Mutuelle santé pour indépendants : quelles garanties choisir ?',
    excerpt: 'Guide complet pour choisir la mutuelle santé adaptée aux travailleurs non-salariés. Découvrez les garanties essentielles et les pièges à éviter.',
    content: `
      <p>En tant que travailleur non-salarié (TNS), choisir une mutuelle santé adaptée à votre statut et à vos besoins spécifiques est crucial. Contrairement aux salariés qui bénéficient souvent d'une mutuelle d'entreprise, les indépendants doivent naviguer seuls dans l'univers complexe de l'assurance santé complémentaire.</p>

      <h2>Les spécificités du statut TNS</h2>
      
      <p>Les travailleurs non-salariés ont des besoins particuliers en matière de couverture santé. Votre activité professionnelle, souvent plus flexible mais aussi plus incertaine, nécessite une protection adaptée qui peut évoluer avec votre situation.</p>

      <h3>Pourquoi une mutuelle spécifique aux TNS ?</h3>
      
      <ul>
        <li><strong>Revenus variables :</strong> Vos cotisations peuvent s'adapter à l'évolution de vos revenus</li>
        <li><strong>Risques professionnels :</strong> Certaines activités exposent à des risques spécifiques</li>
        <li><strong>Déductibilité fiscale :</strong> Les cotisations peuvent être déduites de vos revenus professionnels</li>
        <li><strong>Flexibilité :</strong> Possibilité de modifier votre couverture selon l'évolution de votre activité</li>
      </ul>

      <h2>Les garanties essentielles à rechercher</h2>

      <h3>1. Hospitalisation et chirurgie</h3>
      <p>C'est la base de toute bonne mutuelle. Recherchez une prise en charge à 100% des frais d'hospitalisation, y compris :</p>
      <ul>
        <li>Chambre particulière</li>
        <li>Forfait journalier hospitalier</li>
        <li>Dépassements d'honoraires</li>
        <li>Frais d'accompagnant</li>
      </ul>

      <h3>2. Soins courants</h3>
      <p>Pour vos consultations régulières, privilégiez :</p>
      <ul>
        <li>Remboursement à 100% des consultations généralistes</li>
        <li>Prise en charge des spécialistes (même en secteur 2)</li>
        <li>Médecines douces si vous y avez recours</li>
      </ul>

      <h3>3. Optique et dentaire</h3>
      <p>Ces postes représentent souvent des dépenses importantes :</p>
      <ul>
        <li>Forfait optique annuel adapté à vos besoins</li>
        <li>Orthodontie pour vos enfants</li>
        <li>Prothèses dentaires</li>
        <li>Implants dentaires</li>
      </ul>

      <h2>Les pièges à éviter</h2>

      <blockquote>
        "Attention aux contrats avec des délais de carence trop longs ou des exclusions nombreuses. En tant qu'indépendant, vous avez besoin d'une couverture immédiate et complète."
      </blockquote>

      <h3>Délais de carence</h3>
      <p>Certaines mutuelles imposent des délais avant la prise en charge de certains soins. Privilégiez les contrats sans délai de carence ou avec des délais réduits.</p>

      <h3>Exclusions cachées</h3>
      <p>Lisez attentivement les conditions générales pour identifier :</p>
      <ul>
        <li>Les exclusions liées à votre activité professionnelle</li>
        <li>Les limitations géographiques</li>
        <li>Les plafonds de remboursement</li>
      </ul>

      <h2>Optimisation fiscale</h2>

      <p>En tant que TNS, vous pouvez déduire vos cotisations de mutuelle de vos revenus professionnels, dans certaines limites. Cette déductibilité peut représenter une économie substantielle sur votre facture fiscale.</p>

      <h3>Conditions de déductibilité</h3>
      <ul>
        <li>Le contrat doit être souscrit dans le cadre de votre activité professionnelle</li>
        <li>Les garanties doivent respecter certains plafonds</li>
        <li>La déduction est limitée selon votre régime fiscal</li>
      </ul>

      <h2>Comment bien choisir ?</h2>

      <p>Pour faire le bon choix, suivez cette méthode :</p>

      <ol>
        <li><strong>Analysez vos besoins :</strong> Âge, situation familiale, état de santé, activité professionnelle</li>
        <li><strong>Définissez votre budget :</strong> Cotisation mensuelle acceptable</li>
        <li><strong>Comparez les garanties :</strong> Utilisez un comparateur spécialisé</li>
        <li><strong>Vérifiez les réseaux de soins :</strong> Disponibilité près de chez vous</li>
        <li><strong>Lisez les avis clients :</strong> Qualité du service et rapidité des remboursements</li>
      </ol>

      <h2>Conclusion</h2>

      <p>Choisir une mutuelle santé en tant qu'indépendant demande du temps et de la réflexion. N'hésitez pas à faire appel à un courtier spécialisé qui pourra vous accompagner dans cette démarche et vous proposer des solutions adaptées à votre profil.</p>

      <p>Chez Evolivie, nous comprenons les spécificités des TNS et proposons des solutions sur-mesure avec une souscription 100% digitale en quelques minutes.</p>
    `,
    author: 'Dr. Marie Dubois',
    date: '2024-01-15',
    readTime: '8 min',
    category: 'TNS',
    image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tags: ['TNS', 'Garanties', 'Indépendants', 'Fiscalité']
  };

  const relatedArticles = [
    {
      title: 'Mutuelle TNS : comment bien choisir en 2025 ?',
      slug: 'mutuelle-tns-bien-choisir-2025',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Peut-on déduire sa mutuelle de ses impôts ?',
      slug: 'deduire-mutuelle-impots',
      image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Evolivie",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.evolivie.com/logo-evolivie.png"
      }
    },
    "datePublished": article.date,
    "dateModified": article.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.evolivie.com/article/${slug}`
    }
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://www.evolivie.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.evolivie.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `https://www.evolivie.com/article/${slug}`
      }
    ]
  };

  return (
    <>
      <SEOHead
        title={article.title}
        description={article.excerpt}
        keywords={article.tags.join(', ')}
        ogImage={article.image}
        ogType="article"
        structuredData={[structuredData, breadcrumbStructuredData]}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm font-inter">
              <Link to="/" className="text-gray-500 hover:text-evolivie-mint transition-colors">
                Accueil
              </Link>
              <span className="text-gray-300">/</span>
              <Link to="/blog" className="text-gray-500 hover:text-evolivie-mint transition-colors">
                Blog
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">{article.category}</span>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Bouton retour */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center text-evolivie-mint hover:text-evolivie-mint-dark transition-colors font-medium font-poppins"
            >
              <ArrowLeft size={20} className="mr-2" />
              Retour au blog
            </Link>
          </motion.div>

          {/* Header de l'article */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="mb-6">
              <span className="badge-evolivie badge-evolivie-mint">
                {article.category}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold font-poppins text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-gray-600 font-inter leading-relaxed mb-8">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-inter">
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                {article.author}
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                {new Date(article.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                {article.readTime}
              </div>
              <button className="flex items-center hover:text-evolivie-mint transition-colors">
                <Share2 size={16} className="mr-2" />
                Partager
              </button>
            </div>
          </motion.header>

          {/* Image principale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 lg:h-96 object-cover rounded-2xl shadow-lg"
            />
          </motion.div>

          {/* Contenu de l'article */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="prose prose-lg max-w-none blog-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <h3 className="text-lg font-semibold font-poppins text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg font-inter hover:bg-evolivie-mint hover:text-white transition-colors cursor-pointer"
                >
                  <Tag size={12} className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 bg-gradient-evolivie-primary rounded-2xl p-8 text-center text-white"
          >
            <h3 className="text-2xl font-bold font-poppins mb-4">
              Prêt à souscrire votre mutuelle TNS ?
            </h3>
            <p className="text-white text-opacity-90 font-inter mb-6">
              Obtenez votre devis personnalisé en 2 minutes avec Evolivie
            </p>
            <Link
              to="/simulation"
              className="inline-flex items-center px-8 py-4 bg-white text-evolivie-mint font-semibold font-poppins rounded-xl hover:bg-gray-50 transition-colors"
            >
              Faire ma simulation
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </motion.div>
        </article>

        {/* Articles liés */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold font-poppins text-gray-900 mb-4">
                Articles similaires
              </h2>
              <p className="text-gray-600 font-inter">
                Continuez votre lecture avec ces articles connexes
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedArticles.map((relatedArticle, index) => (
                <motion.div
                  key={relatedArticle.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-evolivie group"
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold font-poppins text-gray-900 mb-4 group-hover:text-evolivie-mint transition-colors">
                    {relatedArticle.title}
                  </h3>
                  <Link
                    to={`/article/${relatedArticle.slug}`}
                    className="inline-flex items-center text-evolivie-mint font-medium font-poppins hover:text-evolivie-mint-dark transition-colors"
                  >
                    Lire l'article
                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ArticlePage;