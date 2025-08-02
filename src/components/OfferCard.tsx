import React from 'react';
import { Product, Formula } from '../types';
import { useSubscription } from '../context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  product: Product;
}

const OfferCard: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();
  const { setSelection } = useSubscription();

  return (
    <div className="border p-4 rounded space-y-2">
      <h3 className="font-bold">{product.gammeLabel}</h3>
      {product.formulas?.map((f) => (
        <div key={f.formula_id} className="flex justify-between items-center">
          <span>Formule {f.formula_id}</span>
          <span>{f.price} €</span>
          <button
            className="bg-green-600 text-white px-2 py-1 rounded"
            onClick={() => {
              setSelection(product, f);
              navigate('/souscription');
            }}
          >
            Souscrire
          </button>
        </div>
      ))}
    </div>
  );
};

export default OfferCard;
