import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Eye, Lock } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const LegalPage: React.FC = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Éditeur du site',
      content: `
        <p><strong>EXCELLENCE COVERAGE RISKS XCR</strong><br/>
        Représenté par M. Tony CERDA<br/>
        Capital social : 100 000 €<br/>
        RCS Melun : 123 456 789<br/>
        SIRET : 123 456 789 00012<br/>
        TVA intracommunautaire : FR12 123456789</p>
        
        <p><strong>Siège social :</strong><br/>
        2 Avenue Gallieni<br/>
        77000 Melun, France</p>
        
        <p><strong>Marque :</strong> Evolivie<br/>
        <strong>Directeur de la publication :</strong> Tony CERDA<br/>
        <strong>Contact :</strong> contact@evolivie.com<br/>
        <strong>Téléphone :</strong> 01 80 85 57 86</p>
      `
    },
    {
      icon: Shield,
      title: 'Activité d\'intermédiation en assurance',
      content: `
        <p>Evolivie est un courtier en assurance inscrit à l'ORIAS (Organisme pour le Registre des Intermédiaires en Assurance) sous le numéro <strong>11 061 425</strong>.</p>
        
        <p><strong>Contrôle :</strong><br/>
        Autorité de Contrôle Prudentiel et de Résolution (ACPR)<br/>
        4 Place de Budapest - CS 92459<br/>
        75436 Paris Cedex 09</p>
        
        <p><strong>Garantie financière :</strong><br/>
        Assurance Responsabilité Civile Professionnelle souscrite auprès de AXA France IARD<br/>
        Montant de la garantie : 1 500 000 € par sinistre et par année d'assurance</p>
        
        <p><strong>Médiation :</strong><br/>
        En cas de litige, vous pouvez saisir le médiateur de l'assurance :<br/>
        La Médiation de l'Assurance<br/>
        TSA 50110 - 75441 Paris Cedex 09<br/>
        <a href="http://www.mediation-assurance.org" class="text-evolivie-mint hover:underline">www.mediation-assurance.org</a></p>
      `
    },
    {
      icon: Eye,
      title: 'Hébergement',
      content: `
        <p><strong>Hébergeur :</strong><br/>
        OVH SAS<br/>
        2 rue Kellermann<br/>
        59100 Roubaix, France<br/>
        Téléphone : 1007</p>
        
        <p><strong>Développement technique :</strong><br/>
        Site développé avec React, TypeScript et Tailwind CSS<br/>
        Hébergement sécurisé avec certificat SSL</p>
      `
    },
    {
      icon: Lock,
      title: 'Protection des données personnelles',
      content: `
        <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et de limitation du traitement des données vous concernant.</p>
        
        <p><strong>Responsable du traitement :</strong> EXCELLENCE COVERAGE RISKS XCR</p>
        
        <p><strong>Finalités du traitement :</strong></p>
        <ul class="list-disc pl-6 space-y-1">
          <li>Gestion des demandes de devis et souscriptions</li>
          <li>Relation client et support</li>
          <li>Amélioration de nos services</li>
          <li>Respect des obligations légales et réglementaires</li>
        </ul>
        
        <p><strong>Durée de conservation :</strong><br/>
        Les données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles sont collectées, et conformément aux obligations légales.</p>
        
        <p><strong>Exercice de vos droits :</strong><br/>
        Pour exercer vos droits, contactez-nous à : <a href="mailto:dpo@evolivie.com" class="text-evolivie-mint hover:underline">dpo@evolivie.com</a></p>
        
        <p><strong>Réclamation :</strong><br/>
        Vous pouvez introduire une réclamation auprès de la CNIL :<br/>
        <a href="https://www.cnil.fr" class="text-evolivie-mint hover:underline">www.cnil.fr</a></p>
      `
    }
  ];

  return (
    <>
      <SEOHead
        title="Mentions légales - Evolivie"
        description="Mentions légales d'Evolivie, courtier en assurance agréé ORIAS. Informations légales, RGPD, hébergement et contact."
        keywords="mentions légales, ORIAS, courtier assurance, RGPD, protection données"
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
              Mentions légales
            </h1>
            <p className="text-xl text-gray-600 font-inter">
              Informations légales et réglementaires d'Evolivie
            </p>
          </motion.div>

          {/* Sections */}
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
            className="bg-gradient-evolivie-primary rounded-2xl p-8 text-white text-center mt-12"
          >
            <h3 className="text-2xl font-bold font-poppins mb-4">
              Une question sur nos mentions légales ?
            </h3>
            <p className="text-white text-opacity-90 font-inter mb-6">
              Notre équipe juridique est à votre disposition pour toute clarification
            </p>
            <a
              href="mailto:legal@evolivie.com"
              className="inline-flex items-center px-8 py-4 bg-white text-evolivie-mint font-semibold font-poppins rounded-xl hover:bg-gray-50 transition-colors"
            >
              Nous contacter
            </a>
          </motion.div>

          {/* Date de mise à jour */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500 font-inter">
              Dernière mise à jour : 15 janvier 2024
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LegalPage;