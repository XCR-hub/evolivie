import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (base64Content: string) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  acceptedTypes = ['application/pdf'],
  maxSize = 5 * 1024 * 1024, // 5MB default
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Type de fichier non supporté. Types acceptés: ${acceptedTypes.join(', ')}`;
    }
    
    if (file.size > maxSize) {
      return `Fichier trop volumineux. Taille maximum: ${Math.round(maxSize / 1024 / 1024)}MB`;
    }
    
    return null;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get only the base64 content
        const base64Content = result.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFile = async (file: File) => {
    setError('');
    setUploading(true);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setUploading(false);
      return;
    }

    try {
      const base64Content = await convertToBase64(file);
      onFileUpload(base64Content);
    } catch (err) {
      setError('Erreur lors de la lecture du fichier');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="space-y-4">
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600 mt-2">Upload en cours...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                {isDragOver ? (
                  <File className="h-12 w-12 text-blue-500" />
                ) : (
                  <Upload className="h-12 w-12 text-gray-400" />
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {isDragOver ? 'Déposez le fichier ici' : 'Cliquez pour sélectionner ou glissez-déposez'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF uniquement, max {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center text-red-600 text-sm"
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;