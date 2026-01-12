import React, { useState } from 'react';
import { AgentConfig, ArtStyle, MagicType } from '../types';
import { MAGICS, UI_TEXT, AVAILABLE_MODELS } from '../constants';
import { generateContent } from '../services/geminiService';
import { Button, Card } from './UI';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ModuleProps {
  config: AgentConfig;
  lang: 'en' | 'tc';
  style: ArtStyle;
}

// --- Helper Component for Advanced Input & Config ---
interface AdvancedInputProps {
  style: ArtStyle;
  onGenerate: (data: { file: File | null, text: string, model: string, prompt: string }) => void;
  loading: boolean;
  defaultModel: string;
  defaultPrompt: string;
  buttonLabel: string;
}

const AdvancedInput: React.FC<AdvancedInputProps> = ({ 
  style, onGenerate, loading, defaultModel, defaultPrompt, buttonLabel 
}) => {
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [systemPrompt, setSystemPrompt] = useState(defaultPrompt);
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = () => {
    onGenerate({
      file: mode === 'upload' ? file : null,
      text: mode === 'paste' ? textInput : '',
      model: selectedModel,
      prompt: systemPrompt
    });
  };

  const isReady = (mode === 'upload' && file) || (mode === 'paste' && textInput.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
         <div className="flex gap-2 bg-black/10 p-1 rounded-lg">
           <button 
             onClick={() => setMode('upload')}
             className={`px-3 py-1 text-sm rounded transition-all ${mode === 'upload' ? 'bg-white shadow text-black' : 'opacity-60'}`}
           >
             📁 Upload
           </button>
           <button 
             onClick={() => setMode('paste')}
             className={`px-3 py-1 text-sm rounded transition-all ${mode === 'paste' ? 'bg-white shadow text-black' : 'opacity-60'}`}
           >
             📝 Paste
           </button>
         </div>
         <button 
           onClick={() => setShowSettings(!showSettings)} 
           className="text-xs opacity-60 hover:opacity-100 underline"
         >
           {showSettings ? 'Hide Settings' : 'Advanced Settings'}
         </button>
      </div>

      <div className={`transition-all duration-300 overflow-hidden ${showSettings ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
        <div className="p-3 bg-black/5 rounded border border-black/10 space-y-3 text-sm">
          <div>
            <label className="block opacity-70 mb-1 font-bold">Model</label>
            <select 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2 rounded bg-white/50 border border-gray-300"
            >
              {AVAILABLE_MODELS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block opacity-70 mb-1 font-bold">System Prompt</label>
            <textarea 
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full p-2 rounded bg-white/50 border border-gray-300 h-32 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      <Card title={mode === 'upload' ? "File Upload" : "Paste Content"} style={style}>
        {mode === 'upload' ? (
          <input 
            type="file" 
            accept=".pdf,.txt,.md"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
        ) : (
          <textarea 
            placeholder="Paste text or markdown content here..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full h-48 p-2 rounded bg-white/50 border border-gray-300 focus:outline-none focus:ring-1"
          />
        )}
        <div className="mt-4">
          <Button accentColor={style.palette.accent} onClick={handleSubmit} disabled={loading || !isReady} className="text-white w-full">
            {loading ? "Agent Working..." : buttonLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
};


// --- Module 1: 510(k) Summary ---
export const SummaryGenerator: React.FC<ModuleProps> = ({ config, lang, style }) => {
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const t = UI_TEXT[lang];

  const handleGenerate = async ({ file, text, model, prompt }: { file: File | null, text: string, model: string, prompt: string }) => {
    setLoading(true);
    // Create a temporary agent config based on user selection
    const tempAgent = {
      ...config.fda_summarizer,
      model_name: model,
      system_prompt: prompt
    };

    let userRequest = "Generate the 510(k) summary tables and narrative.";
    if (text) {
      userRequest += `\n\n[DATA START]\n${text}\n[DATA END]`;
    }

    const result = await generateContent(tempAgent, userRequest, file);
    setOutput(result);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <AdvancedInput 
        style={style}
        onGenerate={handleGenerate}
        loading={loading}
        defaultModel={config.fda_summarizer.model_name}
        defaultPrompt={config.fda_summarizer.system_prompt}
        buttonLabel={t.buttons.generate}
      />
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
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const t = UI_TEXT[lang];

  const handleGenerate = async ({ file, text, model, prompt }: { file: File | null, text: string, model: string, prompt: string }) => {
    setLoading(true);
    const tempAgent = {
      ...config.fda_guidance_expert,
      model_name: model,
      system_prompt: prompt
    };

    let userRequest = "Analyze guidance and create checklists.";
    if (text) {
      userRequest += `\n\n[GUIDANCE TEXT START]\n${text}\n[GUIDANCE TEXT END]`;
    }

    const result = await generateContent(tempAgent, userRequest, file);
    setOutput(result);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <AdvancedInput 
        style={style}
        onGenerate={handleGenerate}
        loading={loading}
        defaultModel={config.fda_guidance_expert.model_name}
        defaultPrompt={config.fda_guidance_expert.system_prompt}
        buttonLabel={t.buttons.synthesize}
      />
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
