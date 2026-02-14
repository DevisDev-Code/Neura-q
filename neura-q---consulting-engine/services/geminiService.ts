import { GoogleGenAI } from "@google/genai";
import { IntakeData, DebateMessage, AgentRole } from "../types";

// --- API KEY CONFIGURATION ---
// Assigned separate keys for each role to distribute quota usage.
// If specific keys aren't set, it falls back to the main API_KEY.
const API_KEYS = {
  research: process.env.API_KEY_RESEARCH || process.env.API_KEY,
  architect: process.env.API_KEY_ARCHITECT || process.env.API_KEY,
  destroyer: process.env.API_KEY_DESTROYER || process.env.API_KEY,
  arbiter: process.env.API_KEY_ARBITER || process.env.API_KEY
};

const getClient = (keySource: keyof typeof API_KEYS) => {
  const key = API_KEYS[keySource];
  if (!key) throw new Error(`No API Key found for ${keySource}`);
  return new GoogleGenAI({ apiKey: key });
};

// Helper for retry logic to prevent "shut down" on transient errors
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

// 1. Market Research
export const performMarketResearch = async (data: IntakeData): Promise<string> => {
  const ai = getClient('research');
  
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
    
    Keep it under 300 words. Bullet points. Brutal honesty.
  `;

  const result = await withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });
    
    let resultText = response.text || "Intelligence gathering failed.";
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        const links = response.candidates[0].groundingMetadata.groundingChunks
          .map(chunk => chunk.web?.uri)
          .filter(uri => uri)
          .map(uri => `- ${uri}`)
          .join('\n');
        if (links) resultText += `\n\n### Intelligence Sources\n${links}`;
      }
      return resultText;
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
  const ai = getClient(role);
  
  const historyText = history.map(h => 
    `[${h.agent.toUpperCase()} - ROUND ${h.round}]: ${h.text}`
  ).join('\n\n');

  let systemInstruction = "";
  let taskPrompt = "";

  // --- PERSONA DEFINITIONS ---
  if (role === 'architect') {
    systemInstruction = `
      IDENTITY: THE ARCHITECT (Agent Alpha).
      BACKGROUND: Ex-McKinsey Senior Partner.
      TRAITS: Unflappable, structured, thinks in frameworks (Porter's 5 Forces, SWOT).
      GOAL: Build the strongest strategic case for the client.
      STYLE: Use headers (Pillar 1, Pillar 2). Professional. Never emotional.
      CONTEXT: The Client is ${data.companyOneLiner}. Problem: ${data.coreProblem}.
    `;
    taskPrompt = `
      Current Round: ${round}
      
      HISTORY SO FAR:
      ${historyText}
      
      MARKET INTEL:
      ${research}

      YOUR INSTRUCTION:
      ${round === 1 ? "Opening Statement. Define the 3 Strategic Pillars of success. Use the 'Jobs-to-be-Done' framework." : "Defend the strategy against the Destroyer's attacks. Use data logic. Do not concede unless the logic is irrefutable."}
      
      ${lastArbiterCommand === 'veto' ? "PREVIOUS TURN WAS VETOED. You were too vague. Re-state your argument with specific quantifiers and logic." : ""}
      
      Keep it under 100 words. Be concise.
    `;
  } 
  
  else if (role === 'destroyer') {
    systemInstruction = `
      IDENTITY: THE DESTROYER (Agent Beta).
      BACKGROUND: Short-seller & Litigation Attorney.
      TRAITS: Cynical, aggressive, aggressive pattern-matching to failures (WeWork, Theranos).
      GOAL: Find the 'Zero' (the flaw that kills the business).
      STYLE: Direct attacks. "Show me the math." "This is delusional."
    `;
    taskPrompt = `
      Current Round: ${round}
      HISTORY SO FAR:
      ${historyText}
      
      YOUR INSTRUCTION:
      Attack the Architect's last point. Find the hidden liability, the regulatory risk, or the unit economics flaw. Cite a specific real-world failure that looks like this.
      
      Keep it under 100 words. Be concise.
    `;
  } 
  
  else if (role === 'arbiter') {
    systemInstruction = `
      IDENTITY: THE ARBITER.
      BACKGROUND: Ex-IMF Economist & Philosopher.
      TRAITS: Neutral, surgical, enforces MECE (Mutually Exclusive, Collectively Exhaustive).
      GOAL: Force depth. Do not take sides.
      POWERS: You can VETO (reset round), Call MECE CHECK (audit), or Grant CONSENSUS.
      
      RULES FOR LIGHT MODE:
      1. If arguments are vague/repetitive -> [VETO]
      2. If Round == 2 -> [MECE CHECK]
      3. If Round >= 3 -> [CONSENSUS GRANTED] (Prioritize finishing early to save resources)
      4. Otherwise -> [CONTINUE]
    `;
    taskPrompt = `
      Current Round: ${round}
      HISTORY SO FAR:
      ${historyText}
      
      YOUR INSTRUCTION:
      Critique the exchange. Point out logical fallacies.
      
      MANDATORY: End your response with exactly one of these tags on a new line:
      [VETO]
      [MECE CHECK]
      [CONSENSUS GRANTED]
      [CONTINUE]
      
      Keep the critique under 80 words.
    `;
  }

  const result = await withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: taskPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });
    return response.text;
  });

  if (!result) {
    // Graceful fallback prevents the loop from crashing
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
  const ai = getClient('arbiter');
  const historyText = history.map(h => `${h.agent.toUpperCase()}: ${h.text}`).join('\n\n');
  
  const prompt = `
    IDENTITY: NEURA-Q FINAL REPORT GENERATOR.
    TASK: Compile the "Adversarial Intelligence Report" based on the war room debate.

    CONTEXT:
    ${JSON.stringify(data)}

    RESEARCH:
    ${research}

    DEBATE LOG:
    ${historyText}

    STRICT OUTPUT FORMAT (Markdown):

    # NEURA-Q INTELLIGENCE REPORT
    **Risk Classification:** [GREEN / AMBER / RED]
    **Viability Score:** [1-10]

    ## 1. Executive Summary
    (Ruthless, 3 sentences max)

    ## 2. Strategic Situation Map
    (Place them in the BCG Growth-Share Matrix. Apply Porter's 5 Forces summary.)

    ## 3. MECE Risk Registry
    | Risk Cluster | Severity (1-5) | Finding |
    | :--- | :---: | :--- |
    | Market Viability | ... | ... |
    | Financial Model | ... | ... |
    | Regulatory | ... | ... |
    | Competitive Moat | ... | ... |

    ## 4. The War Room Verdict
    ### 4A. Validated Strengths (Architect's Wins)
    * ...
    ### 4B. Confirmed Vulnerabilities (Destroyer's Wins)
    * ...
    ### 4C. The Dead Zones (Arbiter's Findings)
    * ...

    ## 5. Strategic Directives
    **Priority Matrix (High Impact / Do Now):**
    * Action 1
    * Action 2

    **KILL CONDITION:** [Specific scenario where they must abandon the project]

    ## 6. Confidence & Disclaimer
    *Arbiter Confidence Level:* [%]
    *Neura-Q is an analytical tool, not legal advice.*
  `;

  const result = await withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text;
  });

  return result || "Final report generation failed due to API limits. Please review the debate logs above manually.";
};