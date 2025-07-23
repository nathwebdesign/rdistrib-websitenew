// Templates d'emails pour les notifications

export const emailTemplates = {
  // Email envoyé au client quand il fait une demande
  account_request_received: {
    subject: 'Votre demande de compte R DISTRIB SOLUTIONS a été reçue',
    html: (data: { contact_person: string; company_name?: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
          <h1>R DISTRIB SOLUTIONS</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9fafb;">
          <h2>Bonjour ${data.contact_person},</h2>
          
          <p>Nous avons bien reçu votre demande de création de compte pour ${data.company_name || 'votre entreprise'}.</p>
          
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Votre demande est en cours d'examen</strong><br>
              Notre équipe va examiner votre demande dans les plus brefs délais (24-48h ouvrées).
              Vous recevrez un email de confirmation dès que votre compte sera activé.
            </p>
          </div>
          
          <p>En attendant, n'hésitez pas à :</p>
          <ul>
            <li>Consulter nos services sur notre site web</li>
            <li>Nous contacter au 01 48 16 35 14 pour toute question</li>
            <li>Utiliser notre calculateur de cotation en ligne</li>
          </ul>
          
          <p>Cordialement,<br>L'équipe R DISTRIB SOLUTIONS</p>
        </div>
        
        <div style="background-color: #374151; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>R DISTRIB SOLUTIONS - 4 Rue de Te, 93290 Tremblay-en-France</p>
          <p>Tél: 01 48 16 35 14 - Email: commandes@rdistrib-solutions.fr</p>
        </div>
      </div>
    `
  },

  // Email envoyé aux admins pour une nouvelle demande
  admin_new_request: {
    subject: 'Nouvelle demande de compte - R DISTRIB SOLUTIONS',
    html: (data: { contact_person: string; company_name?: string; email: string; request_id: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1>🚨 NOUVELLE DEMANDE DE COMPTE</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9fafb;">
          <h2>Nouvelle demande à traiter</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
            <h3>Informations du demandeur :</h3>
            <ul>
              <li><strong>Contact :</strong> ${data.contact_person}</li>
              <li><strong>Email :</strong> ${data.email}</li>
              <li><strong>Entreprise :</strong> ${data.company_name || 'Non renseignée'}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Traiter la demande
            </a>
          </div>
          
          <p style="font-size: 12px; color: #6b7280;">
            ID de la demande : ${data.request_id}
          </p>
        </div>
      </div>
    `
  },

  // Email envoyé au client quand son compte est approuvé
  account_approved: {
    subject: 'Votre compte R DISTRIB SOLUTIONS a été approuvé ! 🎉',
    html: (data: { contact_person: string; company_name?: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
          <h1>🎉 COMPTE APPROUVÉ</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9fafb;">
          <h2>Félicitations ${data.contact_person} !</h2>
          
          <p>Votre compte R DISTRIB SOLUTIONS pour ${data.company_name || 'votre entreprise'} a été approuvé et activé.</p>
          
          <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #065f46;">
              <strong>Votre compte est maintenant actif !</strong><br>
              Vous pouvez dès maintenant vous connecter et profiter de tous nos services.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/auth/login" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
              Se connecter
            </a>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/cotation" 
               style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Faire une cotation
            </a>
          </div>
          
          <h3>Vos avantages :</h3>
          <ul>
            <li>Accès à votre espace client personnalisé</li>
            <li>Historique de vos expéditions</li>
            <li>Tarifs préférentiels</li>
            <li>Support client dédié</li>
          </ul>
          
          <p>Cordialement,<br>L'équipe R DISTRIB SOLUTIONS</p>
        </div>
        
        <div style="background-color: #374151; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>R DISTRIB SOLUTIONS - 4 Rue de Te, 93290 Tremblay-en-France</p>
          <p>Tél: 01 48 16 35 14 - Email: commandes@rdistrib-solutions.fr</p>
        </div>
      </div>
    `
  },

  // Email envoyé au client quand son compte est rejeté
  account_rejected: {
    subject: 'Votre demande de compte R DISTRIB SOLUTIONS',
    html: (data: { contact_person: string; company_name?: string; reason: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1>R DISTRIB SOLUTIONS</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9fafb;">
          <h2>Bonjour ${data.contact_person},</h2>
          
          <p>Nous avons examiné votre demande de création de compte pour ${data.company_name || 'votre entreprise'}.</p>
          
          <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #991b1b;">
              <strong>Malheureusement, nous ne pouvons pas donner suite à votre demande pour la raison suivante :</strong><br>
              ${data.reason}
            </p>
          </div>
          
          <p>Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez obtenir plus d'informations, n'hésitez pas à nous contacter :</p>
          
          <ul>
            <li>Téléphone : 01 48 16 35 14</li>
            <li>Email : commandes@rdistrib-solutions.fr</li>
          </ul>
          
          <p>Vous pouvez également continuer à utiliser nos services en tant qu'invité via notre calculateur de cotation en ligne.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Nous contacter
            </a>
          </div>
          
          <p>Cordialement,<br>L'équipe R DISTRIB SOLUTIONS</p>
        </div>
        
        <div style="background-color: #374151; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>R DISTRIB SOLUTIONS - 4 Rue de Te, 93290 Tremblay-en-France</p>
          <p>Tél: 01 48 16 35 14 - Email: commandes@rdistrib-solutions.fr</p>
        </div>
      </div>
    `
  }
}