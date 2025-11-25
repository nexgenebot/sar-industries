
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useData } from '../context/DataContext';
import { Users, Filter, Download, Plus, Search, MoreHorizontal, Sparkles, BrainCircuit, PieChart, Layers } from 'lucide-react';
import { generateAudienceSegments, analyzeAudienceOverlap } from '../services/geminiService';
import { Platform } from '../types';

export const Audiences: React.FC = () => {
  const { audiences, addAudience } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'List' | 'Analysis'>('List');
  
  // AI Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudience, setGeneratedAudience] = useState<{name: string, interests: string[]} | null>(null);

  // Overlap Analysis State
  const [overlapSelection, setOverlapSelection] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overlapResult, setOverlapResult] = useState<{percentage: number, insight: string} | null>(null);

  const filteredAudiences = audiences.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateAudience = async () => {
    if (!description) return;
    setIsGenerating(true);
    const result = await generateAudienceSegments(description);
    if (result) {
        setGeneratedAudience(result);
        setWizardStep(2);
    }
    setIsGenerating(false);
  };

  const handleSaveAudience = () => {
    if (!generatedAudience) return;
    addAudience({
        id: 'a_' + Date.now(),
        name: generatedAudience.name,
        size: Math.floor(Math.random() * 500000) + 10000,
        type: 'Saved',
        platform: [Platform.FACEBOOK, Platform.INSTAGRAM],
        lastUpdated: 'Just now',
        interests: generatedAudience.interests
    });
    setIsWizardOpen(false);
    setWizardStep(1);
    setDescription('');
    setGeneratedAudience(null);
  };

  const toggleOverlapSelection = (id: string) => {
      if (overlapSelection.includes(id)) {
          setOverlapSelection(prev => prev.filter(i => i !== id));
      } else {
          if (overlapSelection.length < 2) {
              setOverlapSelection(prev => [...prev, id]);
          }
      }
  };

  const handleAnalyzeOverlap = async () => {
      if (overlapSelection.length !== 2) return;
      setIsAnalyzing(true);
      const audA = audiences.find(a => a.id === overlapSelection[0])?.name || '';
      const audB = audiences.find(a => a.id === overlapSelection[1])?.name || '';
      
      const result = await analyzeAudienceOverlap(audA, audB);
      setOverlapResult(result);
      setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* AI Wizard Modal */}
      {isWizardOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-surface border border-border rounded-xl w-full max-w-lg shadow-2xl">
                  <div className="p-6 border-b border-border">
                      <h3 className="text-xl font-bold text-textMain flex items-center gap-2">
                          <BrainCircuit size={24} className="text-accent" /> AI Audience Builder
                      </h3>
                  </div>
                  <div className="p-6">
                      {wizardStep === 1 && (
                          <div className="space-y-4">
                              <label className="block text-sm text-textMuted">Describe your ideal customer persona in plain English.</label>
                              <textarea 
                                  className="w-full bg-background border border-border rounded-lg p-3 h-32 text-textMain focus:ring-1 focus:ring-accent outline-none resize-none"
                                  placeholder="e.g. Yoga instructors living in California who are interested in organic food and sustainable clothing."
                                  value={description}
                                  onChange={(e) => setDescription(e.target.value)}
                              />
                          </div>
                      )}

                      {wizardStep === 2 && generatedAudience && (
                          <div className="space-y-4">
                              <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
                                  <label className="text-xs font-bold text-accent uppercase">Suggested Name</label>
                                  <p className="text-lg font-bold text-textMain">{generatedAudience.name}</p>
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-textMuted uppercase mb-2 block">Targeting Interests</label>
                                  <div className="flex flex-wrap gap-2">
                                      {generatedAudience.interests.map((int, i) => (
                                          <Badge key={i} variant="info">{int}</Badge>
                                      ))}
                                  </div>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-textMuted bg-surface p-2 rounded">
                                  <Sparkles size={12} />
                                  AI Estimated Size: {(Math.floor(Math.random() * 500) + 100)}k - {(Math.floor(Math.random() * 500) + 600)}k
                              </div>
                          </div>
                      )}
                  </div>
                  <div className="p-6 border-t border-border flex justify-end gap-3">
                      <Button variant="ghost" onClick={() => setIsWizardOpen(false)}>Cancel</Button>
                      {wizardStep === 1 ? (
                          <Button onClick={handleGenerateAudience} isLoading={isGenerating} disabled={!description}>
                              <Sparkles size={16} className="mr-2" /> Generate
                          </Button>
                      ) : (
                          <Button onClick={handleSaveAudience}>Save Audience</Button>
                      )}
                  </div>
              </div>
          </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-textMain tracking-tight">Audience Network</h1>
          <p className="text-textMuted mt-1">Segment and target your ideal customer profiles.</p>
        </div>
        <div className="flex gap-2">
             <div className="bg-surface border border-border rounded-lg flex p-1">
                <button 
                    onClick={() => setActiveTab('List')}
                    className={`px-4 py-1.5 rounded text-sm font-medium ${activeTab === 'List' ? 'bg-zinc-700 text-white' : 'text-textMuted hover:text-textMain'}`}
                >
                    All Audiences
                </button>
                <button 
                    onClick={() => setActiveTab('Analysis')}
                    className={`px-4 py-1.5 rounded text-sm font-medium ${activeTab === 'Analysis' ? 'bg-zinc-700 text-white' : 'text-textMuted hover:text-textMain'}`}
                >
                    Overlap Analysis
                </button>
            </div>
            <Button onClick={() => setIsWizardOpen(true)} className="bg-gradient-to-r from-primary to-accent border-0">
                <Sparkles size={16} className="mr-2" /> AI Create
            </Button>
        </div>
      </div>

      {activeTab === 'List' ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 text-textMuted" />
                    <input 
                        type="text" 
                        placeholder="Search audiences..." 
                        className="bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm w-full focus:ring-1 focus:ring-primary outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button className="p-2 border border-border rounded-lg text-textMuted hover:bg-zinc-800"><Filter size={18} /></button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-textMuted uppercase bg-background/50 border-b border-border">
                        <tr>
                            <th className="px-6 py-3 font-medium">Audience Name</th>
                            <th className="px-6 py-3 font-medium">Type</th>
                            <th className="px-6 py-3 font-medium">Est. Size</th>
                            <th className="px-6 py-3 font-medium">Match Rate</th>
                            <th className="px-6 py-3 font-medium">Last Updated</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredAudiences.map((audience) => (
                            <tr key={audience.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 font-medium text-textMain">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-zinc-800 rounded text-primary">
                                            <Users size={16} />
                                        </div>
                                        <div>
                                            {audience.name}
                                            <div className="flex gap-1 mt-1">
                                                {audience.platform.map(p => (
                                                    <span key={p} className="text-[10px] bg-zinc-800 text-textMuted px-1 rounded">{p}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="neutral">{audience.type}</Badge>
                                </td>
                                <td className="px-6 py-4 text-textMain">{audience.size.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    {audience.matchRate ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500" style={{width: `${audience.matchRate}%`}}></div>
                                            </div>
                                            <span className="text-xs">{audience.matchRate}%</span>
                                        </div>
                                    ) : (
                                        <span className="text-textMuted">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-textMuted">{audience.lastUpdated}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-textMuted hover:text-white"><MoreHorizontal size={18} /></button>
                                </td>
                            </tr>
                        ))}
                        {filteredAudiences.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-textMuted">No audiences found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
      </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                <h3 className="font-bold mb-4">Select 2 Audiences</h3>
                <div className="space-y-2">
                    {audiences.map(aud => (
                        <div 
                            key={aud.id} 
                            onClick={() => toggleOverlapSelection(aud.id)}
                            className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center transition-all ${
                                overlapSelection.includes(aud.id) 
                                ? 'bg-primary/10 border-primary text-primary' 
                                : 'bg-background border-border text-textMain hover:bg-zinc-800'
                            }`}
                        >
                            <span className="text-sm font-medium">{aud.name}</span>
                            {overlapSelection.includes(aud.id) && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                    <Button 
                        onClick={handleAnalyzeOverlap} 
                        disabled={overlapSelection.length !== 2} 
                        className="w-full"
                        isLoading={isAnalyzing}
                    >
                        Analyze Overlap
                    </Button>
                </div>
            </Card>

            <Card className="lg:col-span-2 flex flex-col justify-center items-center min-h-[400px]">
                {overlapResult ? (
                    <div className="text-center w-full max-w-lg animate-in zoom-in duration-500">
                        <div className="relative h-64 w-full flex justify-center items-center mb-6">
                             {/* Venn Diagram Visual */}
                             <div className="absolute w-48 h-48 rounded-full bg-blue-500/30 border-2 border-blue-500 left-1/2 -translate-x-32 mix-blend-screen flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-200 -translate-x-4 -translate-y-8 absolute">{audiences.find(a=>a.id === overlapSelection[0])?.name.split(' ')[0]}</span>
                             </div>
                             <div className="absolute w-48 h-48 rounded-full bg-pink-500/30 border-2 border-pink-500 left-1/2 translate-x-[-4rem] mix-blend-screen flex items-center justify-center">
                                <span className="text-xs font-bold text-pink-200 translate-x-4 -translate-y-8 absolute">{audiences.find(a=>a.id === overlapSelection[1])?.name.split(' ')[0]}</span>
                             </div>
                             
                             {/* Intersection Label */}
                             <div className="relative z-10 bg-white text-black font-bold rounded-full px-3 py-1 shadow-lg">
                                 {overlapResult.percentage}% Overlap
                             </div>
                        </div>

                        <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Layers size={80} />
                            </div>
                            <h4 className="font-bold text-lg mb-2">AI Insight</h4>
                            <p className="text-textMuted text-sm leading-relaxed">{overlapResult.insight}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-textMuted">
                        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <PieChart size={32} opacity={0.5} />
                        </div>
                        <h3 className="text-lg font-medium text-textMain">Audience Overlap Tool</h3>
                        <p className="max-w-xs mx-auto mt-2 text-sm">Select two segments on the left to visualize demographic intersection and prevent ad fatigue.</p>
                    </div>
                )}
            </Card>
        </div>
      )}
    </div>
  );
};
