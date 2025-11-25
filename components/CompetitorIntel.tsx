
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Swords, Search, Crosshair, BarChart2, TrendingUp, AlertTriangle, Shield, Eye } from 'lucide-react';
import { analyzeCompetitors } from '../services/geminiService';
import { CompetitorInsight } from '../types';

export const CompetitorIntel: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [competitors, setCompetitors] = useState<CompetitorInsight[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleAnalyze = async () => {
        if (!searchTerm) return;
        setIsAnalyzing(true);
        setHasSearched(true);
        const results = await analyzeCompetitors(searchTerm);
        if (results) {
            setCompetitors(results);
        }
        setIsAnalyzing(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-textMain tracking-tight">Competitor Intelligence</h1>
                    <p className="text-textMuted mt-1">AI-powered espionage to uncover market gaps and strategies.</p>
                </div>
            </div>

            <Card className="bg-gradient-to-r from-surface to-zinc-900 border-primary/20">
                <div className="max-w-2xl mx-auto py-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary mb-4 animate-pulse">
                        <Swords size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Who are you up against?</h2>
                    <p className="text-textMuted">Enter your industry, niche, or a specific product category. Nexus AI will scan the theoretical landscape to provide SWOT analysis and estimated market share.</p>
                    
                    <div className="flex gap-2 max-w-lg mx-auto relative">
                        <div className="relative flex-1">
                            <Search size={20} className="absolute left-4 top-3.5 text-textMuted" />
                            <input 
                                type="text" 
                                placeholder="e.g. Sustainable Coffee Subscription, CRM Software, Yoga Mats"
                                className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3.5 text-textMain focus:ring-2 focus:ring-primary outline-none shadow-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                            />
                        </div>
                        <Button size="lg" onClick={handleAnalyze} isLoading={isAnalyzing} disabled={!searchTerm} className="rounded-xl px-8 shadow-lg shadow-primary/25">
                            Analyze
                        </Button>
                    </div>
                </div>
            </Card>

            {hasSearched && !isAnalyzing && competitors.length > 0 && (
                <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {competitors.map((comp, idx) => (
                            <Card key={idx} className="relative overflow-hidden group hover:border-primary/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-textMuted select-none">
                                    {idx + 1}
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-xl border border-border">
                                            {comp.name.charAt(0)}
                                        </div>
                                        <Badge variant={idx === 0 ? 'danger' : 'warning'}>
                                            {comp.marketShare}% Share
                                        </Badge>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-textMain mb-4">{comp.name}</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                                            <p className="text-xs font-bold text-emerald-400 uppercase mb-1 flex items-center gap-1"><Shield size={12} /> Strength</p>
                                            <p className="text-sm text-textMain">{comp.strength}</p>
                                        </div>
                                        <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg">
                                            <p className="text-xs font-bold text-rose-400 uppercase mb-1 flex items-center gap-1"><AlertTriangle size={12} /> Weakness</p>
                                            <p className="text-sm text-textMain">{comp.weakness}</p>
                                        </div>
                                        <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                                            <p className="text-xs font-bold text-blue-400 uppercase mb-1 flex items-center gap-1"><Eye size={12} /> Ad Strategy</p>
                                            <p className="text-sm text-textMain italic">"{comp.adStrategy}"</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                                        <span className="text-xs text-textMuted">Threat Level</span>
                                        <div className="flex gap-1">
                                            {[1,2,3,4,5].map(i => (
                                                <div key={i} className={`w-2 h-4 rounded-sm ${i <= (comp.marketShare / 20) + 1 ? 'bg-red-500' : 'bg-zinc-800'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card title="Market Landscape Visualization">
                         <div className="h-64 flex items-end justify-around p-4 gap-4 bg-background/50 rounded-lg border border-border border-dashed">
                             {competitors.map((comp, idx) => (
                                 <div key={idx} className="flex flex-col items-center flex-1 group">
                                     <div 
                                        className="w-full max-w-[120px] bg-gradient-to-t from-primary/20 to-primary/60 rounded-t-lg relative transition-all duration-500 group-hover:from-primary/40 group-hover:to-primary/80" 
                                        style={{height: `${comp.marketShare * 3}px`}}
                                     >
                                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                             {comp.marketShare}%
                                         </div>
                                     </div>
                                     <p className="mt-3 font-semibold text-sm text-center">{comp.name}</p>
                                     <p className="text-xs text-textMuted text-center">Competitor {idx + 1}</p>
                                 </div>
                             ))}
                             {/* Your Brand Placeholder */}
                             <div className="flex flex-col items-center flex-1">
                                 <div className="w-full max-w-[120px] bg-zinc-800 rounded-t-lg h-24 border-2 border-dashed border-textMuted relative flex items-center justify-center">
                                     <span className="text-xs text-textMuted">You</span>
                                 </div>
                                 <p className="mt-3 font-semibold text-sm text-center text-textMuted">Your Brand</p>
                             </div>
                         </div>
                    </Card>
                </div>
            )}
        </div>
    );
};
