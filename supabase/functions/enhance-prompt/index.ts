/// <reference path="./deno.d.ts" />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

type EnhanceRequest = {
	text?: string
}

serve(async (req) => {
	const origin = req.headers.get('Origin') || '*'
	const corsHeaders: Record<string, string> = {
		'Access-Control-Allow-Origin': origin,
		Vary: 'Origin',
		'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
		'Access-Control-Allow-Methods': 'POST, OPTIONS'
	}

	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders })
	}

	try {
		if (req.method !== 'POST') {
			return new Response(JSON.stringify({ error: 'Method not allowed' }), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 405
			})
		}

		const { text }: EnhanceRequest = await req.json().catch(() => ({}))
		if (!text || typeof text !== 'string') {
			return new Response(JSON.stringify({ error: 'Invalid payload: missing text' }), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 400
			})
		}

		const apiKey = Deno.env.get('GEMINI_API_KEY')
		if (!apiKey) {
			return new Response(JSON.stringify({ error: 'Server misconfiguration: GEMINI_API_KEY missing' }), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 500
			})
		}

		const prompt = `Enhance the following text for clarity, tone, and impact while preserving the original intent. Return only the improved text without additional commentary.\n\nText:\n${text}`

		const model = 'models/gemini-2.5-flash'
		const resp = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					contents: [
						{
							role: 'user',
							parts: [{ text: prompt }]
						}
					],
					generationConfig: {
						temperature: 0.4,
						topK: 40,
						topP: 0.9,
						maxOutputTokens: 1024
					}
				})
			}
		)

		if (!resp.ok) {
			const text = await resp.text()
			throw new Error(`Gemini error: ${resp.status} ${resp.statusText} - ${text}`)
		}

		const data = await resp.json()
		const enhanced =
			data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('') || ''

		return new Response(JSON.stringify({ enhanced }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			status: 200
		})
	} catch (err) {
		console.error('enhance-prompt error:', err)
		return new Response(
			JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
			{
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 500
			}
		)
	}
})

