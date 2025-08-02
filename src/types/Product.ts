import { Formula } from './Formula';

export interface Product {
  gammeId: number;
  gammeLabel: string;
  type: string;
  formulas?: Formula[];
}
