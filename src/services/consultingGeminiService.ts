import { IntakeData, DebateMessage, AgentRole } from '../types/consulting';

// Edge Function URL — configured via env (fallback to GENERATE_STRATEGY_URL for backward compatibility)
const CONSULTING_ENGINE_URL = import.meta.env.VITE_CONSULTING_ENGINE_URL || import.meta.env.VITE_GENERATE_STRATEGY_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: log the resolved URL at module load time (remove after confirming fix)
if (!CONSULTING_ENGINE_URL) {
    console.error('[ConsultingEngine] CRITICAL: No API URL found. Check VITE_CONSULTING_ENGINE_URL or VITE_GENERATE_STRATEGY_URL env vars.');
} else {
    console.log('[ConsultingEngine] API URL resolved:', CONSULTING_ENGINE_URL);
}

// Helper for retry logic
async function withRetry<T>(fn: () => Promise<T>, retries = 1, delay = 5000): Promise<T | null> {
    try {
        return await fn();
    } catch (error) {
        if (retries > 0) {
            console.warn(`Request failed. Retrying in ${delay}ms...`, error);
            await new Promise(res => setTimeout(res, delay));
            return withRetry(fn, retries - 1, delay);
        }
        console.error("Max retries reached.", error);
        return null;
    }
}

async function callEdgeFunction(body: Record<string, any>): Promise<string> {
    const response = await fetch(CONSULTING_ENGINE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.text || '';
}

// 1. Market Research
export const performMarketResearch = async (data: IntakeData): Promise<string> => {
    const result = await withRetry(async () => {
        return callEdgeFunction({
            action: 'research',
            data: {
                companyOneLiner: data.companyOneLiner,
                industry: data.industry,
                competitors: data.competitors,
            },
        });
    });

    return result || "Market intelligence unavailable due to connection limits. Proceeding with internal logic models.";
};

// 2. The War Room (Dynamic Debate)
export const generateDebateTurn = async (
    role: AgentRole,
    data: IntakeData,
    research: string,
    history: DebateMessage[],
    round: number,
    lastArbiterCommand?: string
): Promise<{ text: string; command?: string }> => {
    const result = await withRetry(async () => {
        return callEdgeFunction({
            action: 'debate',
            role,
            data: {
                companyOneLiner: data.companyOneLiner,
                coreProblem: data.coreProblem,
            },
            research,
            history: history.map(h => ({
                agent: h.agent,
                text: h.text,
                round: h.round,
            })),
            round,
            lastArbiterCommand,
        });
    });

    if (!result) {
        return { text: "Signal lost due to high network traffic. Proceeding to next phase...", command: 'normal' };
    }

    const fullText = result;
    let cleanText = fullText;
    let command = 'normal';

    if (role === 'arbiter') {
        if (fullText.includes('[VETO]')) command = 'veto';
        else if (fullText.includes('[MECE CHECK]')) command = 'mece_check';
        else if (fullText.includes('[CONSENSUS GRANTED]')) command = 'consensus';

        cleanText = fullText.replace(/\[(VETO|MECE CHECK|CONSENSUS GRANTED|CONTINUE)\]/g, '').trim();
    }

    return { text: cleanText, command };
};

// 3. Final Synthesis
export const generateSynthesis = async (
    data: IntakeData,
    research: string,
    history: DebateMessage[]
): Promise<string> => {
    const result = await withRetry(async () => {
        return callEdgeFunction({
            action: 'synthesis',
            data,
            research,
            history: history.map(h => ({
                agent: h.agent,
                text: h.text,
                round: h.round,
            })),
        });
    });

    return result || "Final report generation failed due to API limits. Please review the debate logs above manually.";
};
