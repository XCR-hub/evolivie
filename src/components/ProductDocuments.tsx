import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FileText, Download, Loader2, AlertCircle, X } from 'lucide-react';
import { neolianeService, type ProductDocument, type Offre } from '../services/neolianeService';

interface ProductDocumentsProps {
  offre: Offre;
  onClose: () => void;
}

const ProductDocuments: React.FC<ProductDocumentsProps> = ({ offre, onClose }) => {
  const [documents, setDocuments] = useState<ProductDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingDoc, setDownloadingDoc] = useState<number | null>(null);

  useEffect(() => {
    loadDocuments();
  }, [offre.gammeId]);

  const loadDocuments = async () => {
    if (!offre.gammeId) {
      setError('ID de gamme manquant pour ce produit');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const docs = await neolianeService.getProductDocuments(offre.gammeId);
      setDocuments(docs);
      toast.success('Documents chargés avec succès !');
    } catch (err: any) {
      console.error('Erreur lors du chargement des documents:', err);
      const errorMessage = `Erreur lors du chargement des documents: ${err.message}`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (doc: ProductDocument) => {
    if (!offre.gammeId) {
      setError('ID de gamme manquant');
      toast.error('ID de gamme manquant');
      return;
    }

    try {
      setDownloadingDoc(doc.documentId);
      setError('');
      
      await neolianeService.downloadDocument(
        offre.gammeId,
        doc.documentId,
        doc.filename
      );
      
      toast.success(`Document ${doc.filename} téléchargé avec succès !`);
    } catch (err: any) {
      console.error('Erreur lors du téléchargement:', err);
      const errorMessage = `Erreur lors du téléchargement: ${err.message}`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDownloadingDoc(null);
    }
  };

  const getDocumentTypeIcon = (enumDocumentTypeId: number) => {
    switch (enumDocumentTypeId) {
      case 1:
        return '📋'; // Notice d'information
      case 2:
        return '📜'; // Conditions générales
      case 3:
        return '📊'; // Tableau des garanties
      case 4:
        return '📄'; // Fiche produit
      default:
        return '📄';
    }
  };

  const getDocumentTypeColor = (enumDocumentTypeId: number) => {
    switch (enumDocumentTypeId) {
      case 1:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 2:
        return 'bg-green-50 text-green-700 border-green-200';
      case 3:
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 4:
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileText className="text-blue-600 mr-3" size={24} />
            <div>
              <h3 className="text-lg font-semibold">Documents commerciaux</h3>
              <p className="text-gray-600 text-sm">{offre.nom}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-600 mr-3" size={24} />
            <span className="text-gray-600">Chargement des documents...</span>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center">
              <AlertCircle className="text-red-600 mr-3" size={20} />
              <div>
                <h4 className="text-red-800 font-medium">Erreur</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !error && documents.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h4 className="text-gray-600 font-medium mb-2">Aucun document disponible</h4>
            <p className="text-gray-500 text-sm">
              Aucun document commercial n'est disponible pour ce produit.
            </p>
          </div>
        )}

        {!loading && !error && documents.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <motion.div
                  key={doc.documentId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border rounded-lg p-4 hover:shadow-md transition-all ${getDocumentTypeColor(doc.enumDocumentTypeId)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">
                          {getDocumentTypeIcon(doc.enumDocumentTypeId)}
                        </span>
                        <div>
                          <h4 className="font-medium text-sm">
                            {doc.label || doc.filename}
                          </h4>
                          <p className="text-xs opacity-75">
                            {doc.filename}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs opacity-75 space-x-4">
                        {doc.fileExtension && (
                          <span className="uppercase font-medium">
                            {doc.fileExtension}
                          </span>
                        )}
                        {doc.pages && (
                          <span>
                            {doc.pages} page{parseInt(doc.pages) > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleDownloadDocument(doc)}
                        disabled={downloadingDoc === doc.documentId}
                        className="flex items-center px-3 py-2 bg-white border border-current rounded-lg hover:bg-opacity-10 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {downloadingDoc === doc.documentId ? (
                          <Loader2 className="animate-spin mr-2" size={14} />
                        ) : (
                          <Download className="mr-2" size={14} />
                        )}
                        {downloadingDoc === doc.documentId ? 'Téléchargement...' : 'Télécharger'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-start">
                <AlertCircle className="text-blue-600 mr-3 mt-0.5" size={16} />
                <div>
                  <h5 className="font-medium text-blue-800 mb-1">Information</h5>
                  <p className="text-blue-700 text-sm">
                    Ces documents contiennent toutes les informations importantes sur le produit : 
                    garanties, conditions générales, modalités de souscription et tarifs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductDocuments;