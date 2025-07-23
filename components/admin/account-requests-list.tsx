"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getAccountRequests, approveAccountRequest, rejectAccountRequest, getCurrentUser } from '@/lib/auth'
import type { AccountRequest } from '@/lib/supabase'

export default function AccountRequestsList() {
  const [requests, setRequests] = useState<AccountRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      console.log('Chargement des demandes...')
      // Utilisons le nouvel endpoint direct
      const response = await fetch('/api/admin/account-requests-direct')
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erreur réponse:', errorData)
        throw new Error(errorData.error || 'Erreur lors de la récupération')
      }
      
      const data = await response.json()
      console.log('Data reçue:', data)
      console.log('Nombre de demandes:', Array.isArray(data) ? data.length : 0)
      
      if (Array.isArray(data)) {
        setRequests(data)
      } else {
        console.error('Les données reçues ne sont pas un tableau:', data)
        setRequests([])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error)
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId)
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('Utilisateur non connecté')
      
      await approveAccountRequest(requestId, user.id)
      await loadRequests() // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error)
      alert('Erreur lors de l\'approbation du compte')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (requestId: string) => {
    if (!rejectReason.trim()) {
      alert('Veuillez indiquer une raison pour le rejet')
      return
    }

    setProcessingId(requestId)
    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('Utilisateur non connecté')
      
      await rejectAccountRequest(requestId, user.id, rejectReason)
      await loadRequests() // Recharger la liste
      setShowRejectModal(null)
      setRejectReason('')
    } catch (error) {
      console.error('Erreur lors du rejet:', error)
      alert('Erreur lors du rejet du compte')
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    
    const labels = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Demandes de création de compte</h2>
        <p className="text-gray-600 text-sm mt-1">
          Total: {requests.length} demande(s) | En attente: {requests.filter(r => r.status === 'pending').length}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entreprise
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {request.contact_person}
                    </div>
                    <div className="text-sm text-gray-500">{request.email}</div>
                    {request.phone && (
                      <div className="text-sm text-gray-500">{request.phone}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{request.company_name || '-'}</div>
                  {request.siret && (
                    <div className="text-sm text-gray-500">SIRET: {request.siret}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(request.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(request.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        disabled={processingId === request.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setShowRejectModal(request.id)}
                        disabled={processingId === request.id}
                      >
                        Rejeter
                      </Button>
                    </div>
                  )}
                  {request.status === 'rejected' && request.rejection_reason && (
                    <div className="text-xs text-red-600">
                      Raison: {request.rejection_reason}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune demande de compte</p>
          <p className="text-xs text-gray-400 mt-2">Vérifiez la console pour les logs de débogage</p>
        </div>
      )}

      {/* Modal de rejet */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rejeter la demande
            </h3>
            <p className="text-gray-600 mb-4">
              Veuillez indiquer la raison du rejet :
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Raison du rejet..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              rows={3}
            />
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(null)
                  setRejectReason('')
                }}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectReason.trim() || processingId === showRejectModal}
              >
                Confirmer le rejet
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}