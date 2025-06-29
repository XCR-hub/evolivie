import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Phone, Mail, MapPin, ExternalLink, Award } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-evolivie-mint to-evolivie-mint-light rounded-xl flex items-center justify-center mr-3">
                <Heart className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-poppins">Evolivie</h3>
                <p className="text-xs text-gray-400">Votre mutuelle santé</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Evolivie, une marque du groupe EXCELLENCE COVERAGE RISKS XCR, 
              révolutionne l'assurance santé avec des solutions 100% digitales.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Award size={16} />
              <span>ORIAS n° 11 061 425</span>
            </div>
            <p className="text-xs text-gray-500">
              Représenté par M. Tony CERDA
            </p>
          </div>

          {/* Produits */}
          <div>
            <h3 className="text-lg font-semibold font-poppins mb-4">Nos solutions</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/simulation" className="text-gray-300 hover:text-evolivie-mint transition-colors flex items-center">
                  <Shield size={14} className="mr-2" />
                  Mutuelle particuliers
                </Link>
              </li>
              <li>
                <Link to="/simulation" className="text-gray-300 hover:text-evolivie-mint transition-colors flex items-center">
                  <Shield size={14} className="mr-2" />
                  Mutuelle TNS
                </Link>
              </li>
              <li>
                <Link to="/simulation" className="text-gray-300 hover:text-evolivie-mint transition-colors flex items-center">
                  <Shield size={14} className="mr-2" />
                  Mutuelle famille
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-evolivie-mint transition-colors">
                  Guides et conseils
                </Link>
              </li>
            </ul>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="text-lg font-semibold font-poppins mb-4">Liens utiles</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/simulation" className="text-gray-300 hover:text-evolivie-mint transition-colors">
                  Faire une simulation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-evolivie-mint transition-colors">
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link to="/mentions-legales" className="text-gray-300 hover:text-evolivie-mint transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/conditions-generales" className="text-gray-300 hover:text-evolivie-mint transition-colors">
                  Conditions générales
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.orias.fr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-evolivie-mint transition-colors flex items-center"
                >
                  Registre ORIAS
                  <ExternalLink size={12} className="ml-1" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold font-poppins mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-evolivie-mint flex-shrink-0" />
                <div>
                  <p className="text-gray-300">01 80 85 57 86</p>
                  <p className="text-xs text-gray-400">Lun-Ven 9h-18h</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-evolivie-mint flex-shrink-0" />
                <div>
                  <p className="text-gray-300">contact@evolivie.com</p>
                  <p className="text-xs text-gray-400">Réponse sous 24h</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-evolivie-mint flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-300">2 Avenue Gallieni</p>
                  <p className="text-gray-300">77000 Melun, France</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partenaires et certifications */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center mb-6">
            <h4 className="text-sm font-medium font-poppins text-gray-400 mb-4">Nos partenaires de confiance</h4>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-xs text-gray-500 px-4 py-2 border border-gray-700 rounded-lg">
                Neoliane
              </div>
              <div className="text-xs text-gray-500 px-4 py-2 border border-gray-700 rounded-lg">
                L'ÉQUITÉ
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Evolivie - Groupe EXCELLENCE COVERAGE RISKS XCR. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/mentions-legales" className="text-gray-400 hover:text-evolivie-mint text-sm transition-colors">
              Mentions légales
            </Link>
            <Link to="/conditions-generales" className="text-gray-400 hover:text-evolivie-mint text-sm transition-colors">
              CGV
            </Link>
            <a 
              href="#" 
              className="text-gray-400 hover:text-evolivie-mint text-sm transition-colors"
            >
              Politique de confidentialité
            </a>
          </div>
        </div>

        {/* Disclaimer ORIAS */}
        <div className="border-t border-gray-800 mt-6 pt-6">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Evolivie est un courtier en assurance inscrit à l'ORIAS sous le numéro 11 061 425. 
            Contrôlé par l'ACPR - 4 Place de Budapest - CS 92459 - 75436 Paris Cedex 09.
            <br />
            Les informations recueillies font l'objet d'un traitement informatique destiné à la gestion de votre demande de devis.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;