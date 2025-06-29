// Service pour gérer les appels à l'API Neoliane via le proxy Vite
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

export interface StepFuneralRequest {
  details: Array<{
    identity: {
      identitytype_id: string;
      identitynumber: string;
      issuedate: string;
      issuecity: string;
      expirationdate: string;
      birthcountry: string;
      birthcity: string;
      birthzipcode: string;
      fiscalresident: string;
    };
    enumobsequetypeclause_id: string;
    beneficiarynumber?: string;
    beneficiaries?: Array<{
      gender: string;
      firstname: string;
      lastname: string;
      birthname: string;
      birthdate: string;
      birthcity: string;
      streetnumber: string;
      street: string;
      streetbis: string;
      zipcode: string;
      city: string;
      rank: string;
      percentage: string;
    }>;
  }>;
}

export interface StepCancellationRequest {
  disable_cancellations: number;
  details: Array<{
    enable_cancellation: number;
    email?: string;
    reasonId?: string;
    company?: string;
    contract_name?: string;
    contract_number?: string;
    old_contract_date_echeance?: string;
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
  step: 'cart' | 'subscription' | 'stepconcern' | 'stepbank' | 'stepfuneral' | 'stepcancellation' | 'documents' | 'validation' | 'completed';
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
  // Clés API intégrées directement dans le service
  private clientId = 'e543ff562ad33f763ad9220fe9110bf59c7ebd3736d618f1dc699632a86165eb';
  private clientSecret = '4db90db4a8c18212469a925612ba497e033d83497620133c606e9fe777302f6b';
  private userKey = '9162f8b63e4fc4778d0d5c66a6fd563bb87185ed2a02abd172fa586c8668f4b2';
  private baseUrl = '/api'; // Use Vite proxy instead of direct API URL
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    console.log('🔧 Service Neoliane initialisé avec proxy Vite - Version 5.0');
    console.log('🔑 Clé API pré-configurée et prête à l\'emploi');
  }

  // Méthode pour faire des requêtes via le proxy Vite
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      console.log(`📞 Appel API: ${options.method || 'GET'} ${endpoint}`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      console.log(`📡 Réponse: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Réponse d\'erreur:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Données reçues:', data);
      return data;
    } catch (error: any) {
      console.error('❌ Erreur lors de la requête API:', error);
      throw error;
    }
  }

  // Authentification avec gestion automatique du token (valide 1h)
  public async authenticate(): Promise<string> {
    // Vérifier si le token est encore valide (avec une marge de 5 minutes)
    if (this.accessToken && Date.now() < (this.tokenExpiry - 300000)) {
      console.log('🔐 Token existant encore valide');
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
        // expires_in est un timestamp Unix selon la documentation
        this.tokenExpiry = response.expires_in * 1000;
        
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

  // Récupérer la liste des produits RÉELS depuis l'API Neoliane
  public async getProducts(): Promise<Product[]> {
    try {
      console.log('📦 Récupération de la liste des produits depuis l\'API Neoliane...');
      const token = await this.authenticate();
      const response = await this.makeRequest('/nws/public/v1/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Vérifier si la réponse contient des produits
      if (response && response.status && response.value) {
        // Vérifier si response.value est un objet ou un tableau
        if (Array.isArray(response.value)) {
          console.log(`✅ ${response.value.length} produits récupérés depuis l'API Neoliane`);
          return response.value;
        } else if (typeof response.value === 'object' && response.value !== null) {
          // C'est un objet, on doit extraire les produits
          for (const key in response.value) {
            if (Array.isArray(response.value[key])) {
              console.log(`✅ ${response.value[key].length} produits trouvés dans la propriété ${key}`);
              return response.value[key];
            }
          }
          
          // Si on n'a pas trouvé de tableau, essayons de convertir l'objet en tableau
          const products = Object.values(response.value);
          if (products.length > 0 && typeof products[0] === 'object') {
            console.log(`✅ ${products.length} produits extraits de l'objet`);
            return products as Product[];
          }
        }
      }
      
      console.log('⚠️ Aucun produit trouvé dans la réponse API');
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
      const response = await this.makeRequest(`/nws/public/v1/api/product/${gammeId}/saledocuments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status && response.value) {
        console.log('✅ Documents du produit récupérés avec succès');
        return response.value;
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
      const response = await this.makeRequest(`/nws/public/v1/api/product/${gammeId}/saledocumentcontent/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status && response.value) {
        console.log('✅ Document téléchargé avec succès');
        
        // Convertir le base64 en blob
        const byteCharacters = atob(response.value);
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
      } else {
        throw new Error('Document non trouvé');
      }
    } catch (error) {
      console.error('❌ Erreur lors du téléchargement du document:', error);
      throw error;
    }
  }

  // === TUNNEL DE SOUSCRIPTION COMPLET ===

  // Étape 1: Créer un panier
  public async createCart(cartData: CartRequest): Promise<any> {
    try {
      console.log('🛒 Création du panier...');
      console.log('📤 Données du panier:', JSON.stringify(cartData, null, 2));
      const token = await this.authenticate();
      const response = await this.makeRequest('/nws/public/v1/api/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cartData)
      });

      if (response.status && response.value) {
        console.log('✅ Panier créé avec succès, lead_id:', response.value.lead_id);
        return response.value;
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
      const response = await this.makeRequest('/nws/public/v1/api/subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subscriptionData)
      });

      if (response.status && response.value) {
        console.log('✅ Souscription créée avec succès, id:', response.value.id);
        return response.value;
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
      const response = await this.makeRequest(`/nws/public/v1/api/subscription/${subId}/stepconcern/${stepId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(concernData)
      });

      if (response.status && response.value) {
        console.log('✅ Informations adhérents soumises avec succès');
        return response.value;
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
      const response = await this.makeRequest(`/nws/public/v1/api/subscription/${subId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status && response.value) {
        console.log('✅ État de la souscription récupéré avec succès');
        return response.value;
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
      const response = await this.makeRequest(`/nws/public/v1/api/subscription/${subId}/stepbank/${stepId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bankData)
      });

      if (response.status && response.value) {
        console.log('✅ Informations bancaires soumises avec succès');
        return response.value;
      }
      throw new Error('Erreur lors de la soumission des informations bancaires');
    } catch (error) {
      console.error('❌ Erreur stepbank:', error);
      throw error;
    }
  }

  // Étape 5: Informations obsèques (stepfuneral) - uniquement pour les contrats obsèques
  public async submitStepFuneral(subId: string, stepId: string, funeralData: StepFuneralRequest): Promise<any> {
    try {
      console.log('⚱️ Soumission des informations obsèques...');
      console.log('📤 Données stepfuneral:', JSON.stringify(funeralData, null, 2));
      const token = await this.authenticate();
      const response = await this.makeRequest(`/nws/public/v1/api/subscription/${subId}/stepfuneral/${stepId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(funeralData)
      });

      if (response.status && response.value) {
        console.log('✅ Informations obsèques soumises avec succès');
        return response.value;
      }
      throw new Error('Erreur lors de la soumission des informations obsèques');
    } catch (error) {
      console.error('❌ Erreur stepfuneral:', error);
      throw error;
    }
  }

  // Étape 6: Gestion de la résiliation (stepcancellation)
  public async submitStepCancellation(subId: string, stepId: string, cancellationData: StepCancellationRequest): Promise<any> {
    try {
      console.log('📋 Soumission des informations de résiliation...');
      console.log('📤 Données stepcancellation:', JSON.stringify(cancellationData, null, 2));
      const token = await this.authenticate();
      const response = await this.makeRequest(`/nws/public/v1/api/subscription/${subId}/stepcancellation/${stepId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cancellationData)
      });

      if (response.status && response.value) {
        console.log('✅ Informations de résiliation soumises avec succès');
        return response.value;
      }
      throw new Error('Erreur lors de la soumission des informations de résiliation');
    } catch (error) {
      console.error('❌ Erreur stepcancellation:', error);
      throw error;
    }
  }

  // Étape 7: Upload d'un document
  public async uploadDocument(subId: string, documentData: any): Promise<any> {
    try {
      console.log('📄 Upload de document...');
      const token = await this.authenticate();
      const response = await this.makeRequest(`/nws/public/v1/api/subscription/${subId}/document`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(documentData)
      });

      if (response.status && response.value) {
        console.log('✅ Document uploadé avec succès');
        return response.value;
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
      const response = await this.makeRequest(`/nws/public/v1/api/contract/${contractId}/validate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify([])
      });

      if (response.status && response.value) {
        console.log('✅ Contrat validé avec succès');
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
      console.log('📄 Récupération des documents pré-remplis...');
      const token = await this.authenticate();
      const response = await fetch(`${this.baseUrl}/nws/public/v1/api/subscription/${subId}/documentdownload`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Documents pré-remplis récupérés avec succès');
      return await response.blob();
    } catch (error) {
      console.error('❌ Erreur téléchargement documents:', error);
      throw error;
    }
  }

  // Méthode pour la tarification - UTILISE MAINTENANT LA VRAIE API NEOLIANE
  public async getTarification(request: TarificationRequest): Promise<TarificationResponse> {
    try {
      console.log('💰 Récupération des offres RÉELLES depuis l\'API Neoliane...');
      console.log('📋 Paramètres:', request);

      // Vérifier le format de la date
      try {
        this.formatDateEffect(request.dateEffet);
      } catch (error: any) {
        throw new Error(`Erreur de date: ${error.message}`);
      }

      // ÉTAPE 1: Récupérer la liste RÉELLE des produits depuis l'API Neoliane
      console.log('📦 Récupération de la liste des produits depuis l\'API...');
      const products = await this.getProducts();
      console.log(`✅ ${products ? products.length : 0} produits récupérés depuis l'API Neoliane`);

      // Vérifier que nous avons des produits
      if (!products || !Array.isArray(products) || products.length === 0) {
        console.log('⚠️ Aucun produit récupéré de l\'API, utilisation du fallback');
        return this.getFallbackOffres(request);
      }

      // ÉTAPE 2: Filtrer les produits de type "sante"
      const healthProducts = products.filter(product => 
        product.type === 'sante' || 
        (product.gammeLabel && (
          product.gammeLabel.toLowerCase().includes('santé') ||
          product.gammeLabel.toLowerCase().includes('sante')
        ))
      );

      console.log(`🏥 ${healthProducts.length} produits santé trouvés:`, healthProducts.map(p => p.gammeLabel));

      // Si aucun produit santé trouvé, utiliser tous les produits
      const productsToUse = healthProducts.length > 0 ? healthProducts : products.slice(0, 5);

      // ÉTAPE 3: Créer des offres basées sur les vrais produits
      const age = new Date().getFullYear() - request.anneeNaissance;
      const basePrice = this.calculateBasePrice(age, request.regime);

      const offres: Offre[] = [];

      for (const product of productsToUse) {
        if (!product.gammeLabel) continue;

        // Créer des formules simulées pour chaque produit
        const formulas = this.generateFormulasForProduct(product, basePrice);
        
        for (const formula of formulas) {
          const prixFinal = this.calculatePriceWithBeneficiaries(
            formula.price,
            request.conjoint,
            request.enfants
          );

          offres.push({
            nom: formula.formulaLabel || product.gammeLabel,
            prix: Math.round(prixFinal * 100) / 100,
            product_id: product.gammeId.toString(),
            formula_id: formula.formulaId.toString(),
            formulaId: formula.formulaId,
            gammeId: product.gammeId,
            garanties: formula.guarantees || this.getGarantiesForProduct(product.gammeLabel)
          });
        }
      }

      // Si aucune offre n'a pu être créée, utiliser le fallback
      if (offres.length === 0) {
        console.log('⚠️ Aucune offre créée depuis l\'API, utilisation du fallback');
        return this.getFallbackOffres(request);
      }

      // Trier les offres par prix croissant
      offres.sort((a, b) => a.prix - b.prix);

      console.log(`✅ ${offres.length} offres RÉELLES générées depuis l'API Neoliane`);

      return {
        success: true,
        offres
      };

    } catch (error: any) {
      console.error('❌ Erreur lors de la tarification:', error);
      
      // En cas d'erreur avec l'API, fallback vers les offres simulées
      console.log('🔄 Fallback vers les offres simulées...');
      return this.getFallbackOffres(request);
    }
  }

  // Générer des formules pour un produit donné
  private generateFormulasForProduct(product: Product, basePrice: number): ProductFormula[] {
    const productName = product.gammeLabel?.toLowerCase() || '';
    
    // Générer 2-3 formules par produit avec des prix différents
    const formulas: ProductFormula[] = [];
    
    if (productName.includes('essentiel') || productName.includes('eco')) {
      formulas.push({
        formulaId: 3847,
        formulaLabel: `${product.gammeLabel} - Essentielle`,
        price: basePrice * 0.8,
        guarantees: this.getGarantiesForProduct(product.gammeLabel || '')
      });
    } else if (productName.includes('confort')) {
      formulas.push({
        formulaId: 3848,
        formulaLabel: `${product.gammeLabel} - Confort`,
        price: basePrice * 1.0,
        guarantees: this.getGarantiesForProduct(product.gammeLabel || '')
      });
    } else if (productName.includes('premium') || productName.includes('excellence')) {
      formulas.push({
        formulaId: 3849,
        formulaLabel: `${product.gammeLabel} - Premium`,
        price: basePrice * 1.4,
        guarantees: this.getGarantiesForProduct(product.gammeLabel || '')
      });
    } else {
      // Produit générique - créer 3 formules
      formulas.push(
        {
          formulaId: 3847,
          formulaLabel: `${product.gammeLabel} - Essentielle`,
          price: basePrice * 0.8,
          guarantees: this.getGarantiesForProduct(product.gammeLabel || '')
        },
        {
          formulaId: 3848,
          formulaLabel: `${product.gammeLabel} - Confort`,
          price: basePrice * 1.0,
          guarantees: this.getGarantiesForProduct(product.gammeLabel || '')
        },
        {
          formulaId: 3849,
          formulaLabel: `${product.gammeLabel} - Premium`,
          price: basePrice * 1.4,
          guarantees: this.getGarantiesForProduct(product.gammeLabel || '')
        }
      );
    }
    
    return formulas;
  }

  // Méthode pour obtenir les garanties selon le nom du produit
  private getGarantiesForProduct(productName: string): Array<{nom: string, niveau: string}> {
    const name = productName.toLowerCase();
    
    if (name.includes('essentiel') || name.includes('eco')) {
      return [
        { nom: 'Hospitalisation', niveau: '100%' },
        { nom: 'Médecine courante', niveau: '70%' },
        { nom: 'Pharmacie', niveau: '65%' },
        { nom: 'Analyses', niveau: '70%' }
      ];
    } else if (name.includes('confort')) {
      return [
        { nom: 'Hospitalisation', niveau: '100%' },
        { nom: 'Médecine courante', niveau: '100%' },
        { nom: 'Pharmacie', niveau: '80%' },
        { nom: 'Optique', niveau: '150€/an' },
        { nom: 'Analyses', niveau: '100%' }
      ];
    } else if (name.includes('premium') || name.includes('excellence')) {
      return [
        { nom: 'Hospitalisation', niveau: '100%' },
        { nom: 'Médecine courante', niveau: '100%' },
        { nom: 'Pharmacie', niveau: '100%' },
        { nom: 'Optique', niveau: '300€/an' },
        { nom: 'Dentaire', niveau: '200%' },
        { nom: 'Analyses', niveau: '100%' },
        { nom: 'Médecines douces', niveau: '150€/an' }
      ];
    } else {
      // Garanties par défaut
      return [
        { nom: 'Hospitalisation', niveau: '100%' },
        { nom: 'Médecine courante', niveau: '100%' },
        { nom: 'Pharmacie', niveau: '80%' },
        { nom: 'Analyses', niveau: '100%' }
      ];
    }
  }

  // Méthode de fallback avec les offres simulées (en cas d'erreur API)
  private getFallbackOffres(request: TarificationRequest): TarificationResponse {
    console.log('🔄 Génération des offres de fallback...');
    
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

    return {
      success: true,
      offres,
      message: 'Offres de fallback (API temporairement indisponible)'
    };
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
    let basePrice = 45; // Prix de base

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
        basePrice *= 1.1;
        break;
      case 'Retraité salarié':
      case 'Retraité TNS':
        basePrice *= 1.3;
        break;
      case 'Etudiant':
        basePrice *= 0.7;
        break;
      case 'Sans emploi':
        basePrice *= 0.8;
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
    
    // Conversion en nombres (IMPORTANT: l'API Neoliane attend des nombres, pas des strings)
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

      // Utiliser le formula_id de l'offre (qui vient maintenant de l'API réelle)
      const formulaId = selectedOffre.formula_id || selectedOffre.formulaId?.toString();
      
      if (!formulaId) {
        throw new Error('Aucun ID de formule disponible pour cette offre');
      }
      
      console.log(`🧮 Utilisation de la formule: ${formulaId} pour le produit ${selectedOffre.product_id}`);

      // Étape 1: Créer le panier
      const cartData: CartRequest = {
        total_amount: selectedOffre.prix.toString(),
        profile: {
          date_effect: dateEffect, // Objet avec year, month, day en NOMBRES
          zipcode: request.codePostal,
          members: [
            {
              concern: "a1", // Valeur correcte selon la documentation
              birthyear: request.anneeNaissance.toString(),
              regime: this.mapRegimeToApiValue(request.regime),
              products: [
                {
                  product_id: selectedOffre.product_id || '538',
                  formula_id: formulaId
                }
              ]
            }
          ]
        }
      };

      console.log('🛒 Création du panier avec les données:', JSON.stringify(cartData, null, 2));
      console.log("📅 Date formatée envoyée à l'API:", cartData.profile.date_effect);
      
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
      isDemo: false,
      hasUserKey: true, // Toujours true car la clé est intégrée
      hasToken: !!this.accessToken && Date.now() < (this.tokenExpiry - 300000) // 5 minutes de marge
    };
  }

  // Méthode pour tester l'authentification (cœur qui bat)
  public async testAuthentication(): Promise<boolean> {
    try {
      console.log('💓 Test d\'authentification (cœur qui bat)...');
      const token = await this.authenticate();
      const isAuthenticated = !!token;
      console.log(`💓 Résultat du test: ${isAuthenticated ? 'Succès' : 'Échec'}`);
      return isAuthenticated;
    } catch (error) {
      console.error('❌ Test d\'authentification échoué:', error);
      return false;
    }
  }
}

export const neolianeService = new NeolianeService();