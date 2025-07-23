# Système de Comptes Utilisateurs - R DISTRIB SOLUTIONS

## Vue d'ensemble

Ce système implémente un workflow complet de création et validation de comptes utilisateurs avec les fonctionnalités suivantes :

- ✅ Demande de création de compte par formulaire
- ✅ Validation administrateur obligatoire
- ✅ Notifications email automatiques
- ✅ Interface d'administration
- ✅ Gestion des rôles et permissions

## Architecture

### Base de données (Supabase)

#### Tables principales :
- `user_profiles` - Profils utilisateurs étendus
- `account_requests` - Demandes de création de compte
- `admin_users` - Utilisateurs administrateurs
- `email_notifications` - Log des emails envoyés

#### Workflow :
1. **Demande** → Client remplit le formulaire
2. **Notification** → Email automatique au client + notification aux admins
3. **Validation** → Admin approuve ou rejette
4. **Activation** → Email de confirmation + création du compte

### Composants React

#### Authentification :
- `AuthProvider` - Context global d'authentification
- `ProtectedRoute` - Protection des routes
- `LoginForm` - Formulaire de connexion
- `AccountRequestForm` - Demande de création de compte

#### Administration :
- `AccountRequestsList` - Liste des demandes pour les admins

### Pages

- `/auth/login` - Connexion
- `/auth/register` - Demande de compte
- `/dashboard` - Espace client (protégé)
- `/admin` - Interface admin (protégé)
- `/account-pending` - Page d'attente de validation

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://rdistrib-solutions.fr
```

### 2. Configuration Supabase

1. **Créez un projet Supabase**
2. **Exécutez la migration** : Copiez le contenu de `supabase/migrations/create_user_accounts.sql` dans l'éditeur SQL de Supabase
3. **Configurez l'authentification** :
   - Activez l'authentification par email/mot de passe
   - Désactivez la confirmation email automatique (nous gérons manuellement)

### 3. Configuration des emails

Pour les notifications email, vous pouvez :
- Utiliser Supabase Edge Functions avec un service comme SendGrid
- Intégrer un service tiers comme Resend ou Mailgun
- Utiliser les webhooks Supabase

### 4. Créer un administrateur

```sql
-- Remplacez par l'email de votre admin
INSERT INTO admin_users (user_id, role, permissions)
SELECT 
  id,
  'super_admin',
  '{"manage_users": true, "view_analytics": true, "manage_admins": true}'
FROM auth.users 
WHERE email = 'admin@rdistrib-solutions.fr';
```

## Utilisation

### Pour les clients :

1. **Demande de compte** : `/auth/register`
   - Remplir le formulaire avec les informations entreprise
   - Recevoir un email de confirmation de réception

2. **Attente de validation** : `/account-pending`
   - Page d'information pendant la validation

3. **Connexion** : `/auth/login`
   - Une fois le compte approuvé

4. **Espace client** : `/dashboard`
   - Accès aux fonctionnalités réservées

### Pour les administrateurs :

1. **Interface admin** : `/admin`
   - Liste des demandes en attente
   - Actions d'approbation/rejet

2. **Workflow de validation** :
   - Examiner les informations du demandeur
   - Approuver → Email automatique + activation du compte
   - Rejeter → Email avec raison + archivage de la demande

## Statuts des comptes

- `pending` - En attente de validation
- `approved` - Compte approuvé et actif
- `rejected` - Demande rejetée
- `suspended` - Compte suspendu

## Sécurité

- **RLS (Row Level Security)** activé sur toutes les tables
- **Politiques d'accès** strictes par rôle
- **Validation côté serveur** avec fonctions PostgreSQL
- **Protection des routes** côté client

## Notifications email

### Templates disponibles :
- `account_request_received` - Confirmation de réception (client)
- `admin_new_request` - Nouvelle demande (admin)
- `account_approved` - Compte approuvé (client)
- `account_rejected` - Compte rejeté (client)

## Développement

### Ajouter de nouvelles fonctionnalités :

1. **Nouveaux champs** : Modifier les tables et formulaires
2. **Nouveaux rôles** : Étendre la table `admin_users`
3. **Nouvelles notifications** : Ajouter des templates dans `email-templates.ts`

### Tests :

1. Tester le workflow complet de création de compte
2. Vérifier les permissions et la sécurité
3. Tester les notifications email
4. Valider l'interface d'administration

## Support

Pour toute question sur l'implémentation :
- Vérifiez les logs Supabase pour les erreurs de base de données
- Consultez la documentation Supabase Auth
- Testez les fonctions SQL directement dans l'éditeur Supabase