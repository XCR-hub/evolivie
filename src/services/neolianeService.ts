// Service pour gérer les appels à l'API Neoliane via simulation locale
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
    gender?: string;
    lastname?: string;
    firstname?: string;
    streetnumber?: string;
    street?: string;
    streetbis?: string;
    zipcode?: string;
    city?: string;
    country?: string;
  }>;
}

// Interfaces pour l'API Editique
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

export interface ApiResponse<T> {
  status: boolean;
  error?: string | null;
  value: T;
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
  steps?: { [key: string]: string };
  form?: any;
  save?: any;
  validate?: any;
}

class NeolianeService {
  // Clés API intégrées directement dans le service (mais non utilisées en mode simulation)
  private clientId = 'e543ff562ad33f763ad9220fe9110bf59c7ebd3736d618f1dc699632a86165eb';
  private clientSecret = '4db90db4a8c18212469a925612ba497e033d83497620133c606e9fe777302f6b';
  private userKey = '9162f8b63e4fc4778d0d5c66a6fd563bb87185ed2a02abd172fa586c8668f4b2';
  private accessToken: string | null = 'simulated_token_' + Date.now();
  private tokenExpiry: number = Date.now() + 3600000; // 1 heure
  private simulationMode = true; // Mode simulation activé

  constructor() {
    console.log('🔧 Service Neoliane initialisé en mode SIMULATION - Version 6.0');
    console.log('🔑 Clé API pré-configurée (non utilisée en mode simulation)');
  }

  // Méthode pour faire des requêtes simulées
  private async simulateRequest(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
    console.log(`🔄 Simulation d'appel API: ${method} ${endpoint}`);
    console.log('📤 Données envoyées:', data);
    
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Générer une réponse simulée selon l'endpoint
    if (endpoint.includes('/auth/token')) {
      return {
        access_token: 'simulated_token_' + Date.now(),
        expires_in: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'Bearer'
      };
    }
    
    if (endpoint.includes('/api/products')) {
      return {
        status: true,
        error: null,
        value: this.getSimulatedProducts()
      };
    }
    
    if (endpoint.includes('/saledocuments')) {
      return {
        status: true,
        error: null,
        value: this.getSimulatedDocuments()
      };
    }
    
    if (endpoint.includes('/saledocumentcontent/')) {
      return {
        status: true,
        error: null,
        value: 'JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PCAvVHlwZSAvWE9iamVjdCAvU3VidHlwZSAvSW1hZ2UgL1dpZHRoIDEyMDAgL0hlaWdodCAxODAwIC9CaXRzUGVyQ29tcG9uZW50IDggL0NvbG9yU3BhY2UgL0RldmljZVJHQiAvRmlsdGVyIC9EQ1REZWNvZGUgL0xlbmd0aCA2IDAgUiA+PgpzdHJlYW0K'
      };
    }
    
    if (endpoint.includes('/api/cart') && method === 'POST') {
      return {
        status: true,
        error: null,
        value: {
          lead_id: 'sim_lead_' + Date.now(),
          token: 'sim_token_' + Date.now()
        }
      };
    }
    
    if (endpoint.includes('/api/subscription') && method === 'POST') {
      return {
        status: true,
        error: null,
        value: {
          lead_id: data.lead_id,
          id: 'sim_sub_' + Date.now(),
          user_id: '1',
          currentstep: '1',
          totalstep: '2',
          steps: {
            '1': 'Stepconcern',
            '2': 'Stepbank'
          },
          form: {
            method: 'GET',
            url: '/api/v1/subscription/15/Stepconcern/15/form'
          },
          save: {
            method: 'PUT',
            url: '/api/v1/subscription/15/Stepconcern/15'
          },
          validate: {
            method: 'PUT',
            url: '/api/v1/subscription/15/Stepconcern/15'
          },
          signtype: '1',
          required_docs: null,
          contracts: null
        }
      };
    }
    
    if (endpoint.includes('/stepconcern/') && method === 'PUT') {
      return {
        status: true,
        error: null,
        value: {
          isTemporarySave: null,
          streetnumber: data.streetnumber,
          street: data.street,
          streetbis: data.streetbis,
          zipcode: data.zipcode,
          city: data.city,
          email: data.email,
          phone: data.phone,
          members: data.members
        }
      };
    }
    
    if (endpoint.includes('/stepbank/') && method === 'PUT') {
      return {
        status: true,
        error: null,
        value: {
          isTemporarySave: null,
          details: data.details
        }
      };
    }
    
    if (endpoint.includes('/api/subscription/') && !endpoint.includes('/stepconcern/') && !endpoint.includes('/stepbank/')) {
      return {
        status: true,
        error: null,
        value: {
          lead_id: 'sim_lead_123',
          id: 'sim_sub_123',
          user_id: '1',
          currentstep: '2',
          totalstep: '2',
          steps: {
            '1': 'Stepconcern',
            '2': 'Stepbank'
          },
          form: {
            method: 'GET',
            url: '/api/v1/subscription/15/stepbank/15/form'
          },
          save: {
            method: 'PUT',
            url: '/api/v1/subscription/15/stepbank/15'
          },
          validate: {
            method: 'PUT',
            url: '/api/v1/subscription/15/stepbank/15'
          },
          signtype: '1',
          required_docs: null,
          contracts: [
            {
              id: 'sim_contract_123',
              subscription_id: 'sim_sub_123',
              status: 'pending'
            }
          ]
        }
      };
    }
    
    if (endpoint.includes('/document') && method === 'POST') {
      return {
        status: true,
        error: null,
        value: {
          id: 'sim_doc_' + Date.now(),
          type: data.type,
          filename: 'document.pdf'
        }
      };
    }
    
    if (endpoint.includes('/contract/') && endpoint.includes('/validate')) {
      return {
        status: true,
        error: null,
        value: {
          id: endpoint.split('/contract/')[1].split('/validate')[0],
          status: 'validated'
        }
      };
    }
    
    // Réponse par défaut
    return {
      status: true,
      error: null,
      value: {}
    };
  }

  // Méthode pour simuler l'authentification
  private async simulateAuthentication(): Promise<string> {
    console.log('🔐 Simulation d\'authentification...');
    
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Générer un token simulé
    this.accessToken = 'simulated_token_' + Date.now();
    this.tokenExpiry = Date.now() + 3600000; // 1 heure
    
    console.log('✅ Authentification simulée réussie');
    return this.accessToken;
  }

  // Méthode pour simuler la liste des produits
  private getSimulatedProducts(): Product[] {
    return [
      {
        gammeId: 538,
        gammeLabel: 'Formule Essentielle TNS',
        type: 'sante',
        formulas: [
          {
            formulaId: 3847,
            formulaLabel: 'Essentielle',
            price: 39.99
          }
        ]
      },
      {
        gammeId: 539,
        gammeLabel: 'Formule Confort TNS',
        type: 'sante',
        formulas: [
          {
            formulaId: 3848,
            formulaLabel: 'Confort',
            price: 59.99
          }
        ]
      },
      {
        gammeId: 540,
        gammeLabel: 'Formule Premium TNS',
        type: 'sante',
        formulas: [
          {
            formulaId: 3849,
            formulaLabel: 'Premium',
            price: 79.99
          }
        ]
      }
    ];
  }

  // Méthode pour simuler les documents d'un produit
  private getSimulatedDocuments(): ProductDocument[] {
    return [
      {
        documentId: 1,
        enumDocumentTypeId: 1,
        filename: 'notice_information.pdf',
        thumbnail: null,
        fileExtension: 'pdf',
        pages: '5',
        label: 'Notice d\'information'
      },
      {
        documentId: 2,
        enumDocumentTypeId: 2,
        filename: 'conditions_generales.pdf',
        thumbnail: null,
        fileExtension: 'pdf',
        pages: '12',
        label: 'Conditions générales'
      },
      {
        documentId: 3,
        enumDocumentTypeId: 3,
        filename: 'tableau_garanties.pdf',
        thumbnail: null,
        fileExtension: 'pdf',
        pages: '3',
        label: 'Tableau des garanties'
      }
    ];
  }

  // Méthode pour l'authentification (réelle ou simulée)
  public async authenticate(): Promise<string> {
    // Vérifier si le token est encore valide (avec une marge de 5 minutes)
    if (this.accessToken && Date.now() < (this.tokenExpiry - 300000)) {
      console.log('🔐 Token existant encore valide');
      return this.accessToken;
    }

    if (this.simulationMode) {
      return this.simulateAuthentication();
    }

    try {
      console.log('🔐 Authentification en cours...');
      
      const response = await fetch('/api/nws/public/v1/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'api_key',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          user_key: this.userKey
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.access_token) {
        this.accessToken = data.access_token;
        // expires_in est un timestamp Unix selon la documentation
        this.tokenExpiry = data.expires_in * 1000;
        
        console.log('✅ Authentification réussie, token valide 1h jusqu\'à:', new Date(this.tokenExpiry));
        return this.accessToken;
      } else {
        throw new Error('Token d\'accès non reçu');
      }
    } catch (error) {
      console.error('❌ Erreur d\'authentification:', error);
      throw error;
    }
  }

  // Récupérer la liste des produits
  public async getProducts(): Promise<Product[]> {
    try {
      console.log('📦 Récupération de la liste des produits...');
      const token = await this.authenticate();
      
      if (this.simulationMode) {
        const response = await this.simulateRequest('/nws/public/v1/api/products');
        return response.value;
      }
      
      const response = await fetch('/api/nws/public/v1/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status && data.value) {
        return Array.isArray(data.value) ? data.value : [];
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
      console.log(`📄 Récupération des documents pour le produit ${gammeId}...`);
      const token = await this.authenticate();
      
      if (this.simulationMode) {
        const response = await this.simulateRequest(`/nws/public/v1/api/product/${gammeId}/saledocuments`);
        return response.value;
      }
      
      const response = await fetch(`/api/nws/public/v1/api/product/${gammeId}/saledocuments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status && data.value) {
        return data.value;
      }
      
      return [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des documents:', error);
      throw error;
    }
  }

  // Télécharger un document
  public async downloadDocument(gammeId: number, documentId: number, filename: string): Promise<void> {
    try {
      console.log(`📄 Téléchargement du document ${documentId}...`);
      const token = await this.authenticate();
      
      if (this.simulationMode) {
        const response = await this.simulateRequest(`/nws/public/v1/api/product/${gammeId}/saledocumentcontent/${documentId}`);
        
        // Créer un PDF vide pour la simulation
        const pdfBlob = new Blob(['%PDF-1.7\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type/Pages/Kids[3 0 R]/Count 1>>\nendobj\n3 0 obj\n<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>/Contents 4 0 R>>\nendobj\n4 0 obj\n<</Length 10>>\nstream\nHello World\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000102 00000 n \n0000000194 00000 n \ntrailer\n<</Size 5/Root 1 0 R>>\nstartxref\n254\n%%EOF'], { type: 'application/pdf' });
        
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        console.log('✅ Document téléchargé avec succès (simulation)');
        return;
      }
      
      const response = await fetch(`/api/nws/public/v1/api/product/${gammeId}/saledocumentcontent/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status && data.value) {
        // Convertir le base64 en blob
        const byteCharacters = atob(data.value);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        console.log('✅ Document téléchargé avec succès');
      } else {
        throw new Error('Document non trouvé');
      }
    } catch (error) {
      console.error('❌ Erreur lors du téléchargement du document:', error);
      throw error;
    }
  }

  // Étape 1: Créer un panier
  public async createCart(cartData: CartRequest): Promise<any> {
    try {
      console.log('🛒 Création du panier...');
      console.log('📤 Données du panier:', JSON.stringify(cartData, null, 2));
      const token = await this.authenticate();
      
      if (this.simulationMode) {
        const response = await this.simulateRequest('/nws/public/v1/api/cart', 'POST', cartData);
        return response.value;
      }
      
      const response = await fetch('/api/nws/public/v1/api/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(cartData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status && data.value) {
        console.log('✅ Panier créé avec succès, lead_id:', data.value.lead_id);
        return data.value;
      }
      
      throw new Error('Erreur lors de la création du panier');
    } catch (error) {
      console.error('❌ Erreur lors de la création du panier:', error);
      throw error;
    }
  }

  // Étape 2: Créer une souscription
  public async createSubscription(subscriptionData: SubscriptionRequest): Promise<any> {
    try {
      console.log('📝 Création de la souscription...');
      console.log('📤 Données de souscription:', JSON.stringify(subscriptionData, null, 2));
      const token = await this.authenticate();
      
      if (this.simulationMode) {
        const response = await this.simulateRequest('/nws/public/v1/api/subscription', 'POST', subscriptionData);
        return response.value;
      }
      
      const response = await fetch('/api/nws/public/v1/api/subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(subscriptionData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status && data.value) {
        console.log('✅ Souscription créée avec succès, id:', data.value.id);
        return data.value;
      }
      
      throw new Error('Erreur lors de la création de la souscription');
    } catch (error) {
      console.error('❌ Erreur lors de la création de la souscription:', error);
      throw error;
    }
  }

  // Étape 3: Soumettre les informations des adhérents (stepconcern)
  public async submitStepConcern(subId: string, stepId: string, concernData: StepConcernRequest): Promise<any> {
    try {
      console.log('👥 Soumission des informations adhérents...');
      console.log('📤 Données stepconcern:', JSON.stringify(concernData, null, 2));
      const token = await this.authenticate();
      
      if (this.simulationMode) {
        const response = await this.simulateRequest(`/nws/public/v1/api/subscription/${subId}/stepconcern/${stepId}`, 'PUT', concernData);
        return response.value;
      }
      
      const response = await fetch(`/api/nws/public/v1/api/subscription/${subId}/stepconcern/${stepId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(concernData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status && data.value) {
        console.log('✅ Informations adhérents soumises avec succès');
        return data.value;
      }
      
      throw new Error('Erreur lors de la soumission des informations adhérents');
    } catch (error) {
      console.error('❌ Erreur stepconcern:', error);
      throw error;
    }
  }

  // Récupération de l'état d'une souscription
  public async getSubscription(subId: string): Promise<any> {
    try {
      console.log('📋 Récupération de l\'état de la souscription...');
      const token = await this.authenticate();
      
      if (this.simulationMode) {
        const response = await this.simulateRequest(`/nws/public/v1/api/subscription/${subId}`);
        return response.value;
      }
      
      const response = await fetch(`/api/nws/public/v1/api/subscription/${subId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status && data.value) {
        console.log('✅ État de la souscription récupéré avec succès');
        return data.value;
      }
      
      throw new Error('Erreur lors de la récupération de la souscription');
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la souscription:', error);
      throw error;
    }
  }

  // Étape 4: Soumettre les informations bancaires (stepbank)
  public async submitStepBank(subId: string, stepId: string, bankData: StepBankRequest): Promise<any> {
    try {
      console.log('🏦 Soumission des informations bancaires...');
      console.log('📤 Données stepbank:', JSON.stringify(bankData, null, 2));
      const token = await this.authenticate();
      
      if (this.simulationMode) {
        const response = await this.simulateRequest(`/nws/public/v1/api/subscription/${subId}/stepbank/${stepId}`, 'PUT', bankData);
        return response.value;
      }
      
      const response = await fetch(`/api/nws/public/v1/api/subscription/${subId}/stepbank/${stepId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(bankData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status && data.value) {
        console.log('✅ Informations bancaires soumises avec succès');
        return data.value;
      }
      
      throw new Error('Erreur lors de la soumission des informations bancaires');
    } catch (error) {
      console.error('❌ Erreur stepbank:', error);
      throw error;
    }
  }

  // Étape 7: Upload d'un document
  public async uploadDocument(subId: string, documentData: any): Promise<any> {
    try {
      console.log('📄 Upload de document...');
      const token = await this.authenticate();
      
      if (this.simulationMode) {
        const response = await this.simulateRequest(`/nws/public/v1/api/subscription/${subId}/document`, 'POST', documentData);
        return response.value;
      }
      
      const response = await fetch(`/api/nws/public/v1/api/subscription/${subId}/document`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(documentData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status && data.value) {
        console.log('✅ Document uploadé avec succès');
        return data.value;
      }
      
      throw new Error('Erreur lors de l\'upload du document');
    } catch (error) {
      console.error('❌ Erreur upload document:', error);
      throw error;
    }
  }

  // Étape 8: Valider un contrat
  public async validateContract(contractId: string): Promise<any> {
    try {
      console.log('✅ Validation du contrat...');
      const token = await this.authenticate();
      
      if (this.simulationMode) {
        const response = await this.simulateRequest(`/nws/public/v1/api/contract/${contractId}/validate`, 'PUT', []);
        return response.value;
      }
      
      const response = await fetch(`/api/nws/public/v1/api/contract/${contractId}/validate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify([])
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status && data.value) {
        console.log('✅ Contrat validé avec succès');
        return data.value;
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
      console.log('📄 Récupération des documents pré-remplis...');
      const token = await this.authenticate();
      
      if (this.simulationMode) {
        // Créer un PDF vide pour la simulation
        const pdfBlob = new Blob(['%PDF-1.7\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type/Pages/Kids[3 0 R]/Count 1>>\nendobj\n3 0 obj\n<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>/Contents 4 0 R>>\nendobj\n4 0 obj\n<</Length 10>>\nstream\nHello World\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000102 00000 n \n0000000194 00000 n \ntrailer\n<</Size 5/Root 1 0 R>>\nstartxref\n254\n%%EOF'], { type: 'application/pdf' });
        console.log('✅ Documents pré-remplis récupérés avec succès (simulation)');
        return pdfBlob;
      }
      
      const response = await fetch(`/api/nws/public/v1/api/subscription/${subId}/documentdownload`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Documents pré-remplis récupérés avec succès');
      return await response.blob();
    } catch (error) {
      console.error('❌ Erreur téléchargement documents:', error);
      throw error;
    }
  }

  // Méthode pour la tarification (simulation)
  public async getTarification(request: TarificationRequest): Promise<TarificationResponse> {
    try {
      console.log('💰 Récupération des offres (SIMULATION)...');
      console.log('📋 Paramètres:', request);

      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Générer des offres simulées
      const age = new Date().getFullYear() - request.anneeNaissance;
      const basePrice = this.calculateBasePrice(age, request.regime);
      
      const formules = [
        {
          nom: 'Formule Essentielle',
          multiplier: 0.7,
          product_id: '538',
          formula_id: '3847',
          gammeId: 538,
          garanties: [
            { nom: 'Hospitalisation', niveau: '100%' },
            { nom: 'Médecine courante', niveau: '70%' },
            { nom: 'Pharmacie', niveau: '65%' },
            { nom: 'Analyses et examens', niveau: '70%' }
          ]
        },
        {
          nom: 'Formule Confort',
          multiplier: 1.0,
          product_id: '539',
          formula_id: '3848',
          gammeId: 539,
          garanties: [
            { nom: 'Hospitalisation', niveau: '100%' },
            { nom: 'Médecine courante', niveau: '100%' },
            { nom: 'Pharmacie', niveau: '80%' },
            { nom: 'Optique', niveau: '150€/an' },
            { nom: 'Analyses et examens', niveau: '100%' }
          ]
        },
        {
          nom: 'Formule Premium',
          multiplier: 1.4,
          product_id: '540',
          formula_id: '3849',
          gammeId: 540,
          garanties: [
            { nom: 'Hospitalisation', niveau: '100%' },
            { nom: 'Médecine courante', niveau: '100%' },
            { nom: 'Pharmacie', niveau: '100%' },
            { nom: 'Optique', niveau: '300€/an' },
            { nom: 'Dentaire', niveau: '200%' },
            { nom: 'Analyses et examens', niveau: '100%' },
            { nom: 'Médecines douces', niveau: '150€/an' }
          ]
        }
      ];

      const offres: Offre[] = formules.map(formule => {
        const prixFinal = this.calculatePriceWithBeneficiaries(
          basePrice * formule.multiplier,
          request.conjoint,
          request.enfants
        );

        return {
          nom: formule.nom,
          prix: Math.round(prixFinal * 100) / 100,
          product_id: formule.product_id,
          formula_id: formule.formula_id,
          gammeId: formule.gammeId,
          garanties: formule.garanties
        };
      });

      console.log(`✅ ${offres.length} offres simulées générées`);

      return {
        success: true,
        offres,
        message: 'Offres simulées (mode démo)'
      };
    } catch (error: any) {
      console.error('❌ Erreur lors de la tarification:', error);
      throw error;
    }
  }

  // Méthode pour calculer le prix en fonction des bénéficiaires
  private calculatePriceWithBeneficiaries(basePrice: number, conjoint?: any, enfants?: any[]): number {
    let totalPrice = basePrice;

    // Ajouter le prix pour le conjoint (généralement 80% du prix principal)
    if (conjoint && conjoint.anneeNaissance) {
      const conjointAge = new Date().getFullYear() - parseInt(conjoint.anneeNaissance);
      let conjointMultiplier = 0.8;
      
      // Ajustement selon l'âge du conjoint
      if (conjointAge > 50) {
        conjointMultiplier = 0.9;
      } else if (conjointAge > 60) {
        conjointMultiplier = 1.0;
      }
      
      totalPrice += basePrice * conjointMultiplier;
    }

    // Ajouter le prix pour les enfants (généralement 30% du prix principal par enfant)
    if (enfants && enfants.length > 0) {
      enfants.forEach(enfant => {
        if (enfant.anneeNaissance) {
          const enfantAge = new Date().getFullYear() - parseInt(enfant.anneeNaissance);
          let enfantMultiplier = 0.3;
          
          // Ajustement selon l'âge de l'enfant
          if (enfantAge > 18) {
            enfantMultiplier = 0.5; // Enfant majeur
          }
          
          totalPrice += basePrice * enfantMultiplier;
        }
      });
    }

    return totalPrice;
  }

  private calculateBasePrice(age: number, regime: string): number {
    let basePrice = 35; // Prix de base réduit pour être plus réaliste

    // Ajustement selon l'âge
    if (age < 25) {
      basePrice *= 0.8;
    } else if (age < 35) {
      basePrice *= 0.9;
    } else if (age < 45) {
      basePrice *= 1.0;
    } else if (age < 55) {
      basePrice *= 1.2;
    } else if (age < 65) {
      basePrice *= 1.5;
    } else {
      basePrice *= 2.0;
    }

    // Ajustement selon le régime
    switch (regime) {
      case 'TNS Indépendant':
        basePrice *= 1.15;
        break;
      case 'Retraité salarié':
      case 'Retraité TNS':
        basePrice *= 1.4;
        break;
      case 'Etudiant':
        basePrice *= 0.6;
        break;
      case 'Sans emploi':
        basePrice *= 0.75;
        break;
    }

    return basePrice;
  }

  // Utilitaire pour formater la date d'effet au format attendu par l'API
  private formatDateEffect(dateString: string): { year: number; month: number; day: number } {
    console.log(`📅 Formatage de la date: "${dateString}"`);
    
    // Vérifie si la date est au format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      throw new Error("Format de date invalide. Utilisez le format YYYY-MM-DD");
    }

    const [yearStr, monthStr, dayStr] = dateString.split('-');
    
    // Conversion en nombres
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    // Validation des valeurs
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new Error("Date invalide: impossible de convertir en nombres");
    }

    if (month < 1 || month > 12) {
      throw new Error("Mois invalide: doit être entre 1 et 12");
    }

    if (day < 1 || day > 31) {
      throw new Error("Jour invalide: doit être entre 1 et 31");
    }

    // Vérifie si la date est dans le futur
    const effetDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (effetDate <= today) {
      throw new Error("La date d'effet doit être postérieure à aujourd'hui");
    }

    const result = { year, month, day };
    console.log(`📅 Date formatée avec succès:`, result);
    
    return result;
  }

  // Méthode pour démarrer le processus de souscription complet
  public async startSubscriptionFlow(
    selectedOffre: Offre, 
    request: TarificationRequest
  ): Promise<SubscriptionFlowState> {
    try {
      console.log('🚀 Démarrage du processus de souscription...');
      console.log('📦 Offre sélectionnée:', selectedOffre);
      console.log('📋 Paramètres de la demande:', request);

      // Formater la date d'effet au format attendu par l'API
      const dateEffect = this.formatDateEffect(request.dateEffet);
      console.log('📅 Date formatée pour l\'API:', dateEffect);

      // Utiliser les IDs de l'offre
      const formulaId = selectedOffre.formula_id || '3847';
      const productId = selectedOffre.product_id || '538';
      
      console.log(`🧮 Utilisation des IDs: produit=${productId}, formule=${formulaId}`);

      // Construire la liste des membres
      const members: Array<{
        concern: string;
        birthyear: string;
        regime: string;
        products: Array<{
          product_id: string;
          formula_id: string;
        }>;
      }> = [];

      // Membre principal (adhérent)
      members.push({
        concern: "a1", // a1 = ADHERENT selon l'API Neoliane
        birthyear: request.anneeNaissance.toString(),
        regime: this.mapRegimeToApiValue(request.regime),
        products: [
          {
            product_id: productId,
            formula_id: formulaId
          }
        ]
      });

      // Ajouter le conjoint s'il existe
      if (request.conjoint && request.conjoint.anneeNaissance) {
        console.log('👫 Ajout du conjoint dans les membres');
        members.push({
          concern: "c1", // c1 = CONJOINT selon l'API Neoliane
          birthyear: request.conjoint.anneeNaissance.toString(),
          regime: this.mapRegimeToApiValue(request.conjoint.regime),
          products: [] // Les produits ne sont associés qu'au membre principal
        });
      }

      // Ajouter les enfants s'ils existent
      if (request.enfants && request.enfants.length > 0) {
        console.log(`👶 Ajout de ${request.enfants.length} enfant(s) dans les membres`);
        request.enfants.forEach((enfant, index) => {
          if (enfant.anneeNaissance) {
            members.push({
              concern: `e${index + 1}`, // e1, e2, etc. = ENFANT selon l'API Neoliane
              birthyear: enfant.anneeNaissance.toString(),
              regime: "6", // Régime étudiant par défaut pour les enfants
              products: [] // Les produits ne sont associés qu'au membre principal
            });
          }
        });
      }

      // Étape 1: Créer le panier
      const cartData: CartRequest = {
        total_amount: selectedOffre.prix.toString(),
        profile: {
          date_effect: dateEffect,
          zipcode: request.codePostal,
          members: members
        }
      };

      console.log('🛒 Création du panier avec les données:', JSON.stringify(cartData, null, 2));
      
      const cartResult = await this.createCart(cartData);

      // Étape 2: Créer la souscription
      const subscriptionData: SubscriptionRequest = {
        lead_id: cartResult.lead_id,
        signtype: '1',
        features: ['CANCELLATION_LETTER_BETA']
      };

      console.log('📝 Création de la souscription avec les données:', subscriptionData);
      const subscriptionResult = await this.createSubscription(subscriptionData);

      return {
        step: 'stepconcern',
        lead_id: cartResult.lead_id,
        subscription_id: subscriptionResult.id,
        token: cartResult.token,
        currentstep: subscriptionResult.currentstep,
        totalstep: subscriptionResult.totalstep,
        steps: subscriptionResult.steps,
        form: subscriptionResult.form,
        save: subscriptionResult.save,
        validate: subscriptionResult.validate
      };

    } catch (error) {
      console.error('❌ Erreur lors du démarrage du processus de souscription:', error);
      throw error;
    }
  }

  // Mapping des régimes selon les valeurs exactes de l'API Neoliane (documentation)
  private mapRegimeToApiValue(regime: string): string {
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
    
    const mappedValue = regimeMap[regime];
    console.log(`🔄 Mapping régime: "${regime}" -> "${mappedValue}"`);
    
    if (!mappedValue) {
      console.warn(`⚠️ Régime non reconnu: "${regime}", utilisation de la valeur par défaut "1"`);
      return '1'; // Salarié par défaut
    }
    
    return mappedValue;
  }

  // Utilitaire pour mapper les CSP selon la documentation
  public mapCSP(regime: string): string {
    const cspMap: { [key: string]: string } = {
      'Salarié': '11',
      'TNS Indépendant': '16',
      'Exploitant agricole': '16', // Même CSP que TNS
      'Retraité salarié': '20',
      'Retraité TNS': '26',
      'Etudiant': '23',
      'Sans emploi': '27',
      'Alsace-Moselle': '11', // Même CSP que salarié
      'Fonctionnaire': '13',
      'Enseignant': '13', // Même CSP que fonctionnaire
      'Expatrié': '27',
      'Salarié Agricole': '11'
    };
    
    const mappedValue = cspMap[regime];
    console.log(`🔄 Mapping CSP: "${regime}" -> "${mappedValue}"`);
    
    return mappedValue || '11'; // Salarié par défaut
  }

  // Méthodes de configuration (simplifiées car la clé est intégrée)
  public getAuthStatus(): { isDemo: boolean; hasUserKey: boolean; hasToken: boolean } {
    return {
      isDemo: this.simulationMode,
      hasUserKey: true, // Toujours true car la clé est intégrée
      hasToken: !!this.accessToken && Date.now() < (this.tokenExpiry - 300000) // 5 minutes de marge
    };
  }

  // Méthode pour tester l'authentification (cœur qui bat)
  public async testAuthentication(): Promise<boolean> {
    try {
      console.log('💓 Test d\'authentification (cœur qui bat)...');
      
      if (this.simulationMode) {
        // En mode simulation, on retourne toujours true
        console.log('✅ Test d\'authentification réussi (simulation)');
        return true;
      }
      
      const token = await this.authenticate();
      const isAuthenticated = !!token;
      console.log(`💓 Résultat du test: ${isAuthenticated ? 'Succès' : 'Échec'}`);
      return isAuthenticated;
    } catch (error: any) {
      console.error('❌ Test d\'authentification échoué:', error);
      return false;
    }
  }
}

export const neolianeService = new NeolianeService();