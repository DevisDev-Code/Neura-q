import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface EnhanceRequest {
	text: string
	context?: string
}

serve(async (req) => {
	// Handle CORS preflight requests
	if (req.method === 'OPTIONS') {
		return new Response(null, { headers: corsHeaders })
	}

	try {
		const { text, context }: EnhanceRequest = await req.json()

		if (!text || text.trim().length === 0) {
			throw new Error('Text is required for enhancement')
		}

		// Get Gemini API key from environment
		const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
		if (!geminiApiKey) {
			throw new Error('Gemini API key not configured')
		}

		// Enhanced prompt for better text improvement
		const enhancementPrompt = `
You are an expert writing assistant. Please enhance the following text to make it clearer, more detailed, and more effective while preserving the original meaning and intent.

Guidelines:
- Maintain the original tone and purpose
- Add relevant details and context where helpful
- Improve clarity and readability
- Fix any grammar or spelling issues
- Make it more engaging and specific
- Keep it concise but comprehensive
- Preserve any technical terms or specific requirements

${context ? `Context: This text is for ${context}` : ''}

Original text to enhance:
"${text}"

Please return only the enhanced version without any explanations or additional commentary.
`

		// Call Gemini API
		const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				contents: [{
					parts: [{
						text: enhancementPrompt
					}]
				}],
				generationConfig: {
					temperature: 0.3,
					topK: 32,
					topP: 1,
					maxOutputTokens: 2048,
				}
			})
		})

		if (!geminiResponse.ok) {
			throw new Error(`Gemini API error: ${geminiResponse.statusText}`)
		}

		const geminiResult = await geminiResponse.json()

		if (!geminiResult.candidates || geminiResult.candidates.length === 0) {
			throw new Error('No enhancement generated')
		}

		const enhancedText = geminiResult.candidates[0].content.parts[0].text.trim()

		return new Response(
			JSON.stringify({ enhancedText }),
			{
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 200,
			}
		)

	} catch (error) {
		console.error('Enhancement error:', error)
		return new Response(
			JSON.stringify({
				error: error instanceof Error ? error.message : 'Enhancement failed',
				details: 'Please try again or check your input'
			}),
			{
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 500,
			}
		)
	}
})

