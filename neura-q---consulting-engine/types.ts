export type Phase = 'welcome' | 'intake' | 'research' | 'debate' | 'synthesis';

export interface IntakeData {
  companyOneLiner: string;
  industry: string;
  size: string;
  idealCustomer: string;
  coreProblem: string;
  attempts: string;
  urgency: number; // 1-100 slider
  successVision: string;
  budget: string;
  constraints: string;
  competitors: string;
  clarity: number; // 1-5
  adviceType: string[];
}

export type AgentRole = 'architect' | 'destroyer' | 'arbiter';

export interface DebateMessage {
  agent: AgentRole;
  text: string;
  round: number;
  timestamp: number;
  type?: 'normal' | 'veto' | 'mece_check' | 'consensus';
}

export interface AppState {
  phase: Phase;
  apiKey: string;
}
