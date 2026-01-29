import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { prompt } = await req.json()
        const apiKey = Deno.env.get('GEMINI_API_KEY')

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not found in environment variables')
        }

        // Enhanced Prompt Wrapper for Maximum Impact
        const enhancedPrompt = `
        CRITICAL INSTRUCTION: You are an elite MBB (McKinsey/Bain/BCG) Senior Partner. 
        Provide a maximalist, extremely detailed strategic analysis. 
        Do not hold back on complexity or depth.
        
        REQUIRED OUTPUT FRAMEWORKS:
        1. **BCG Growth-Share Matrix**: Position the business units/products.
        2. **McK 7S Framework**: Analyze broad organizational fit.
        3. **Porter's Five Forces**: Deep industry scrutiny.
        
        ${prompt}
        
        Ensure the "executive_summary" is rich, actionable, and at least 300 words.
        Mark the recommendation as "AI-Generated Strategic Advisory - Verification Advised".
        `

        // Using user-specified model: gemini-3-flash-preview
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: enhancedPrompt }] }],
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ]
            })
        })

        const data = await response.json()

        // Propagate the actual status code from Gemini so frontend knows if it failed
        if (!response.ok) {
            console.error("Gemini API Error:", data)
            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: response.status,
            })
        }

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
