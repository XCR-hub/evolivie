import React, { useEffect, useState } from 'react';
import OfferCard from '../components/OfferCard';
import { getProductsWithFormulas } from '../services/NeolianeService';
import { useSubscription } from '../context/SubscriptionContext';
import { Product } from '../types';

const Offers: React.FC = () => {
  const { profile } = useSubscription();
  const [offers, setOffers] = useState<Product[]>([]);
  const token = import.meta.env.VITE_NEOLIANE_TOKEN as string;

  useEffect(() => {
    if (profile) {
      getProductsWithFormulas(profile, token).then(setOffers).catch(console.error);
    }
  }, [profile, token]);

  if (!profile) return <p className="p-4">Profil manquant.</p>;

  return (
    <div className="p-4 space-y-4">
      {offers.map((p) => (
        <OfferCard key={p.gammeId} product={p} />
      ))}
    </div>
  );
};

export default Offers;
