import { useState } from 'react'
import { supabase } from '../lib/supabase'

export const useTokenEnhance = () => {
    const [enhancingField, setEnhancingField] = useState<string | null>(null)

    const enhanceText = async (text: string): Promise<string | null> => {
        try {
            const { data: sessionData } = await supabase.auth.getSession()
            const token = sessionData.session?.access_token

            // If user provided a custom key in env, use that? 
            // User said "add environment variable for that too... i will add api key myself".
            // But typically this logic goes through a backend proxy (Supabase Function) to hide keys, 
            // or if it's a direct API call to a service (like OpenAI), we'd use the key.
            // Based on previous code, it was calling a Supabase Function 'enhance-prompt'.
            // If the user wants to add an API KEY themselves, maybe they mean for a different service?
            // Or maybe they want to pass that key to the function?
            // I will implement it such that it tries to use the VITE_ENHANCE_API_URL.

            const endpoint = import.meta.env.VITE_ENHANCE_API_URL
            const apiKey = import.meta.env.VITE_ENHANCE_API_KEY

            // If we have an API Key, we might need to send it in headers.
            // Assuming standard Bearer token for Supabase functions, but user might override or add 'x-api-key'

            const headers: any = {
                'Content-Type': 'application/json'
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            if (apiKey) {
                headers['x-api-key'] = apiKey
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({ text })
            })

            if (!res.ok) throw new Error(`Enhance failed: ${res.status}`)

            const json = await res.json()
            return json.enhanced || null
        } catch (error) {
            console.error('Enhance error:', error)
            throw error
        }
    }

    return { enhanceText, enhancingField, setEnhancingField }
}
