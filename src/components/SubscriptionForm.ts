@@ .. @@
   const handleStepConcern = async () => {
     if (!currentSubscriptionState.subscription_id) {
       onError('ID de souscription manquant');
       return;
     }

     // Validation des champs obligatoires
     if (!concernData.lastname || !concernData.firstname || !concernData.numss || 
         !concernData.birthdate.day || !concernData.birthdate.month || !concernData.birthdate.year ||
         !concernData.birthplace || !concernData.birthzipcode || !concernData.streetnumber ||
         !concernData.street || !concernData.zipcode || !concernData.city || 
         !concernData.email || !concernData.phone) {
       onError('Veuillez remplir tous les champs obligatoires');
       toast.error('Veuillez remplir tous les champs obligatoires');
       return;
     }

     // Validation du numéro de sécurité sociale (13 chiffres minimum)
     if (concernData.numss.length < 13) {
       onError('Le numéro de sécurité sociale doit contenir au moins 13 chiffres');
       toast.error('Le numéro de sécurité sociale doit contenir au moins 13 chiffres');
       return;
     }

     // Validation de l'email
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(concernData.email)) {
       onError('Veuillez saisir une adresse email valide');
       toast.error('Veuillez saisir une adresse email valide');
       return;
     }

     setLoading(true);
     try {
       const stepConcernData: StepConcernRequest = {
         members: [
           {
             is_politically_exposed: 0,
             gender: concernData.gender,
             lastname: concernData.lastname,
             firstname: concernData.firstname,
-            regime: 'Salarié', // Valeur texte selon la documentation
+            regime: '1', // Code numérique selon la documentation
             birthdate: concernData.birthdate,
             birthplace: concernData.birthplace,
             birthzipcode: concernData.birthzipcode,
             birthcountry: concernData.birthcountry,
-            csp: neolianeService.mapCSP('Salarié'), // Mapping automatique
+            csp: '11', // Code CSP pour Salarié
             numss: concernData.numss,
             numorganisme: ''
           }
         ],