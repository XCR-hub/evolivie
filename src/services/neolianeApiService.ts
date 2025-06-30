// Service pour gérer les appels à l'API Neoliane avec proxy CORS
export interface TarificationRequest {
  dateEffet: string;
  codePostal: string;
  anneeNaissance: number;
  regime: string;
  conjoint?: {
    anneeNaissance: number;
    regime: string;
  };
  enfants?: Array<{
    anneeNaissance: number;
  }>;
}

export interface CartRequest {
  total_amount?: string;
  profile: {
    date_effect: {
      year: number;
      month: number;
      day: number;
    };
    zipcode: string;
    members: Array<{
      concern: string;
      birthyear: string;
      regime: string;
      products: Array<{
        product_id: string;
        formula_id: string;
      }>;
    }>;
  };
}

export interface SubscriptionRequest {
  lead_id: string;
  signtype: string;
  features?: string[];
}

export interface StepConcernRequest {
  members: Array<{
    is_politically_exposed: number;
    gender: string;
    lastname: string;
    firstname: string;
    regime: string;
    birthdate: {
      day: string;
      month: string;
      year: string;
    };
    birthplace: string;
    birthzipcode: string;
    birthcountry: string;
    csp: string;
    numss: string;
    numorganisme: string;
  }>;
  streetnumber: string;
  street: string;
  streetbis: string;
  zipcode: string;
  city: string;
  email: string;
  phone: string;
}

export interface StepBankRequest {
  details: Array<{
    levydate: string;
    levyfrequency: string;
    iban: string;
    bic: string;
    isDifferentFromStepConcern: string;
  }>;
}

export interface Product {
  gammeId: number;
  gammeLabel: string | null;
  type: string;
  formulas?: ProductFormula[];
}

export interface ProductFormula {
  formulaId: number;
  formulaLabel: string | null;
  price?: number;
  guarantees?: Array<{
    name: string;
    level: string;
  }>;
}

export interface ProductDocument {
  documentId: number;
  enumDocumentTypeId: number;
  filename: string;
  thumbnail: string | null;
  fileExtension: string | null;
  pages: string | null;
  label: string | null;
}

export interface Offre {
  nom: string;
  prix: number;
  garanties: Array<{
    nom: string;
    niveau: string;
  }>;
  product_id?: string;
  formula_id?: string;
  formulaId?: number;
  gammeId?: number;
  documents?: ProductDocument[];
}

export interface TarificationResponse {
  success: boolean;
  offres: Offre[];
  message?: string;
}

export interface SubscriptionFlowState {
  step: 'cart' | 'subscription' | 'stepconcern' | 'stepbank' | 'documents' | 'validation' | 'completed';
  lead_id?: string;
  subscription_id?: string;
  token?: string;
  contracts?: any[];
  required_docs?: any[];
  currentstep?: number;
  totalstep?: number;
}

class NeolianeApiService {
  private clientId = 'e543ff562ad33f763ad9220fe9110bf59c7ebd3736d618f1dc699632a86165eb';
  private clientSecret = '4db90db4a8c18212469a925612ba497e033d83497620133c606e9fe777302f6b';
  private userKey = '9162f8b63e4fc4778d0d5c66a6fd563bb87185ed2a02abd172fa586c8668f4b2';
  private baseUrl = 'https://api.neoliane.fr';
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    console.log('🔧 Service Neoliane API initialisé');
  }

  // Méthode pour créer un proxy CORS simple
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      // En cas d'erreur CORS, utiliser un proxy
      console.warn('Erreur CORS détectée, utilisation du proxy:', error.message);
      return this.makeProxyRequest(endpoint, options);
    }
  }

  // Proxy CORS de secours
  private async makeProxyRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${this.baseUrl}${endpoint}`;
    
    const response = await fetch(proxyUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Proxy Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  // Authentification
  public async authenticate(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry - 300000) {
      return this.accessToken;
    }

    try {
      console.log('🔐 Authentification en cours...');
      
      const response = await this.makeRequest('/nws/public/v1/auth/token', {
        method: 'POST',
        body: JSON.stringify({
          grant_type: 'api_key',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          user_key: this.userKey
        })
      });

      if (response.access_token) {
        this.accessToken = response.access_token;
        this.tokenExpiry = response.expires_in * 1000;
        console.log('✅ Authentification réussie');
        return this.accessToken;
      } else {
        throw new Error('Token d\'accès non reçu');
      }
    } catch (error) {
      console.error('❌ Erreur d\'authentification:', error);
      throw error;
    }
  }

  // Vérifier le statut de l'API (cœur qui bat)
  public async checkApiStatus(): Promise<boolean> {
    try {
      await this.authenticate();
      return true;
    } catch (error) {
      console.error('❌ API non disponible:', error);
      return false;
    }
  }

  // Récupérer la liste des produits
  public async getProducts(): Promise<Product[]> {
    try {
      const token = await this.authenticate();
      const response = await this.makeRequest('/nws/public/v1/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status && response.value) {
        return Array.isArray(response.value) ? response.value : [];
      }
      return [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des produits:', error);
      throw error;
    }
  }

  // Récupérer les documents d'un produit
  public async getProductDocuments(gammeId: number): Promise<ProductDocument[]> {
    try {
      const token = await this.authenticate();
      const response = await this.makeRequest(`/nws/public/v1/api/product/${gammeId}/saledocuments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status && response.value) {
        return response.value;
      }
      return [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des documents:', error);
      throw error;
    }
  }

  // Télécharger un document
  public async downloadDocument(gammeId: number, documentId: number): Promise<string> {
    try {
      const token = await this.authenticate();
      const response = await this.makeRequest(`/nws/public/v1/api/product/${gammeId}/saledocumentcontent/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status && response.value) {
        return response.value; // Base64 content
      }
      throw new Error('Document non trouvé');
    } catch (error) {
      console.error('❌ Erreur lors du téléchargement du document:', error);
      throw error;
    }
  }

  // Créer un panier
  public async createCart(cartData: CartRequest): Promise<any> {
    try {
      const token = await this.authenticate();
      const response = await this.makeRequest('/nws/public/v1/api/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cartData)
      });

      if (response.status && response.value) {
        return response.value;
      }
      throw new Error('Erreur lors de la création du panier');
    } catch (error) {
      console.error('❌ Erreur lors de la création du panier:', error);
      throw error;
    }
  }

  // Créer une souscription
  public async createSubscription(subscriptionData: SubscriptionRequest): Promise<any> {
    try {
      const token = await this.authenticate();
      const response = await this.makeRequest('/nws/public/v1/api/subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subscriptionData)
      });

      if (response.status && response.value) {
        return response.value;
      }
      throw new Error('Erreur lors de la création de la souscription');
    } catch (error) {
      console.error('❌ Erreur lors de la création de la souscription:', error);
      throw error;
    }
  }

  // Soumettre les informations des adhérents
  public async submitStepConcern(subId: string, stepId: string, concernData: StepConcernRequest): Promise<any> {
    try {
      const token = await this.authenticate();
      const response = await this.makeRequest(`/nws/public/v1/api/subscription/${subId}/stepconcern/${stepId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(concernData)
      });

      if (response.status && response.value) {
        return response.value;
      }
      throw new Error('Erreur lors de la soumission des informations adhérents');
    } catch (error) {
      console.error('❌ Erreur stepconcern:', error);
      throw error;
    }
  }

  // Soumettre les informations bancaires
  public async submitStepBank(subId: string, stepId: string, bankData: StepBankRequest): Promise<any> {
    try {
      const token = await this.authenticate();
      const response = await this.makeRequest(`/nws/public/v1/api/subscription/${subId}/stepbank/${stepId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bankData)
      });

      if (response.status && response.value) {
        return response.value;
      }
      throw new Error('Erreur lors de la soumission des informations bancaires');
    } catch (error) {
      console.error('❌ Erreur stepbank:', error);
      throw error;
    }
  }

  // Récupérer l'état d'une souscription
  public async getSubscription(subId: string): Promise<any> {
    try {
      const token = await this.authenticate();
      const response = await this.makeRequest(`/nws/public/v1/api/subscription/${subId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status && response.value) {
        return response.value;
      }
      throw new Error('Erreur lors de la récupération de la souscription');
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la souscription:', error);
      throw error;
    }
  }

  // Upload d'un document
  public async uploadDocument(subId: string, documentData: any): Promise<any> {
    try {
      const token = await this.authenticate();
      const response = await this.makeRequest(`/nws/public/v1/api/subscription/${subId}/document`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(documentData)
      });

      if (response.status && response.value) {
        return response.value;
      }
      throw new Error('Erreur lors de l\'upload du document');
    } catch (error) {
      console.error('❌ Erreur upload document:', error);
      throw error;
    }
  }

  // Valider un contrat
  public async validateContract(contractId: string): Promise<any> {
    try {
      const token = await this.authenticate();
      const response = await this.makeRequest(`/nws/public/v1/api/contract/${contractId}/validate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify([])
      });

      if (response.status && response.value) {
        return response.value;
      }
      throw new Error('Erreur lors de la validation du contrat');
    } catch (error) {
      console.error('❌ Erreur validation contrat:', error);
      throw error;
    }
  }

  // Récupérer les documents pré-remplis
  public async getPrefilledDocuments(subId: string): Promise<Blob> {
    try {
      const token = await this.authenticate();
      const response = await fetch(`${this.baseUrl}/nws/public/v1/api/subscription/${subId}/documentdownload`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('❌ Erreur téléchargement documents:', error);
      throw error;
    }
  }

  // Simuler une tarification (à remplacer par la vraie API)
  public async getTarification(request: TarificationRequest): Promise<TarificationResponse> {
    try {
      // Pour l'instant, simulation des offres
      // TODO: Implémenter la vraie logique de tarification avec l'API
      const age = new Date().getFullYear() - request.anneeNaissance;
      const basePrice = this.calculateBasePrice(age, request.regime);
      
      const offres: Offre[] = [
        {
          nom: 'Formule Essentielle',
          prix: Math.round(basePrice * 0.7 * 100) / 100,
          product_id: '538',
          formula_id: '3847',
          gammeId: 538,
          garanties: [
            { nom: 'Hospitalisation', niveau: '100%' },
            { nom: 'Médecine courante', niveau: '70%' },
            { nom: 'Pharmacie', niveau: '65%' }
          ]
        },
        {
          nom: 'Formule Confort',
          prix: Math.round(basePrice * 1.0 * 100) / 100,
          product_id: '539',
          formula_id: '3848',
          gammeId: 539,
          garanties: [
            { nom: 'Hospitalisation', niveau: '100%' },
            { nom: 'Médecine courante', niveau: '100%' },
            { nom: 'Pharmacie', niveau: '80%' },
            { nom: 'Optique', niveau: '150€/an' }
          ]
        },
        {
          nom: 'Formule Premium',
          prix: Math.round(basePrice * 1.4 * 100) / 100,
          product_id: '540',
          formula_id: '3849',
          gammeId: 540,
          garanties: [
            { nom: 'Hospitalisation', niveau: '100%' },
            { nom: 'Médecine courante', niveau: '100%' },
            { nom: 'Pharmacie', niveau: '100%' },
            { nom: 'Optique', niveau: '300€/an' },
            { nom: 'Dentaire', niveau: '200%' }
          ]
        }
      ];

      return {
        success: true,
        offres
      };
    } catch (error) {
      console.error('❌ Erreur tarification:', error);
      throw error;
    }
  }

  private calculateBasePrice(age: number, regime: string): number {
    let basePrice = 45;

    // Ajustement selon l'âge
    if (age < 25) basePrice *= 0.8;
    else if (age < 35) basePrice *= 0.9;
    else if (age < 45) basePrice *= 1.0;
    else if (age < 55) basePrice *= 1.2;
    else if (age < 65) basePrice *= 1.5;
    else basePrice *= 2.0;

    // Ajustement selon le régime
    switch (regime) {
      case 'TNS Indépendant': basePrice *= 1.1; break;
      case 'Retraité salarié':
      case 'Retraité TNS': basePrice *= 1.3; break;
      case 'Etudiant': basePrice *= 0.7; break;
      case 'Sans emploi': basePrice *= 0.8; break;
    }

    return basePrice;
  }

  // Mapper les régimes pour l'API
  public mapRegimeToApiValue(regime: string): string {
    const regimeMap: { [key: string]: string } = {
      'Salarié': '1',
      'TNS Indépendant': '2',
      'Exploitant agricole': '3',
      'Retraité salarié': '4',
      'Retraité TNS': '5',
      'Etudiant': '6',
      'Sans emploi': '7',
      'Alsace-Moselle': '8',
      'Fonctionnaire': '9',
      'Enseignant': '10',
      'Expatrié': '11',
      'Salarié Agricole': '12'
    };
    
    return regimeMap[regime] || '1';
  }

  // Mapper les CSP
  public mapCSP(regime: string): string {
    const cspMap: { [key: string]: string } = {
      'Salarié': '11',
      'TNS Indépendant': '16',
      'Exploitant agricole': '16',
      'Retraité salarié': '20',
      'Retraité TNS': '26',
      'Etudiant': '23',
      'Sans emploi': '27',
      'Alsace-Moselle': '11',
      'Fonctionnaire': '13',
      'Enseignant': '13',
      'Expatrié': '27',
      'Salarié Agricole': '11'
    };
    
    return cspMap[regime] || '11';
  }
}

export const neolianeApiService = new NeolianeApiService();