import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Upload, Eye, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';

interface Document {
  id: string;
  type: string;
  filename: string;
  file_size: number;
  uploaded_at: string;
}

interface DocumentManagerProps {
  subscriptionId: string;
  onDocumentUpload?: (document: Document) => void;
  onDocumentDelete?: (documentId: string) => void;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  subscriptionId,
  onDocumentUpload,
  onDocumentDelete
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const documentTypes = [
    { value: 'BA', label: 'Bulletin d\'adhésion', required: true },
    { value: 'SEPA', label: 'Mandat SEPA', required: true },
    { value: 'MANDAT_RESILIATION', label: 'Mandat de résiliation', required: false },
    { value: 'PREFILLED', label: 'Documents pré-remplis', required: false }
  ];

  useEffect(() => {
    loadDocuments();
  }, [subscriptionId]);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des documents:', error);
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, type: string) => {
    if (!file) return;

    // Validation du fichier
    if (file.size > 10 * 1024 * 1024) { // 10MB max
      toast.error('Le fichier est trop volumineux (max 10MB)');
      return;
    }

    if (!file.type.includes('pdf')) {
      toast.error('Seuls les fichiers PDF sont acceptés');
      return;
    }

    setUploading(true);

    try {
      // Convertir le fichier en base64
      const base64Content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Enlever le préfixe data:
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Sauvegarder en base
      const { data, error } = await supabase
        .from('documents')
        .insert({
          subscription_id: subscriptionId,
          type,
          filename: file.name,
          content: base64Content,
          file_size: file.size
        })
        .select()
        .single();

      if (error) throw error;

      setDocuments(prev => [data, ...prev]);
      onDocumentUpload?.(data);
      toast.success('Document uploadé avec succès');
    } catch (error: any) {
      console.error('Erreur lors de l\'upload:', error);
      toast.error('Erreur lors de l\'upload du document');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      onDocumentDelete?.(documentId);
      toast.success('Document supprimé');
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleDownloadDocument = async (document: Document) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('content')
        .eq('id', document.id)
        .single();

      if (error) throw error;

      // Convertir le base64 en blob et télécharger
      const byteCharacters = atob(data.content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = document.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Document téléchargé');
    } catch (error: any) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType?.label || type;
  };

  const isDocumentTypeUploaded = (type: string) => {
    return documents.some(doc => doc.type === type);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <FileText className="text-blue-600 mr-3" size={24} />
        <h2 className="text-xl font-semibold">Gestion des documents</h2>
      </div>

      {/* Types de documents requis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {documentTypes.map((docType) => {
          const isUploaded = isDocumentTypeUploaded(docType.value);
          
          return (
            <div
              key={docType.value}
              className={`border-2 border-dashed rounded-lg p-4 transition-all ${
                isUploaded 
                  ? 'border-green-300 bg-green-50' 
                  : docType.required 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{docType.label}</h3>
                {isUploaded ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : docType.required ? (
                  <AlertCircle className="text-red-600" size={20} />
                ) : null}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {docType.required ? 'Document obligatoire' : 'Document optionnel'}
              </p>

              {!isUploaded && (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, docType.value);
                      }
                    }}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    <Upload className="mr-2" size={16} />
                    <span className="text-sm">
                      {uploading ? 'Upload...' : 'Choisir un fichier'}
                    </span>
                  </div>
                </label>
              )}
            </div>
          );
        })}
      </div>

      {/* Liste des documents uploadés */}
      {documents.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Documents uploadés</h3>
          <div className="space-y-3">
            {documents.map((document) => (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center flex-1">
                  <FileText className="text-blue-600 mr-3" size={20} />
                  <div>
                    <h4 className="font-medium text-gray-900">{document.filename}</h4>
                    <p className="text-sm text-gray-600">
                      {getDocumentTypeLabel(document.type)} • {formatFileSize(document.file_size)} • 
                      {new Date(document.uploaded_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownloadDocument(document)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Télécharger"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(document.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {documents.length === 0 && (
        <div className="text-center py-8">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun document uploadé
          </h3>
          <p className="text-gray-600">
            Commencez par uploader les documents requis ci-dessus
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;