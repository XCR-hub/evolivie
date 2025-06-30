import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, FileText, CreditCard, Upload, Shield } from 'lucide-react';

interface SubscriptionStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'error';
  icon: React.ComponentType<any>;
}

interface SubscriptionTrackerProps {
  currentStep: string;
  subscriptionId?: string;
  onStepClick?: (stepId: string) => void;
}

const SubscriptionTracker: React.FC<SubscriptionTrackerProps> = ({
  currentStep,
  subscriptionId,
  onStepClick
}) => {
  const [steps, setSteps] = useState<SubscriptionStep[]>([
    {
      id: 'stepconcern',
      title: 'Informations personnelles',
      description: 'Vos données personnelles et celles de vos bénéficiaires',
      status: 'pending',
      icon: FileText
    },
    {
      id: 'stepbank',
      title: 'Informations bancaires',
      description: 'Coordonnées bancaires pour le prélèvement',
      status: 'pending',
      icon: CreditCard
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Signature et upload des documents contractuels',
      status: 'pending',
      icon: Upload
    },
    {
      id: 'completed',
      title: 'Souscription finalisée',
      description: 'Votre contrat est actif',
      status: 'pending',
      icon: Shield
    }
  ]);

  useEffect(() => {
    setSteps(prevSteps => 
      prevSteps.map(step => {
        if (step.id === currentStep) {
          return { ...step, status: 'current' };
        } else if (shouldBeCompleted(step.id, currentStep)) {
          return { ...step, status: 'completed' };
        } else {
          return { ...step, status: 'pending' };
        }
      })
    );
  }, [currentStep]);

  const shouldBeCompleted = (stepId: string, currentStepId: string): boolean => {
    const stepOrder = ['stepconcern', 'stepbank', 'stepfuneral', 'stepcancellation', 'documents', 'completed'];
    const stepIndex = stepOrder.indexOf(stepId);
    const currentIndex = stepOrder.indexOf(currentStepId);
    return stepIndex < currentIndex;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600 text-white';
      case 'current': return 'bg-blue-600 text-white';
      case 'error': return 'bg-red-600 text-white';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'current': return Clock;
      case 'error': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center mb-6">
        <Shield className="text-blue-600 mr-3" size={24} />
        <h2 className="text-xl font-semibold">Suivi de votre souscription</h2>
        {subscriptionId && (
          <span className="ml-auto text-sm text-gray-500">
            ID: {subscriptionId.slice(-8)}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const StatusIcon = getStatusIcon(step.status);
          const StepIcon = step.icon;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
                step.status === 'current' 
                  ? 'border-blue-500 bg-blue-50' 
                  : step.status === 'completed'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onStepClick?.(step.id)}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${getStatusColor(step.status)}`}>
                {step.status === 'completed' ? (
                  <CheckCircle size={24} />
                ) : step.status === 'current' ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock size={24} />
                  </motion.div>
                ) : (
                  <StepIcon size={24} />
                )}
              </div>

              <div className="flex-1">
                <h3 className={`font-semibold ${
                  step.status === 'current' ? 'text-blue-900' : 
                  step.status === 'completed' ? 'text-green-900' : 'text-gray-900'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-sm ${
                  step.status === 'current' ? 'text-blue-700' : 
                  step.status === 'completed' ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {step.description}
                </p>
              </div>

              {step.status === 'current' && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-3 h-3 bg-blue-600 rounded-full"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {currentStep === 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center">
            <CheckCircle className="text-green-600 mr-3" size={24} />
            <div>
              <h4 className="font-semibold text-green-900">Félicitations !</h4>
              <p className="text-green-700 text-sm">
                Votre souscription est terminée. Vous recevrez un email de confirmation.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SubscriptionTracker;