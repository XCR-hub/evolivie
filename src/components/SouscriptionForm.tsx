import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';
import { validateIBAN } from '../utils/validateIBAN';

const SouscriptionForm: React.FC = () => {
  const navigate = useNavigate();
  const { selectedProduct, selectedFormula } = useSubscription();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [iban, setIban] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      if (!validateIBAN(iban)) return alert('IBAN invalide');
      navigate('/confirmation');
    }
  };

  if (!selectedProduct || !selectedFormula) {
    return <p className="p-4">Aucune formule sélectionnée.</p>;
  }

  return (
    <form onSubmit={handleNext} className="max-w-md mx-auto p-4 space-y-4">
      {step === 1 && (
        <div className="space-y-2">
          <h3 className="font-bold">Informations de contact</h3>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2" />
        </div>
      )}
      {step === 2 && (
        <div className="space-y-2">
          <h3 className="font-bold">Informations bancaires</h3>
          <input value={iban} onChange={(e) => setIban(e.target.value)} placeholder="IBAN" className="w-full border p-2" />
        </div>
      )}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {step === 1 ? 'Suivant' : 'Valider'}
      </button>
    </form>
  );
};

export default SouscriptionForm;
