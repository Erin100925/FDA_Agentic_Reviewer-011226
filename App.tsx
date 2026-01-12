import React, { useState, useEffect } from 'react';
import { ArtStyle, Language, AgentConfig } from './types';
import { ART_STYLES, DEFAULT_AGENTS_CONFIG, UI_TEXT } from './constants';
import { JackpotSelector } from './components/UI';
import { SummaryGenerator, GuidanceSynthesizer, NoteKeeper, AgentConfigEditor } from './components/Modules';

type Tab = 'summary' | 'guidance' | 'notes' | 'config';

const App: React.FC = () => {
  // State
  const [currentStyle, setCurrentStyle] = useState<ArtStyle>(ART_STYLES[0]);
  const [lang, setLang] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<Tab>('summary');
  const [agentConfig, setAgentConfig] = useState<AgentConfig>(DEFAULT_AGENTS_CONFIG);
  
  const t = UI_TEXT[lang];

  // Dynamic style injection for body background
  useEffect(() => {
    document.body.style.backgroundColor = currentStyle.palette.background;
    document.body.style.color = currentStyle.palette.text;
    document.body.style.fontFamily = currentStyle.palette.fontFamily;
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
  }, [currentStyle]);

  const renderTab = () => {
    const props = { config: agentConfig, lang, style: currentStyle };
    switch (currentTab) {
      case 'summary': return <SummaryGenerator {...props} />;
      case 'guidance': return <GuidanceSynthesizer {...props} />;
      case 'notes': return <NoteKeeper {...props} />;
      case 'config': return <AgentConfigEditor {...props} onUpdate={setAgentConfig} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row transition-colors duration-500">
      
      {/* Sidebar */}
      <aside 
        className="w-full md:w-64 p-4 flex flex-col gap-6 shadow-2xl z-10"
        style={{ 
          backgroundColor: currentStyle.palette.primary, 
          color: currentStyle.palette.background 
        }}
      >
        <div className="text-2xl font-bold tracking-tighter text-center py-2 border-b border-white/20">
          FDA<span style={{ color: currentStyle.palette.accent }}>Agentic</span>AI
        </div>

        {/* Jackpot */}
        <JackpotSelector 
          currentStyle={currentStyle} 
          onStyleSelect={setCurrentStyle} 
          label={t.jackpot}
        />

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mt-4 flex-grow">
          {(Object.keys(t.tabs) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium flex items-center gap-3
                ${currentTab === tab 
                  ? 'shadow-lg translate-x-2' 
                  : 'hover:bg-white/10'
                }
              `}
              style={{
                backgroundColor: currentTab === tab ? currentStyle.palette.accent : 'transparent',
                color: currentTab === tab ? currentStyle.palette.primary : 'inherit' // High contrast for active
              }}
            >
               <span>{tab === 'summary' ? '📄' : tab === 'guidance' ? '⚖️' : tab === 'notes' ? '📝' : '⚙️'}</span>
               {t.tabs[tab]}
            </button>
          ))}
        </nav>

        {/* Language Toggle */}
        <div className="flex justify-center gap-2 mt-auto p-4 bg-black/20 rounded-lg">
          <button onClick={() => setLang('en')} className={`px-2 ${lang === 'en' ? 'font-bold underline' : 'opacity-50'}`}>EN</button>
          <span className="opacity-30">|</span>
          <button onClick={() => setLang('tc')} className={`px-2 ${lang === 'tc' ? 'font-bold underline' : 'opacity-50'}`}>繁中</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-hidden flex flex-col h-screen">
        <header className="mb-6 flex justify-between items-end pb-4 border-b border-opacity-20" style={{ borderColor: currentStyle.palette.text }}>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: currentStyle.palette.primary }}>
              {t.tabs[currentTab]}
            </h1>
            <p className="text-sm opacity-60 italic mt-1">
              Powered by {agentConfig.fda_summarizer.model_name}
            </p>
          </div>
          <div className="text-xs font-mono opacity-50">
            v1.0.0
          </div>
        </header>

        <div className="flex-grow overflow-auto pb-20 md:pb-0">
          {renderTab()}
        </div>
      </main>
    </div>
  );
};

export default App;
