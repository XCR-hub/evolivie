import React, { createContext, useContext, useState } from 'react';
import { Profile, Product, Formula } from '../types';

interface SubscriptionContextValue {
  profile?: Profile;
  selectedProduct?: Product;
  selectedFormula?: Formula;
  setProfile: (p: Profile) => void;
  setSelection: (product: Product, formula: Formula) => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<Profile | undefined>(() => {
    const stored = localStorage.getItem('profile');
    return stored ? JSON.parse(stored) : undefined;
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [selectedFormula, setSelectedFormula] = useState<Formula | undefined>();

  const setProfile = (p: Profile) => {
    setProfileState(p);
    localStorage.setItem('profile', JSON.stringify(p));
  };

  const setSelection = (product: Product, formula: Formula) => {
    setSelectedProduct(product);
    setSelectedFormula(formula);
    localStorage.setItem('selection', JSON.stringify({ product, formula }));
  };

  return (
    <SubscriptionContext.Provider value={{ profile, selectedProduct, selectedFormula, setProfile, setSelection }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
};
