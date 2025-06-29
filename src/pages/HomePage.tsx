import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Heart, Users, CheckCircle, Star, Clock, Award, Smartphone, Calculator, Phone } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const HomePage: React.FC = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Souscription en 5 minutes',
      description: 'Un processus 100% digital, simple et rapide. Obtenez votre devis et souscrivez en quelques clics.'
    },
    {
      icon: Calculator,
      title: 'Tarifs transparents',
      description: 'Pas de frais cachés, pas de surprise. Des tarifs clairs adaptés à votre profil et vos besoins.'
    },
    {
      icon: Shield,
      title: 'Garanties sur-mesure',
      description: 'Des formules adaptées aux particuliers et TNS avec des garanties qui vous protègent vraiment.'
    }
  ];

  const testimonials = [
    {
      name: 'Marie L.',
      role: 'Freelance Marketing',
      content: 'En tant que TNS, j\'avais du mal à trouver une mutuelle adaptée. Evolivie m\'a proposé une solution parfaite en 5 minutes !',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 5
    },
    {
      name: 'Thomas D.',
      role: 'Famille de 4 personnes',
      content: 'Interface claire, tarifs transparents, souscription ultra-rapide. Exactement ce qu\'on cherchait pour notre famille.',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 5
    }
  ];

  const features = [
    'Devis gratuit en 2 minutes',
    'Souscription 100% en ligne',
    'Prise d\'effet immédiate',
    'Résiliation à tout moment'
  ];

  const stats = [
    { number: '50K+', label: 'Clients protégés' },
    { number: '4.8/5', label: 'Satisfaction client' },
    { number: '5min', label: 'Temps de souscription' },
    { number: '24h/7j', label: 'Support disponible' }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Evolivie",
    "url": "https://www.evolivie.com",
    "description": "Mutuelle santé en ligne pour particuliers et TNS. Souscription en 5 minutes, tarifs transparents.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.evolivie.com/simulation",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <SEOHead
        title="Evolivie - Mutuelle santé en ligne pour particuliers et TNS"
        description="Souscrivez votre mutuelle santé en ligne en 5 minutes. Devis gratuit, tarifs transparents, garanties adaptées aux particuliers et TNS. Evolivie, votre partenaire santé."
        keywords="mutuelle santé, assurance santé, TNS, particuliers, souscription en ligne, devis gratuit"
        structuredData={structuredData}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-evolivie-hero text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          
          {/* Formes décoratives */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white opacity-10 rounded-full animate-float"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white opacity-10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium"
                  >
                    <Award className="mr-2" size={16} />
                    Courtier agréé ORIAS
                  </motion.div>
                  
                  <h1 className="text-4xl lg:text-6xl font-bold font-poppins leading-tight">
                    Votre mutuelle santé
                    <span className="block text-evolivie-coral"> en 5 minutes</span>
                  </h1>
                </div>
                
                <p className="text-xl lg:text-2xl text-white text-opacity-90 leading-relaxed font-inter">
                  La première mutuelle 100% digitale adaptée aux particuliers et TNS. 
                  Transparente, rapide et sans engagement.
                </p>

                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="text-white" size={20} />
                      <span className="text-white text-opacity-90 font-inter">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                >
                  <Link
                    to="/simulation"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-evolivie-mint font-semibold font-poppins rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Calculator className="mr-2" size={20} />
                    Faire ma simulation
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                  
                  <Link
                    to="/blog"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold font-poppins rounded-xl hover:bg-white hover:text-evolivie-mint transition-all duration-300"
                  >
                    Nos guides santé
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Famille heureuse avec leur mutuelle Evolivie"
                    className="rounded-2xl shadow-2xl w-full h-auto"
                  />
                  
                  {/* Card flottante avec stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-evolivie-mint bg-opacity-10 p-3 rounded-full">
                        <Smartphone className="text-evolivie-mint" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold font-poppins text-gray-800">100% Digital</p>
                        <p className="text-gray-600 text-sm font-inter">Souscription mobile</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl lg:text-4xl font-bold font-poppins text-evolivie-mint mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-inter text-sm lg:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold font-poppins text-gray-900 mb-4">
                Pourquoi choisir Evolivie ?
              </h2>
              <p className="text-xl text-gray-600 font-inter max-w-3xl mx-auto">
                Une expérience révolutionnaire pour votre assurance santé
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="card-evolivie text-center group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-evolivie-mint to-evolivie-mint-light rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                    <benefit.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold font-poppins text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 font-inter leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold font-poppins text-gray-900 mb-4">
                Ils nous font confiance
              </h2>
              <p className="text-xl text-gray-600 font-inter">
                Découvrez les témoignages de nos clients satisfaits
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="card-evolivie"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-current" size={20} />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 font-inter mb-6 italic leading-relaxed text-lg">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold font-poppins text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600 font-inter text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-evolivie-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl lg:text-4xl font-bold font-poppins text-white">
                Prêt à protéger votre santé ?
              </h2>
              
              <p className="text-xl text-white text-opacity-90 font-inter max-w-2xl mx-auto">
                Obtenez votre devis personnalisé en 2 minutes et souscrivez en ligne
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/simulation"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-evolivie-mint font-semibold font-poppins rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Calculator className="mr-2" size={20} />
                  Commencer ma simulation
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold font-poppins rounded-xl hover:bg-white hover:text-evolivie-mint transition-all duration-300"
                >
                  <Phone className="mr-2" size={20} />
                  Être rappelé
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;