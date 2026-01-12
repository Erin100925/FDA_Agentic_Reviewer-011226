export type Language = 'en' | 'tc';
export type Theme = 'light' | 'dark';

export interface ArtStyle {
  id: string;
  name: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    fontFamily: string;
  };
  description: string;
}

export interface AgentProfile {
  name: string;
  description: string;
  model_provider: 'google' | 'openai';
  model_name: string;
  temperature: number;
  system_prompt: string;
  skills: string[];
}

export interface AgentConfig {
  fda_summarizer: AgentProfile;
  fda_guidance_expert: AgentProfile;
  note_keeper: AgentProfile;
}

export type MagicType = 'transformation' | 'keywords' | 'pattern' | 'narrative' | 'trend' | 'socratic' | 'mood';

export interface MagicDef {
  id: MagicType;
  name: string;
  icon: string;
  prompt_modifier: string;
}
