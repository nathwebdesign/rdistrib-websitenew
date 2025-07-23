import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const QUOTATION_EMAIL = process.env.QUOTATION_EMAIL || 'contact@rdistrib-solutions.fr'
const RESEND_API_KEY = process.env.RESEND_API_KEY

// Créer l'instance Resend seulement si la clé est disponible
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    // Créer le client Supabase avec les variables d'environnement
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Récupérer le token depuis les headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Vérifier le token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le profil de l'utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('account_requests')
      .select('*')
      .eq('email', user.email)
      .eq('status', 'approved')
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Compte non approuvé' }, { status: 403 })
    }

    const data = await request.json()
    
    // Formater le contenu de l'email
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price)
    }
    
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2563eb;
          color: white;
          padding: 20px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .content {
          background-color: #f9fafb;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .section {
          background-color: white;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .section h2 {
          color: #2563eb;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: bold;
          color: #6b7280;
        }
        .value {
          color: #111827;
        }
        .article-box {
          background-color: #f9fafb;
          padding: 15px;
          margin: 10px 0;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }
        .price-highlight {
          background-color: #2563eb;
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        }
        .price-highlight .amount {
          font-size: 32px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
        }
        .options-list {
          list-style: none;
          padding: 0;
        }
        .options-list li {
          padding: 5px 0;
        }
        .option-yes {
          color: #10b981;
        }
        .option-no {
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Nouvelle demande de cotation</h1>
        <p>${new Date().toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>
      
      <div class="content">
        <div class="section">
          <h2>Informations client</h2>
          <div class="info-row">
            <span class="label">Société :</span>
            <span class="value">${data.clientInfo.company || 'Non renseigné'}</span>
          </div>
          <div class="info-row">
            <span class="label">Contact :</span>
            <span class="value">${data.clientInfo.name}</span>
          </div>
          <div class="info-row">
            <span class="label">Email :</span>
            <span class="value">${data.clientInfo.email}</span>
          </div>
          <div class="info-row">
            <span class="label">Téléphone :</span>
            <span class="value">${data.clientInfo.phone || 'Non renseigné'}</span>
          </div>
        </div>

        <div class="section">
          <h2>Détails du transport</h2>
          <div class="info-row">
            <span class="label">Trajet :</span>
            <span class="value">${data.trajet}</span>
          </div>
          <div class="info-row">
            <span class="label">Pôle de référence :</span>
            <span class="value">${data.pole}</span>
          </div>
          <div class="info-row">
            <span class="label">Zone tarifaire :</span>
            <span class="value">${data.zone.code} - ${data.zone.name}</span>
          </div>
          <div class="info-row">
            <span class="label">Type de livraison :</span>
            <span class="value">${
              data.selectedDelivery === 'messagerie' ? 'Messagerie' :
              data.selectedDelivery === 'express' ? 'Express' : 'Affrètement'
            }</span>
          </div>
          <div class="info-row">
            <span class="label">Poids total :</span>
            <span class="value">${data.transport.weight} kg</span>
          </div>
        </div>

        <div class="section">
          <h2>Articles à transporter</h2>
          ${data.articles.map((article: any, index: number) => `
            <div class="article-box">
              <h3>Article ${index + 1} - ${article.type.charAt(0).toUpperCase() + article.type.slice(1)}</h3>
              <div class="info-row">
                <span class="label">Quantité :</span>
                <span class="value">${article.nombrePalettes}</span>
              </div>
              <div class="info-row">
                <span class="label">Dimensions (L x l x h) :</span>
                <span class="value">${article.longueur} x ${article.largeur} x ${article.hauteur} cm</span>
              </div>
              <div class="info-row">
                <span class="label">Poids :</span>
                <span class="value">${article.poids} kg</span>
              </div>
              ${article.type === 'palette' ? `
              <div class="info-row">
                <span class="label">Gerbable :</span>
                <span class="value">${article.gerbable ? 'Oui' : 'Non'}</span>
              </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>Options sélectionnées</h2>
          <ul class="options-list">
            <li class="${data.options.hayonEnlevement || data.options.hayonLivraison ? 'option-yes' : 'option-no'}">
              ${data.options.hayonEnlevement || data.options.hayonLivraison ? '✓' : '✗'} Hayon
              ${data.options.hayonEnlevement && data.options.hayonLivraison ? '(enlèvement et livraison)' :
                data.options.hayonEnlevement ? '(enlèvement uniquement)' :
                data.options.hayonLivraison ? '(livraison uniquement)' : ''}
            </li>
            <li class="${data.options.quantiteLimitee ? 'option-yes' : 'option-no'}">
              ${data.options.quantiteLimitee ? '✓' : '✗'} Quantité limitée
            </li>
            <li class="${data.options.kitADR ? 'option-yes' : 'option-no'}">
              ${data.options.kitADR ? '✓' : '✗'} Kit ADR demandé
            </li>
            <li class="${data.options.rendezVousEnlevement || data.options.rendezVousLivraison ? 'option-yes' : 'option-no'}">
              ${data.options.rendezVousEnlevement || data.options.rendezVousLivraison ? '✓' : '✗'} Rendez-vous
              ${data.options.rendezVousEnlevement && data.options.rendezVousLivraison ? '(enlèvement et livraison)' :
                data.options.rendezVousEnlevement ? '(enlèvement uniquement)' :
                data.options.rendezVousLivraison ? '(livraison uniquement)' : ''}
            </li>
          </ul>
        </div>

        <div class="price-highlight">
          <h2 style="margin: 0 0 10px 0; color: white;">Tarif calculé</h2>
          <div class="amount">${formatPrice(data.pricing.totalHT)}</div>
          <p style="margin: 10px 0 0 0;">Hors taxes</p>
        </div>

        <div class="section">
          <h2>Détail du tarif</h2>
          <div class="info-row">
            <span class="label">Tarif de base :</span>
            <span class="value">${formatPrice(data.pricing.basePrice)}</span>
          </div>
          ${Object.entries(data.pricing.supplements || {}).map(([key, value]) => `
            <div class="info-row">
              <span class="label">${
                key === 'hayon' ? 'Forfait hayon' :
                key === 'Forfait hayon' ? 'Forfait hayon' :
                key === 'rendezVousEnlevement' ? 'Rendez-vous à l\'enlèvement' :
                key === 'rendezVousLivraison' ? 'Rendez-vous à la livraison' :
                key === 'matieresDangereuses' ? 'Kit ADR (+25%)' :
                key === 'quantiteLimitee' ? 'Quantité limitée' :
                key === 'supplementRegionParisienne' ? 'Supplément région parisienne' :
                key === 'assurance' ? 'Assurance' : key
              } :</span>
              <span class="value">${formatPrice(value as number)}</span>
            </div>
          `).join('')}
          <div class="info-row" style="font-weight: bold; font-size: 1.1em; margin-top: 10px; padding-top: 10px; border-top: 2px solid #e5e7eb;">
            <span class="label">Total HT :</span>
            <span class="value">${formatPrice(data.pricing.totalHT)}</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Cette demande a été générée automatiquement depuis le site web R DISTRIB SOLUTIONS.</p>
        <p>Pour toute question, veuillez contacter le client directement.</p>
      </div>
    </body>
    </html>
    `

    // Envoyer l'email si Resend est configuré
    if (resend) {
      const { error: emailError } = await resend.emails.send({
        from: 'R DISTRIB SOLUTIONS <noreply@rdistrib-solutions.fr>',
        to: QUOTATION_EMAIL,
        replyTo: data.clientInfo.email,
        subject: `Nouvelle demande de cotation - ${data.clientInfo.company || data.clientInfo.name}`,
        html: emailHtml,
      })

      if (emailError) {
        console.error('Erreur envoi email:', emailError)
        throw emailError
      }
    } else {
      console.warn('Resend API key non configurée - email non envoyé')
    }

    // Sauvegarder la demande dans la base de données
    const { error: dbError } = await supabase
      .from('quotation_requests')
      .insert({
        user_id: user.id,
        email: user.email,
        company_name: data.clientInfo.company,
        contact_name: data.clientInfo.name,
        phone: data.clientInfo.phone,
        trajet: data.trajet,
        zone: data.zone,
        pole: data.pole,
        articles: data.articles,
        transport: data.transport,
        pricing: data.pricing,
        selected_delivery: data.selectedDelivery,
        options: data.options,
        status: 'pending'
      })

    if (dbError) {
      console.error('Erreur base de données:', dbError)
      // On ne fait pas échouer la requête si l'email est parti
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de la demande' },
      { status: 500 }
    )
  }
}