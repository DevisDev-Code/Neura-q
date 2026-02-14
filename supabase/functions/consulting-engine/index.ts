import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── PROVIDER HELPERS ──

async function callGemini(apiKey: string, prompt: string, systemInstruction?: string, useGrounding = false) {
    const requestBody: any = {
        contents: [{ parts: [{ text: prompt }] }],
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
    }
    if (systemInstruction) {
        requestBody.systemInstruction = { parts: [{ text: systemInstruction }] }
    }
    if (useGrounding) {
        requestBody.tools = [{ googleSearch: {} }]
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
    )
    const result = await response.json()
    if (!response.ok) throw new Error(JSON.stringify(result))

    let text = result.candidates?.[0]?.content?.parts?.[0]?.text || ""

    // Append grounding sources if available
    if (useGrounding && result.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        const links = result.candidates[0].groundingMetadata.groundingChunks
            .map((c: any) => c.web?.uri).filter(Boolean).map((u: string) => `- ${u}`).join('\n')
        if (links) text += `\n\n### Intelligence Sources\n${links}`
    }
    return text
}

async function callGroq(apiKey: string, prompt: string, systemInstruction?: string) {
    const messages: any[] = []
    if (systemInstruction) messages.push({ role: "system", content: systemInstruction })
    messages.push({ role: "user", content: prompt })

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages, temperature: 0.7, max_tokens: 1024 })
    })
    const result = await response.json()
    if (!response.ok) throw new Error(JSON.stringify(result))
    return result.choices?.[0]?.message?.content || ""
}

// ── MAIN HANDLER ──

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { action, data, research, history, round, lastArbiterCommand, role } = await req.json()

        const geminiKey1 = Deno.env.get('GEMINI_API_KEY')
        const geminiKey2 = Deno.env.get('GEMINI_API_KEY_2')
        const groqKey = Deno.env.get('GROQ_API_KEY')

        if (!geminiKey1) throw new Error('GEMINI_API_KEY not found')

        // Rotate Gemini keys: research → key1, synthesis → key2 (fallback to key1)
        const researchKey = geminiKey1
        const synthesisKey = geminiKey2 || geminiKey1
        const debateFallbackKey = geminiKey2 || geminiKey1  // if no Groq, alternate Gemini keys

        // ── ACTION: RESEARCH (Gemini only — needs Google Search grounding) ──
        if (action === 'research') {
            const prompt = `
ACT AS: Elite Market Intelligence Unit for a top-tier strategy firm.
TASK: Conduct a ruthless, fact-based market audit for:

Entity: ${data.companyOneLiner}
Industry: ${data.industry}
Competitors: ${data.competitors}

OUTPUT REQUIREMENTS:
1. MARKET REALITY: Current CAGR, major headwinds, and recent high-profile failures in this space.
2. COMPETITIVE MOAT ANALYSIS: How specifically are ${data.competitors} positioning? Where are they vulnerable?
3. THE GRAVEYARD: Cite 1-2 real-world examples of companies that failed doing this.

Keep it under 300 words. Bullet points. Brutal honesty.`

            const text = await callGemini(researchKey, prompt, undefined, true)
            return new Response(JSON.stringify({ text }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
            })
        }

        // ── ACTION: DEBATE (Groq for speed if available, else Gemini) ──
        if (action === 'debate') {
            const historyText = (history || []).map((h: any) =>
                `[${h.agent.toUpperCase()} - ROUND ${h.round}]: ${h.text}`
            ).join('\n\n')

            let systemInstruction = ""
            let prompt = ""

            if (role === 'architect') {
                systemInstruction = `IDENTITY: THE ARCHITECT (Agent Alpha). BACKGROUND: Ex-McKinsey Senior Partner. TRAITS: Unflappable, structured, thinks in frameworks (Porter's 5 Forces, SWOT). GOAL: Build the strongest strategic case. STYLE: Use headers (Pillar 1, Pillar 2). Professional. Never emotional. CONTEXT: Client is ${data.companyOneLiner}. Problem: ${data.coreProblem}.`
                prompt = `Current Round: ${round}\n\nHISTORY:\n${historyText}\n\nRESEARCH:\n${research}\n\nINSTRUCTION:\n${round === 1 ? "Opening Statement. Define the 3 Strategic Pillars of success." : "Defend the strategy against the Destroyer's attacks. Use data logic."}\n${lastArbiterCommand === 'veto' ? "PREVIOUS TURN WAS VETOED. Re-state with specific quantifiers." : ""}\n\nKeep it under 100 words. Be concise.`
            } else if (role === 'destroyer') {
                systemInstruction = `IDENTITY: THE DESTROYER (Agent Beta). BACKGROUND: Short-seller & Litigation Attorney. TRAITS: Cynical, aggressive, pattern-matches to failures (WeWork, Theranos). GOAL: Find the 'Zero' (the flaw that kills the business). STYLE: Direct attacks. "Show me the math."`
                prompt = `Current Round: ${round}\nHISTORY:\n${historyText}\n\nINSTRUCTION:\nAttack the Architect's last point. Find the hidden liability, regulatory risk, or unit economics flaw. Cite a real-world failure.\n\nKeep it under 100 words. Be concise.`
            } else if (role === 'arbiter') {
                systemInstruction = `IDENTITY: THE ARBITER. BACKGROUND: Ex-IMF Economist & Philosopher. TRAITS: Neutral, surgical, enforces MECE. POWERS: VETO (reset round), MECE CHECK (audit), CONSENSUS GRANTED.\n\nRULES:\n1. Vague/repetitive -> [VETO]\n2. Round == 2 -> [MECE CHECK]\n3. Round >= 3 -> [CONSENSUS GRANTED]\n4. Otherwise -> [CONTINUE]`
                prompt = `Current Round: ${round}\nHISTORY:\n${historyText}\n\nINSTRUCTION:\nCritique the exchange. Point out logical fallacies.\n\nMANDATORY: End your response with exactly one of these tags on a new line:\n[VETO]\n[MECE CHECK]\n[CONSENSUS GRANTED]\n[CONTINUE]\n\nKeep critique under 80 words.`
            }

            let text: string
            // Use Groq for debate if available (much faster), fallback to Gemini
            if (groqKey) {
                text = await callGroq(groqKey, prompt, systemInstruction)
            } else {
                text = await callGemini(debateFallbackKey, prompt, systemInstruction)
            }

            return new Response(JSON.stringify({ text }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
            })
        }

        // ── ACTION: SYNTHESIS (Gemini — quality matters) ──
        if (action === 'synthesis') {
            const historyText = (history || []).map((h: any) => `${h.agent.toUpperCase()}: ${h.text}`).join('\n\n')
            const prompt = `
IDENTITY: NEURA-Q FINAL REPORT GENERATOR.
TASK: Compile the "Adversarial Intelligence Report".

CONTEXT: ${JSON.stringify(data)}
RESEARCH: ${research}
DEBATE LOG: ${historyText}

STRICT OUTPUT FORMAT (Markdown):

# NEURA-Q INTELLIGENCE REPORT
**Risk Classification:** [GREEN / AMBER / RED]
**Viability Score:** [1-10]

## 1. Executive Summary
(Ruthless, 3 sentences max)

## 2. Strategic Situation Map
(BCG Growth-Share Matrix. Porter's 5 Forces summary.)

## 3. MECE Risk Registry
| Risk Cluster | Severity (1-5) | Finding |
| :--- | :---: | :--- |
| Market Viability | ... | ... |
| Financial Model | ... | ... |
| Regulatory | ... | ... |
| Competitive Moat | ... | ... |

## 4. The War Room Verdict
### 4A. Validated Strengths (Architect's Wins)
### 4B. Confirmed Vulnerabilities (Destroyer's Wins)
### 4C. The Dead Zones (Arbiter's Findings)

## 5. Strategic Directives
**Priority Matrix (High Impact / Do Now):**
* Action 1
* Action 2

**KILL CONDITION:** [Specific scenario to abandon]

## 6. Confidence & Disclaimer
*Arbiter Confidence Level:* [%]
*Neura-Q is an analytical tool, not legal advice.*`

            const text = await callGemini(synthesisKey, prompt)
            return new Response(JSON.stringify({ text }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
            })
        }

        throw new Error(`Unknown action: ${action}`)

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
        })
    }
})
