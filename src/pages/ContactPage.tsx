import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import SEOHead from '../components/SEOHead';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactPreference: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        contactPreference: 'email'
      });
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      details: '01 80 85 57 86',
      subtitle: 'Lun-Ven 9h-18h',
      action: 'tel:+33180855786'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'contact@evolivie.com',
      subtitle: 'Réponse sous 24h',
      action: 'mailto:contact@evolivie.com'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      details: '2 Avenue Gallieni',
      subtitle: '77000 Melun, France',
      action: 'https://maps.google.com/?q=2+Avenue+Gallieni+77000+Melun'
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Evolivie",
    "description": "Contactez l'équipe Evolivie pour toutes vos questions sur nos mutuelles santé",
    "url": "https://www.evolivie.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Evolivie",
      "telephone": "+33180855786",
      "email": "contact@evolivie.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2 Avenue Gallieni",
        "addressLocality": "Melun",
        "postalCode": "77000",
        "addressCountry": "FR"
      }
    }
  };

  return (
    <>
      <SEOHead
        title="Contact Evolivie - Nous contacter pour votre mutuelle santé"
        description="Contactez l'équipe Evolivie pour toutes vos questions sur nos mutuelles santé. Téléphone, email, adresse. Réponse rapide garantie."
        keywords="contact evolivie, téléphone mutuelle, email assurance santé, adresse evolivie"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-poppins text-gray-900 mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-600 font-inter max-w-3xl mx-auto">
              Notre équipe d'experts est à votre disposition pour répondre à toutes vos questions 
              sur nos solutions de mutuelle santé.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Informations de contact */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold font-poppins text-gray-900 mb-6">
                  Nos coordonnées
                </h2>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-evolivie-mint to-evolivie-mint-light rounded-xl flex items-center justify-center">
                        <info.icon className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold font-poppins text-gray-900 mb-1">
                          {info.title}
                        </h3>
                        <p className="text-gray-700 font-inter font-medium">
                          {info.details}
                        </p>
                        <p className="text-gray-500 font-inter text-sm">
                          {info.subtitle}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Horaires */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <Clock className="text-evolivie-mint mr-3" size={24} />
                  <h3 className="text-lg font-semibold font-poppins text-gray-900">
                    Horaires d'ouverture
                  </h3>
                </div>
                <div className="space-y-2 font-inter text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lundi - Vendredi</span>
                    <span className="font-medium text-gray-900">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Samedi</span>
                    <span className="font-medium text-gray-900">9h00 - 12h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimanche</span>
                    <span className="font-medium text-gray-900">Fermé</span>
                  </div>
                </div>
              </motion.div>

              {/* CTA Rappel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-evolivie-primary rounded-xl p-6 text-white text-center"
              >
                <Calendar className="mx-auto mb-4" size={32} />
                <h3 className="text-lg font-semibold font-poppins mb-2">
                  Besoin d'un conseil personnalisé ?
                </h3>
                <p className="text-white text-opacity-90 font-inter text-sm mb-4">
                  Demandez à être rappelé par un de nos experts
                </p>
                <a
                  href="tel:+33180855786"
                  className="w-full bg-white text-evolivie-mint font-semibold font-poppins py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors inline-block"
                >
                  Demander un rappel
                </a>
              </motion.div>
            </motion.div>

            {/* Formulaire de contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-8">
                  <MessageCircle className="text-evolivie-mint mr-3" size={28} />
                  <h2 className="text-2xl font-bold font-poppins text-gray-900">
                    Envoyez-nous un message
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium font-poppins text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        className="form-input-evolivie"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium font-poppins text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                        className="form-input-evolivie"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium font-poppins text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="form-input-evolivie"
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium font-poppins text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="form-input-evolivie"
                        placeholder="01 80 85 57 86"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-poppins text-gray-700 mb-2">
                      Sujet *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                      className="form-input-evolivie"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="devis">Demande de devis</option>
                      <option value="souscription">Question sur la souscription</option>
                      <option value="garanties">Informations sur les garanties</option>
                      <option value="tns">Mutuelle TNS</option>
                      <option value="famille">Mutuelle famille</option>
                      <option value="autre">Autre question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-poppins text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      rows={6}
                      className="form-input-evolivie resize-none"
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-poppins text-gray-700 mb-3">
                      Préférence de contact
                    </label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="email"
                          checked={formData.contactPreference === 'email'}
                          onChange={(e) => handleInputChange('contactPreference', e.target.value)}
                          className="mr-2 text-evolivie-mint focus:ring-evolivie-mint"
                        />
                        <span className="font-inter text-gray-700">Email</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="phone"
                          checked={formData.contactPreference === 'phone'}
                          onChange={(e) => handleInputChange('contactPreference', e.target.value)}
                          className="mr-2 text-evolivie-mint focus:ring-evolivie-mint"
                        />
                        <span className="font-inter text-gray-700">Téléphone</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-evolivie-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send size={20} className="mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Carte Google Maps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold font-poppins text-gray-900 mb-6 text-center">
                Notre localisation
              </h2>
              <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2634.123456789!2d2.6598!3d48.5398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s2%20Avenue%20Gallieni%2C%2077000%20Melun!5e0!3m2!1sfr!2sfr!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation Evolivie - 2 Avenue Gallieni, 77000 Melun"
                ></iframe>
              </div>
              <div className="text-center mt-4">
                <p className="text-gray-600 font-inter">
                  2 Avenue Gallieni, 77000 Melun, France
                </p>
                <a
                  href="https://maps.google.com/?q=2+Avenue+Gallieni+77000+Melun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 text-evolivie-mint hover:text-evolivie-mint-dark transition-colors font-medium"
                >
                  <MapPin size={16} className="mr-1" />
                  Voir sur Google Maps
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;