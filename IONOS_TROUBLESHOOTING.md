# Dépannage IONOS - Erreur 500

## Problème actuel
Erreur 500 (Internal Server Error) causée par le fichier `.htaccess`

## Solution étape par étape

### 1. Supprimer l'ancien .htaccess
- Connectez-vous à votre espace IONOS
- Supprimez le fichier `.htaccess` actuel qui cause l'erreur 500

### 2. Tester sans .htaccess
- Essayez d'accéder à votre site
- Si ça fonctionne, le problème vient bien du .htaccess

### 3. Uploader le nouveau .htaccess simplifié
- Utilisez le nouveau fichier `.htaccess` simplifié
- Il contient seulement les directives essentielles compatibles IONOS

### 4. Si l'erreur 500 persiste

#### Option A : .htaccess minimal
Créez un fichier `.htaccess` avec seulement :
```
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

#### Option B : Pas de .htaccess du tout
- Supprimez complètement le fichier `.htaccess`
- Votre site fonctionnera mais les URLs directes ne marcheront pas

### 5. Vérification de la structure des fichiers

Assurez-vous que votre dossier racine IONOS contient :
```
/
├── index.html          ← OBLIGATOIRE
├── .htaccess          ← Nouveau fichier simplifié
└── assets/
    ├── index-xxx.js   ← Fichiers du build
    └── index-xxx.css
```

### 6. Test final
- Videz le cache de votre navigateur (Ctrl+F5)
- Testez l'URL : https://evolivie.com
- Vérifiez la console (F12) pour d'autres erreurs

## Commandes pour reconstruire si nécessaire

```bash
# Dans votre projet local
npm run build

# Puis uploadez SEULEMENT le contenu de dist/
```

## Contact support IONOS

Si le problème persiste, contactez IONOS en mentionnant :
- "Erreur 500 avec fichier .htaccess"
- "Application React avec routing côté client"
- "Besoin d'activer mod_rewrite"

## Alternative sans .htaccess

Si rien ne fonctionne, vous pouvez déployer sans `.htaccess` mais :
- Seule la page d'accueil fonctionnera
- Les liens directs vers les sous-pages ne marcheront pas
- L'application fonctionnera quand même pour la navigation interne