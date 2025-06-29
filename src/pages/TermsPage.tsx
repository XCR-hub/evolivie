import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const TermsPage: React.FC = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Objet et champ d\'application',
      content: `
        <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Evolivie SAS, courtier en assurance, et ses clients dans le cadre de la souscription de contrats d'assurance santé.</p>
        
        <p>Toute souscription implique l'acceptation pleine et entière des présentes conditions générales de vente.</p>
        
        <p><strong>Définitions :</strong></p>
        <ul class="list-disc pl-6 space-y-1">
          <li><strong>Evolivie :</strong> Evolivie SAS, courtier en assurance</li>
          <li><strong>Client :</strong> Toute personne physique ou morale souscrivant un contrat</li>
          <li><strong>Assureur :</strong> La compagnie d'assurance émettrice du contrat</li>
          <li><strong>Contrat :</strong> Le contrat d'assurance santé souscrit</li>
        </ul>
      `
    },
    {
      icon: Shield,
      title: 'Processus de souscription',
      content: `
        <h3 class="text-lg font-semibold mb-3">1. Demande de devis</h3>
        <p>Le client peut obtenir un devis gratuit et sans engagement via notre plateforme en ligne. Le devis est valable 30 jours.</p>
        
        <h3 class="text-lg font-semibold mb-3 mt-6">2. Souscription</h3>
        <p>La souscription s'effectue en ligne après :</p>
        <ul class="list-disc pl-6 space-y-1">
          <li>Remplissage du questionnaire de santé (si requis)</li>
          <li>Acceptation des conditions générales du contrat</li>
          <li>Paiement de la première cotisation</li>
          <li>Signature électronique des documents</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3 mt-6">3. Prise d'effet</h3>
        <p>Le contrat prend effet à la date convenue, sous réserve de l'encaissement de la première cotisation et de l'acceptation par l'assureur.</p>
      `
    },
    {
      icon: AlertCircle,
      title: 'Obligations du client',
      content: `
        <h3 class="text-lg font-semibold mb-3">Déclaration du risque</h3>
        <p>Le client s'engage à répondre exactement aux questions posées lors de la souscription. Toute fausse déclaration intentionnelle peut entraîner la nullité du contrat.</p>
        
        <h3 class="text-lg font-semibold mb-3 mt-6">Paiement des cotisations</h3>
        <p>Les cotisations sont payables d'avance selon la périodicité choisie. En cas de non-paiement, les garanties peuvent être suspendues après mise en demeure.</p>
        
        <h3 class="text-lg font-semibold mb-3 mt-6">Déclaration des sinistres</h3>
        <p>Le client doit déclarer tout sinistre dans les délais prévus au contrat et fournir tous les justificatifs nécessaires.</p>
      `
    },
    {
      icon: CheckCircle,
      title: 'Droits du client',
      content: `
        <h3 class="text-lg font-semibold mb-3">Droit de rétractation</h3>
        <p>Conformément au Code des assurances, le client dispose d'un délai de 14 jours à compter de la souscription pour se rétracter sans motif ni pénalité.</p>
        
        <h3 class="text-lg font-semibold mb-3 mt-6">Résiliation</h3>
        <p>Le client peut résilier son contrat :</p>
        <ul class="list-disc pl-6 space-y-1">
          <li>À l'échéance annuelle avec préavis de 2 mois</li>
          <li>En cas de changement de situation (loi Chatel)</li>
          <li>À tout moment après la première année (loi Hamon)</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3 mt-6">Réclamations</h3>
        <p>En cas de réclamation, le client peut s'adresser à notre service client ou au médiateur de l'assurance.</p>
      `
    }
  ];

  const additionalInfo = [
    {
      title: 'Tarification',
      content: 'Les tarifs sont établis selon les informations déclarées et peuvent évoluer selon les conditions générales du contrat.'
    },
    {
      title: 'Données personnelles',
      content: 'Le traitement des données personnelles est effectué conformément à notre politique de confidentialité et au RGPD.'
    },
    {
      title: 'Droit applicable',
      content: 'Les présentes CGV sont soumises au droit français. Tout litige relève de la compétence des tribunaux français.'
    }
  ];

  return (
    <>
      <SEOHead
        title="Conditions générales de vente - Evolivie"
        description="Conditions générales de vente d'Evolivie pour la souscription de mutuelles santé. Droits, obligations et processus de souscription."
        keywords="conditions générales, CGV, souscription mutuelle, droits client, obligations"
        noindex={true}
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
            <h1 className="text-4xl lg:text-5xl font-bold font-poppins text-gray-900 mb-4">
              Conditions générales de vente
            </h1>
            <p className="text-xl text-gray-600 font-inter">
              Conditions applicables à la souscription de nos contrats d'assurance santé
            </p>
          </motion.div>

          {/* Sections principales */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-evolivie-mint to-evolivie-mint-light rounded-xl flex items-center justify-center mr-4">
                    <section.icon className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold font-poppins text-gray-900">
                    {section.title}
                  </h2>
                </div>
                
                <div 
                  className="prose prose-lg max-w-none font-inter text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </motion.div>
            ))}
          </div>

          {/* Informations complémentaires */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8 mt-8"
          >
            <h2 className="text-2xl font-bold font-poppins text-gray-900 mb-6">
              Informations complémentaires
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {additionalInfo.map((info, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold font-poppins text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-inter">
                    {info.content}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact pour questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-gradient-evolivie-primary rounded-2xl p-8 text-white text-center mt-12"
          >
            <h3 className="text-2xl font-bold font-poppins mb-4">
              Questions sur nos conditions ?
            </h3>
            <p className="text-white text-opacity-90 font-inter mb-6">
              Notre équipe est à votre disposition pour toute clarification
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contact@evolivie.com"
                className="inline-flex items-center px-8 py-4 bg-white text-evolivie-mint font-semibold font-poppins rounded-xl hover:bg-gray-50 transition-colors"
              >
                Nous écrire
              </a>
              <a
                href="tel:+33123456789"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold font-poppins rounded-xl hover:bg-white hover:text-evolivie-mint transition-colors"
              >
                Nous appeler
              </a>
            </div>
          </motion.div>

          {/* Date de mise à jour */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500 font-inter">
              Conditions générales de vente en vigueur au 15 janvier 2024
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;