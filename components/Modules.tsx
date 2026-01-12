import React, { useState } from 'react';
import { AgentConfig, ArtStyle, MagicType } from '../types';
import { MAGICS, UI_TEXT } from '../constants';
import { generateContent } from '../services/geminiService';
import { Button, Card } from './UI';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ModuleProps {
  config: AgentConfig;
  lang: 'en' | 'tc';
  style: ArtStyle;
}

// --- Module 1: 510(k) Summary ---
export const SummaryGenerator: React.FC<ModuleProps> = ({ config, lang, style }) => {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const t = UI_TEXT[lang];

  const handleGenerate = async () => {
    if (!file) return;
    setLoading(true);
    const result = await generateContent(config.fda_summarizer, "Generate the 510(k) summary tables and narrative.", file);
    setOutput(result);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="space-y-4">
        <Card title={t.upload} style={style}>
          <input 
            type="file" 
            accept=".pdf,.txt,.md"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
          <div className="mt-4">
            <Button accentColor={style.palette.accent} onClick={handleGenerate} disabled={loading || !file} className="text-white w-full">
              {loading ? t.generating : t.buttons.generate}
            </Button>
          </div>
        </Card>
      </div>
      <Card title="Output" style={style}>
        <div className="overflow-y-auto h-[600px] markdown-body text-sm">
          {output ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown> : <span className="opacity-50">Result will appear here...</span>}
        </div>
      </Card>
    </div>
  );
};

// --- Module 2: Guidance Synthesizer ---
export const GuidanceSynthesizer: React.FC<ModuleProps> = ({ config, lang, style }) => {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const t = UI_TEXT[lang];

  const handleGenerate = async () => {
    if (!file) return;
    setLoading(true);
    const result = await generateContent(config.fda_guidance_expert, "Analyze guidance and create checklists.", file);
    setOutput(result);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="space-y-4">
        <Card title={t.upload} style={style}>
          <input 
            type="file" 
            accept=".pdf,.txt"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
          <div className="mt-4">
            <Button accentColor={style.palette.accent} onClick={handleGenerate} disabled={loading || !file} className="text-white w-full">
              {loading ? t.generating : t.buttons.synthesize}
            </Button>
          </div>
        </Card>
      </div>
      <Card title="Checklists" style={style}>
        <div className="overflow-y-auto h-[600px] markdown-body text-sm">
           {output ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown> : <span className="opacity-50">Checklists will appear here...</span>}
        </div>
      </Card>
    </div>
  );
};

// --- Module 3: Note Keeper (AI Magics) ---
export const NoteKeeper: React.FC<ModuleProps> = ({ config, lang, style }) => {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const t = UI_TEXT[lang];

  const handleMagic = async (magicType: MagicType) => {
    if (!notes) return;
    setLoading(true);
    const magicDef = MAGICS.find(m => m.id === magicType);
    const prompt = `${magicDef?.prompt_modifier || "Organize notes."}\n\nNotes:\n${notes}`;
    
    // We modify the agent temporarily or just pass the prompt. 
    // The Note Keeper agent is generic, the magic prompt does the heavy lifting.
    const result = await generateContent(config.note_keeper, prompt, null);
    setOutput(result);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
        <Card title="Raw Notes" style={style}>
          <textarea 
            className="w-full h-[400px] p-4 rounded bg-white/50 border border-gray-300 focus:ring-2 focus:outline-none resize-none"
            placeholder="Paste meeting notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Card>
        <Card title="Transformation" style={style}>
          <div className="overflow-y-auto h-[400px] markdown-body text-sm bg-white/50 p-4 rounded border border-gray-300">
             {output ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown> : <span className="opacity-50">Magic output...</span>}
          </div>
        </Card>
      </div>
      
      {/* Magic Toolbar */}
      <div className="p-4 rounded-xl flex flex-wrap gap-2 justify-center items-center backdrop-blur-md bg-white/10 border border-white/20">
        {MAGICS.map((magic) => (
          <button
            key={magic.id}
            onClick={() => handleMagic(magic.id)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 bg-white text-black shadow-lg border-2"
            style={{ borderColor: style.palette.accent }}
            title={magic.name}
          >
            <span className="text-xl">{magic.icon}</span>
            <span className="hidden sm:inline">{magic.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Module 4: Agent Config ---
export const AgentConfigEditor: React.FC<ModuleProps & { onUpdate: (c: AgentConfig) => void }> = ({ config, onUpdate, style }) => {
  const [yamlString, setYamlString] = useState(JSON.stringify(config, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(yamlString);
      onUpdate(parsed);
      setError(null);
      alert("Configuration Saved!");
    } catch (e) {
      setError("Invalid JSON format.");
    }
  };

  return (
    <div className="h-full">
      <Card title="Agent Configuration (JSON Mode)" style={style}>
        <div className="flex flex-col gap-4 h-full">
          <textarea 
            className="w-full h-[500px] font-mono text-sm p-4 rounded bg-gray-900 text-green-400 border border-gray-700"
            value={yamlString}
            onChange={(e) => setYamlString(e.target.value)}
          />
          {error && <div className="text-red-500 font-bold">{error}</div>}
          <div className="flex justify-end">
            <Button accentColor={style.palette.accent} onClick={handleSave} className="text-white">
              Save Config
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
