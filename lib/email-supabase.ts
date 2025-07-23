import { supabase } from './supabase'

interface EmailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmailViaSupabase(options: EmailOptions) {
  // Stocker l'email dans une table pour traitement ultérieur
  const { error } = await supabase
    .from('email_queue')
    .insert({
      to_email: options.to,
      subject: options.subject,
      html_content: options.html,
      reply_to: options.replyTo,
      status: 'pending'
    })

  if (error) {
    console.error('Erreur lors de l\'ajout à la queue email:', error)
    throw error
  }

  return { success: true }
}

// Templates d'emails
export const emailTemplates = {
  accountApproved: (name: string, loginUrl: string) => ({
    subject: 'Votre compte R DISTRIB SOLUTIONS a été approuvé',
    html: `
      <h2>Félicitations ${name} !</h2>
      <p>Votre compte a été approuvé. Vous pouvez maintenant vous connecter et accéder à toutes nos fonctionnalités.</p>
      <a href="${loginUrl}" style="display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Se connecter</a>
    `
  }),
  
  accountRejected: (name: string, reason: string) => ({
    subject: 'Demande de compte R DISTRIB SOLUTIONS',
    html: `
      <h2>Bonjour ${name},</h2>
      <p>Nous avons examiné votre demande de compte et malheureusement nous ne pouvons pas l'approuver pour le moment.</p>
      <p><strong>Raison :</strong> ${reason}</p>
      <p>Si vous pensez qu'il s'agit d'une erreur, n'hésitez pas à nous contacter.</p>
    `
  }),
  
  welcomePending: (name: string) => ({
    subject: 'Bienvenue chez R DISTRIB SOLUTIONS - Compte en attente',
    html: `
      <h2>Bienvenue ${name} !</h2>
      <p>Nous avons bien reçu votre demande de création de compte.</p>
      <p>Notre équipe va examiner votre demande et vous recevrez un email dès que votre compte sera activé.</p>
      <p>Cela prend généralement moins de 24 heures.</p>
    `
  })
}