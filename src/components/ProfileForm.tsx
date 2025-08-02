import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';
import { Profile } from '../types';

const ProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile } = useSubscription();
  const [form, setForm] = useState<Profile>({ birthyear: '', zipcode: '', regime: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(form);
    navigate('/offres');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <input name="birthyear" value={form.birthyear} onChange={handleChange} placeholder="Année de naissance" className="w-full border p-2" />
      <input name="zipcode" value={form.zipcode} onChange={handleChange} placeholder="Code postal" className="w-full border p-2" />
      <select name="regime" value={form.regime} onChange={handleChange} className="w-full border p-2">
        <option value="">Régime</option>
        <option value="1">Salarié</option>
        <option value="2">TNS</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Voir les offres</button>
    </form>
  );
};

export default ProfileForm;
