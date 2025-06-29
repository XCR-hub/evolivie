# Guide de déploiement sur IONOS - MISE À JOUR

## ⚠️ SOLUTION AU PROBLÈME MIME TYPE

Si vous obtenez l'erreur "Expected a JavaScript module script but the server responded with a MIME type of """, suivez ces étapes :

### 1. Préparer l'environnement local
```bash
# Installer Node.js (version 18 ou plus récente)
# Télécharger depuis https://nodejs.org/

# Vérifier l'installation
node --version
npm --version
```

### 2. Installer les dépendances
```bash
# Dans le dossier du projet
cd /chemin/vers/votre/projet
npm install
```

### 3. Compiler le projet (BUILD)
```bash
# Créer la version de production
npm run build
```

Cette commande va créer un dossier `dist/` avec tous les fichiers compilés.

### 4. **IMPORTANT : Configuration du serveur**

Le fichier `.htaccess` a été mis à jour pour résoudre le problème MIME type. Il doit être présent dans votre dossier racine IONOS.

### 5. Déployer sur IONOS

#### Procédure complète :

1. **Connectez-vous à votre espace IONOS**
2. **Allez dans "Hébergement Web" → Gestionnaire de fichiers**
3. **SUPPRIMEZ TOUT le contenu actuel** du dossier racine
4. **Uploadez le contenu du dossier `dist/`** :
   - `index.html`
   - Le dossier `assets/` complet
   - Tous les autres fichiers du dossier `dist/`
5. **Uploadez le fichier `.htaccess`** depuis le dossier `public/` du projet

### 6. Vérification de la structure

Votre dossier racine IONOS doit ressembler à ça :
```
/ (racine de votre site)
├── index.html                    ← Fichier principal
├── .htaccess                     ← Configuration serveur (CRUCIAL)
├── assets/
│   ├── index-[hash].js          ← Fichiers JavaScript
│   ├── index-[hash].css         ← Fichiers CSS
│   └── autres assets...
└── autres fichiers statiques...
```

### 7. Test et dépannage

#### ✅ Si ça fonctionne :
- Votre site devrait s'afficher normalement
- L'API Neoliane devrait être accessible depuis votre domaine

#### ❌ Si ça ne fonctionne toujours pas :

1. **Vérifiez la console du navigateur (F12)**
2. **Vérifiez que le fichier `.htaccess` est bien présent**
3. **Contactez le support IONOS** pour vérifier que :
   - Les modules Apache `mod_rewrite` et `mod_headers` sont activés
   - Les fichiers `.htaccess` sont autorisés

### 8. Variables d'environnement (optionnel)

Si vous utilisez des variables d'environnement, elles sont compilées dans le build. Pas besoin de fichier `.env` sur le serveur.

## Commandes de développement

```bash
# Développement local
npm run dev

# Build de production
npm run build

# Prévisualiser le build localement
npm run preview
```

## Points importants

1. **Ne jamais uploader `node_modules/`** - Seulement le contenu de `dist/`
2. **Le fichier `.htaccess` est essentiel** pour les applications React
3. **Vider le cache du navigateur** après chaque déploiement
4. **L'API Neoliane fonctionne maintenant** depuis votre domaine evolivie.com

## Support

Si le problème persiste après avoir suivi ces étapes :
1. Vérifiez que votre hébergement IONOS supporte les applications JavaScript modernes
2. Contactez le support IONOS pour activer les modules Apache nécessaires
3. Testez avec un autre navigateur pour éliminer les problèmes de cache