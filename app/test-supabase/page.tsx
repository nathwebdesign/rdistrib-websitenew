"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabase() {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<any>(null)

  const testConnection = async () => {
    try {
      setError(null)
      setResult('Testing...')
      
      // Test 1: Vérifier la connexion
      const { data, error: testError } = await supabase
        .from('account_requests')
        .select('count')
        .limit(1)
      
      if (testError) {
        setError(`Erreur Supabase: ${testError.message}`)
        return
      }
      
      setResult('✅ Connexion Supabase OK!')
    } catch (err) {
      setError(`Erreur: ${err}`)
    }
  }

  const testInsert = async () => {
    try {
      setError(null)
      setResult('Inserting...')
      
      const testEmail = `test-${Date.now()}@example.com`
      
      const { data, error: insertError } = await supabase
        .from('account_requests')
        .insert([{
          email: testEmail,
          contact_person: 'Test User',
          status: 'pending'
        }])
        .select()
      
      if (insertError) {
        setError(`Erreur insert: ${insertError.message}`)
        return
      }
      
      setResult(`✅ Insert OK! Data: ${JSON.stringify(data, null, 2)}`)
    } catch (err) {
      setError(`Erreur: ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-2xl font-bold mb-8">Test Supabase Connection</h1>
        
        <div className="space-y-4">
          <button
            onClick={testConnection}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Connection
          </button>
          
          <button
            onClick={testInsert}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-4"
          >
            Test Insert
          </button>
        </div>

        {result && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded">
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded">
            <pre className="whitespace-pre-wrap text-red-600">{error}</pre>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Variables d'environnement:</h2>
          <p>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Défini' : '❌ Manquant'}</p>
          <p>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Défini' : '❌ Manquant'}</p>
        </div>
      </div>
    </div>
  )
}