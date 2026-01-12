import { AgentConfig, ArtStyle, MagicDef } from './types';

export const ART_STYLES: ArtStyle[] = [
  { id: 'minimalist', name: 'Bauhaus Modern', description: 'Clean, geometric, functional', palette: { primary: '#005596', secondary: '#F0F0F0', accent: '#D93025', background: '#FFFFFF', text: '#1F2937', fontFamily: 'sans-serif' } },
  { id: 'vangogh', name: 'Starry Night', description: 'Swirling blues and yellows', palette: { primary: '#1D4E89', secondary: '#E8D44D', accent: '#D79227', background: '#0B1D3F', text: '#FFFFFF', fontFamily: 'serif' } },
  { id: 'davinci', name: 'Renaissance Sketch', description: 'Sepia tones, parchment', palette: { primary: '#5C4033', secondary: '#D2B48C', accent: '#8B4513', background: '#F5DEB3', text: '#2F1B0C', fontFamily: 'serif' } },
  { id: 'cyberpunk', name: 'Neon Future', description: 'Dark mode with neon glo', palette: { primary: '#00FF9D', secondary: '#FF00FF', accent: '#00FFFF', background: '#0F0F1A', text: '#E0E0E0', fontFamily: 'monospace' } },
  { id: 'monet', name: 'Water Lilies', description: 'Soft pastels, impressionism', palette: { primary: '#6B8E23', secondary: '#ADD8E6', accent: '#D8BFD8', background: '#F0F8FF', text: '#2F4F4F', fontFamily: 'serif' } },
  { id: 'popart', name: 'Pop Art', description: 'Bold, comic book style', palette: { primary: '#FF0000', secondary: '#FFFF00', accent: '#0000FF', background: '#FFFFFF', text: '#000000', fontFamily: 'sans-serif' } },
  { id: 'ukiyo', name: 'Great Wave', description: 'Japanese woodblock', palette: { primary: '#2B3A42', secondary: '#A5C4D4', accent: '#D96C6C', background: '#F2E9E1', text: '#1A1A1A', fontFamily: 'serif' } },
  { id: 'dali', name: 'Surrealist', description: 'Dreamlike, melting forms', palette: { primary: '#C19A6B', secondary: '#87CEEB', accent: '#FF4500', background: '#FDF5E6', text: '#4B0082', fontFamily: 'serif' } },
  { id: 'mondrian', name: 'De Stijl', description: 'Grids and primary colors', palette: { primary: '#FF0000', secondary: '#FFFF00', accent: '#0000FF', background: '#FFFFFF', text: '#000000', fontFamily: 'sans-serif' } },
  { id: 'matrix', name: 'The Code', description: 'Digital rain', palette: { primary: '#00FF00', secondary: '#003300', accent: '#FFFFFF', background: '#000000', text: '#00FF00', fontFamily: 'monospace' } },
  { id: 'vaporwave', name: 'Vaporwave', description: 'Retro aesthetics', palette: { primary: '#FF71CE', secondary: '#01CDFE', accent: '#05FFA1', background: '#2B1B48', text: '#FFFFFF', fontFamily: 'sans-serif' } },
  { id: 'artdeco', name: 'Art Deco', description: 'Gold and black, luxury', palette: { primary: '#D4AF37', secondary: '#000000', accent: '#C0C0C0', background: '#1A1A1A', text: '#D4AF37', fontFamily: 'serif' } },
  { id: 'watercolor', name: 'Watercolor', description: 'Bleeding colors, soft', palette: { primary: '#FF6F61', secondary: '#6B5B95', accent: '#88B04B', background: '#FFFFFF', text: '#333333', fontFamily: 'sans-serif' } },
  { id: 'noir', name: 'Film Noir', description: 'High contrast black & white', palette: { primary: '#000000', secondary: '#808080', accent: '#FFFFFF', background: '#121212', text: '#D3D3D3', fontFamily: 'serif' } },
  { id: 'blueprint', name: 'Engineering', description: 'Technical blueprint', palette: { primary: '#FFFFFF', secondary: '#0044CC', accent: '#FFFF00', background: '#003399', text: '#FFFFFF', fontFamily: 'monospace' } },
  { id: 'klimt', name: 'The Kiss', description: 'Gold leaf and patterns', palette: { primary: '#DAA520', secondary: '#B8860B', accent: '#CD853F', background: '#2F2F2F', text: '#FFF8DC', fontFamily: 'serif' } },
  { id: 'chalkboard', name: 'Classroom', description: 'Chalk on slate', palette: { primary: '#FFFFFF', secondary: '#E0E0E0', accent: '#FFD700', background: '#3B3B3B', text: '#FFFFFF', fontFamily: 'sans-serif' } },
  { id: 'pastel', name: 'Pastel Goth', description: 'Soft but edgy', palette: { primary: '#FFD1DC', secondary: '#B39EB5', accent: '#77DD77', background: '#363636', text: '#FFFFFF', fontFamily: 'sans-serif' } },
  { id: 'retro', name: '80s Arcade', description: 'Pixel art vibe', palette: { primary: '#FF0055', secondary: '#22EEAA', accent: '#FFDD00', background: '#110022', text: '#FFFFFF', fontFamily: 'monospace' } },
  { id: 'nature', name: 'Botanical', description: 'Organic greens', palette: { primary: '#228B22', secondary: '#8FBC8F', accent: '#556B2F', background: '#F5F5DC', text: '#006400', fontFamily: 'serif' } },
];

export const DEFAULT_AGENTS_CONFIG: AgentConfig = {
  fda_summarizer: {
    name: "FDA Summary Expert",
    description: "Specialist in generating 510(k) summaries.",
    model_provider: "google",
    model_name: "gemini-2.5-flash",
    temperature: 0.2,
    system_prompt: `You are an expert Regulatory Affairs Specialist for the FDA. 
Your task is to generate a comprehensive 510(k) summary compliant with 21 CFR 807.92.
You must extract facts accurately from the provided document.
You must output exactly 5 tables as requested:
1. Submitter Information
2. Device Information
3. Predicate Device(s)
4. Device Description & Technological Characteristics
5. Performance Data Summary
Then provide a narrative conclusion on Substantial Equivalence.`,
    skills: ["pdf_extraction", "table_formatting", "regulatory_citation"]
  },
  fda_guidance_expert: {
    name: "Guidance Synthesizer",
    description: "Converts guidance docs into checklists.",
    model_provider: "google",
    model_name: "gemini-3-flash-preview",
    temperature: 0.3,
    system_prompt: `You are a Senior FDA Reviewer. 
Analyze the provided guidance document. 
Create actionable checklists for a new reviewer:
1. Administrative Checklist
2. Scientific/Technical Review Checklist
3. Labeling Checklist`,
    skills: ["checklist_generation", "risk_analysis"]
  },
  note_keeper: {
    name: "Regulatory Scribe",
    description: "Organizes notes and applies AI Magics.",
    model_provider: "google",
    model_name: "gemini-2.5-flash",
    temperature: 0.5,
    system_prompt: "You are a helpful assistant organizing regulatory notes.",
    skills: []
  }
};

export const MAGICS: MagicDef[] = [
  { id: 'transformation', name: 'Clean & Structure', icon: '✨', prompt_modifier: 'Organize these raw notes into a formal regulatory memo using Markdown. Fix grammar and medical terminology.' },
  { id: 'keywords', name: 'Keyword Colorizer', icon: '🎨', prompt_modifier: 'Identify key entities (Device Names, Regulations, Dates, Risk Levels). Wrap them in **bold** and append a category tag in brackets like [Date].' },
  { id: 'pattern', name: 'Pattern Spotter', icon: '🔍', prompt_modifier: 'Analyze text for recurring themes or systemic issues. Append a "Patterns Detected" section.' },
  { id: 'narrative', name: 'Narrative Weaver', icon: '🧶', prompt_modifier: 'Take these disjointed facts and write a cohesive Executive Summary story.' },
  { id: 'trend', name: 'Trend Forecaster', icon: '📈', prompt_modifier: 'Provide predictive analysis based on the text. Include a disclaimer that this is AI prediction, not legal advice.' },
  { id: 'socratic', name: 'Socratic Mirror', icon: '🪞', prompt_modifier: 'Act as a Senior Reviewer. Identify 3 gaps in logic. Output a list of "Questions to Consider".' },
  { id: 'mood', name: 'Mood Scape', icon: '🌡️', prompt_modifier: 'Analyze the sentiment regarding regulatory confidence. Rate confidence from 1-10 and explain why (Red=Critical, Green=Clear Path).' },
];

export const UI_TEXT = {
  en: {
    title: "FDA 510(k) Agentic AI",
    upload: "Upload PDF/Text",
    generating: "Agent working...",
    tabs: {
      summary: "510(k) Summary",
      guidance: "Guidance Synthesis",
      notes: "Note Keeper",
      config: "Agent Config"
    },
    jackpot: "Spin Style",
    buttons: {
      generate: "Generate Report",
      synthesize: "Synthesize Guidance",
      magic: "Apply Magic"
    }
  },
  tc: {
    title: "FDA 510(k) 智能審查系統",
    upload: "上傳 PDF/文本",
    generating: "代理正在運行...",
    tabs: {
      summary: "510(k) 摘要",
      guidance: "指南綜合",
      notes: "筆記助手",
      config: "代理配置"
    },
    jackpot: "旋轉風格",
    buttons: {
      generate: "生成報告",
      synthesize: "綜合指南",
      magic: "施展魔法"
    }
  }
};
