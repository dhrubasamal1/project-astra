import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  X,
  Satellite,
  Database,
  ArrowRight,
  ShieldCheck,
  Compass,
  Building2,
  Droplets,
  AlertTriangle,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { Region } from '../../types';
import { NavPageId } from '../layout/AppSidebar';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  type?: 'retrieved' | 'calculated' | 'modeled';
  citations?: string[];
  actionLink?: { label: string; page: NavPageId };
}

interface TerraAdvisorChatProps {
  currentRegion: Region;
  isFloating?: boolean;
  onClose?: () => void;
  onNavigate?: (page: NavPageId) => void;
}

export const TerraAdvisorChat: React.FC<TerraAdvisorChatProps> = ({
  currentRegion,
  isFloating = false,
  onClose,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      text: `Hello! I am TerraAdvisor, your geospatial AI copilot for sustainable smart city planning. I am synchronized with ISRO's Bhoonidhi, Bhuvan, MOSDAC, and VEDAS data feeds for ${currentRegion.name}. How can I assist with your site screening or master-plan design today?`,
      timestamp: 'Just now',
      type: 'retrieved',
      citations: ['Bhoonidhi CartoDEM 30m', 'Bhuvan LULC 1:50k', 'MOSDAC INSAT-3D', 'VEDAS NDVI'],
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedPrompts = [
    'Find the best location for a new city.',
    'Analyse groundwater availability.',
    'Design a settlement for 20,000 people.',
    'Compare two proposed city layouts.',
    'How sustainable will this city be after 50 years?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      let reply: ChatMessage;
      const lower = query.toLowerCase();

      if (lower.includes('best location') || lower.includes('site')) {
        reply = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: `Based on ISRO 4-portal screening across ${currentRegion.name}, **Site A (Jewar North)** ranks #1 with a suitability score of **84.2/100**. It features optimal buildable terrain (<2% slope), zero overlap with the 25-year flood inundation mask, and direct arterial expressway proximity. Conversely, Site B is disqualified due to severe 53.4% flood zone intersection.`,
          timestamp: 'Just now',
          type: 'calculated',
          citations: ['Bhuvan Flood Inundation 25-Yr', 'CartoDEM 30m Slope', 'OSM Expressway Buffer'],
          actionLink: { label: 'Inspect Site A on GIS Map', page: 'site_selection' },
        };
      } else if (lower.includes('groundwater') || lower.includes('water')) {
        reply = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: `In the Greater Jewar region, pre-monsoon water table depth averages **14.2m below ground level**, with a 10-year depletion rate of -0.38 m/yr. Under the statutory 135 lpcd standard, a 25,000-population phase requires **3.38 MLD**. Integrating rooftop rainwater harvesting and the 45-acre central retention basin will satisfy 88% of municipal demand without causing aquifer drawdown.`,
          timestamp: 'Just now',
          type: 'calculated',
          citations: ['CGWB Aquifer Prospect Layer', 'MOSDAC Hydro-Estimator Rainfall'],
          actionLink: { label: 'Explore Water Balance Module', page: 'water' },
        };
      } else if (lower.includes('settlement') || lower.includes('20,000') || lower.includes('design')) {
        reply = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: `For a 20,000 to 25,000 resident sustainable community on a 500-acre parcel, I recommend **Layout Alpha**: dedicating 165 acres to biophilic medium-density residential housing (passive solar courtyards), 85 acres to commercial/innovation transit hub, 120 acres to central urban forest & green belt (34.5% green cover), and a 45MW agrivoltaic microgrid with 120MWh BESS storage.`,
          timestamp: 'Just now',
          type: 'modeled',
          citations: ['AMRUT 2.0 Spatial Standards', 'VEDAS Solar Insolation GHI'],
          actionLink: { label: 'Open AI City Designer', page: 'city_designer' },
        };
      } else if (lower.includes('compare') || lower.includes('layout')) {
        reply = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: `Comparing **Layout Alpha** vs **Layout Beta**: Layout Alpha maximizes transit orientation and commercial agglomeration (14,000 jobs, 92% net-zero), whereas Layout Beta prioritizes agricultural sovereignty with 42% green cover and 94% water self-sufficiency. Both completely avoid the southern drainage depression.`,
          timestamp: 'Just now',
          type: 'modeled',
          citations: ['Layout Alpha vs Beta Optimization Matrix'],
          actionLink: { label: 'Compare Layouts Side-by-Side', page: 'city_designer' },
        };
      } else if (lower.includes('50') || lower.includes('future') || lower.includes('sustainable')) {
        reply = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: `Under the CMIP6 SSP2-4.5 trajectory at the 50-year mark (2075), population scales to **450,000**. Municipal demand peaks at 60.75 MLD. With mature urban canopy networks attenuating local microclimate heat by 3.1°C, and 95% circular resource recovery active, the city achieves long-term climate resilience.`,
          timestamp: 'Just now',
          type: 'modeled',
          citations: ['CMIP6 Downscaled Climate Model', 'Decadal Stress Matrix'],
          actionLink: { label: 'View 2075 Decadal Simulation', page: 'simulation' },
        };
      } else {
        reply = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: `I've analyzed your query against our spatial indices: "${query}". I can generate master plans, compute multi-criteria suitability, evaluate 135 lpcd water balances, or check ISRO 4-portal satellite records. What specific analysis should we run next?`,
          timestamp: 'Just now',
          type: 'retrieved',
          citations: ['ISRO Regional Feature Collection'],
        };
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, reply]);
    }, 800);
  };

  return (
    <div
      className={`flex flex-col bg-[#07111F] text-[#F1F5F9] font-sans ${
        isFloating
          ? 'fixed bottom-6 right-6 z-50 w-96 sm:w-[440px] h-[580px] rounded-3xl border border-[#22D3EE]/40 shadow-2xl overflow-hidden'
          : 'flex-1 h-full p-6'
      }`}
    >
      {/* Chat Header */}
      <div className="p-4 bg-[#0D1928] border-b border-white/[0.08] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#111F30] border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE]">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading font-bold text-sm text-[#F1F5F9]">TerraAdvisor</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#22D3EE]/20 text-[#22D3EE] font-bold">
                ISRO Space AI
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8]">Explainable Urban Planning Copilot</p>
          </div>
        </div>

        {isFloating && onClose && (
          <button onClick={onClose} className="p-1 rounded-lg text-[#94A3B8] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3.5 rounded-2xl space-y-2 leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#17283A] text-[#F1F5F9] ml-8 border border-white/[0.08]'
                : 'bg-[#0D1928] text-[#94A3B8] mr-4 border border-[#22D3EE]/20 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] text-[#94A3B8] font-mono">
              <span className="font-bold text-[#F1F5F9]">{msg.role === 'user' ? 'You' : 'TerraAdvisor'}</span>
              <span>{msg.timestamp}</span>
            </div>

            <div className="text-[#F1F5F9]">{msg.text}</div>

            {/* Citations & Source Pills */}
            {msg.citations && msg.citations.length > 0 && (
              <div className="pt-2 border-t border-white/[0.06] space-y-1">
                <div className="text-[9px] font-mono uppercase text-[#94A3B8]/70">Verified Space Citations:</div>
                <div className="flex flex-wrap gap-1">
                  {msg.citations.map((c, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#111F30] border border-white/[0.08] text-[#34D399]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Link button */}
            {msg.actionLink && onNavigate && (
              <button
                onClick={() => onNavigate(msg.actionLink!.page)}
                className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#22D3EE]/20 hover:bg-[#22D3EE]/30 border border-[#22D3EE]/40 text-[#22D3EE] font-bold text-[11px] transition-all"
              >
                <span>{msg.actionLink.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="p-3 rounded-2xl bg-[#0D1928] text-[#22D3EE] text-xs flex items-center space-x-2 border border-[#22D3EE]/20">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing ISRO zonal rasters and computing synthesis...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="p-2 border-t border-white/[0.06] bg-[#07111F] flex items-center space-x-1.5 overflow-x-auto shrink-0">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-[#111F30] hover:bg-[#17283A] text-[#94A3B8] hover:text-[#F1F5F9] border border-white/[0.08] whitespace-nowrap transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-[#0D1928] border-t border-white/[0.08] flex items-center space-x-2 shrink-0"
      >
        <input
          type="text"
          placeholder="Ask TerraAdvisor (e.g. 'Compare two city layouts')..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          className="flex-1 bg-[#111F30] border border-white/[0.08] hover:border-white/[0.15] focus:border-[#22D3EE]/60 rounded-xl px-3 py-2 text-xs text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isTyping}
          className="p-2 rounded-xl bg-[#22D3EE] text-[#07111F] font-bold disabled:opacity-40 hover:bg-[#38BDF8] transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
