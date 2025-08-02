import { Profile, Product, Formula } from '../types';
import { formatDate } from '../utils/formatDate';

const PROXY_URL = 'https://evolivie.com/proxy-neoliane.php';

interface ProxyPayload {
  action: string;
  endpoint: string;
  method: 'GET' | 'POST';
  token: string;
  body?: any;
}

async function callProxy<T>(payload: ProxyPayload): Promise<T> {
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Proxy error');
  }
  return res.json();
}

export async function getProducts(token: string): Promise<Product[]> {
  const data = await callProxy<{ value: Product[] }>({
    action: 'neoliane',
    endpoint: '/api/products',
    method: 'GET',
    token,
  });
  return data.value;
}

export async function createCart(profile: Profile, token: string) {
  const dateEffect = formatDate(new Date(Date.now() + 86400000));
  const body = {
    total_amount: '1',
    profile: {
      date_effect: dateEffect,
      zipcode: profile.zipcode,
      producttype: 'sante',
      members: [
        {
          concern: 'a1',
          birthyear: profile.birthyear,
          regime: profile.regime,
        },
      ],
    },
  };
  return callProxy<any>({
    action: 'neoliane',
    endpoint: '/api/cart',
    method: 'POST',
    token,
    body,
  });
}

export async function getProductsWithFormulas(profile: Profile, token: string): Promise<Product[]> {
  const products = await getProducts(token);
  const cart = await createCart(profile, token);
  const memberProducts = cart.value.profile.members[0].products as { product_id: number; formula_id: number; price: string; }[];
  return products.map(p => {
    const formulas: Formula[] = memberProducts
      .filter(m => m.product_id === p.gammeId)
      .map(m => ({ formula_id: m.formula_id, price: parseFloat(m.price) }));
    return { ...p, formulas };
  });
}
