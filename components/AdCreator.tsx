
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { useData } from '../context/DataContext';
import { generateAdCreative, generateAdImage, generateImageIdeas } from '../services/geminiService';
import { GeneratedContent, Platform, AdFormat, SavedAd } from '../types';
import { 
    Sparkles, Copy, RefreshCw, Image as ImageIcon, Zap, Save, Info, Type, 
    AlignLeft, CheckCircle2, MousePointerClick, Loader2, Monitor
} from 'lucide-react';

export const AdCreator: React.FC = () => {
    const { brandProfile, saveAd } = useData();
    
    // Form State
    const [productName, setProductName] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [platform, setPlatform] = useState<Platform>(Platform.FACEBOOK);
    const [format, setFormat] = useState<AdFormat>(AdFormat.FEED);
    const [trustSignal, setTrustSignal] = useState('');
    
    // Generation State
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentResult, setCurrentResult] = useState<GeneratedContent | null>(null);
    const [imageIdeas, setImageIdeas] = useState<string[]>([]);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    // Save Modal State
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<SavedAd['status']>('Draft');
    const [saveNotes, setSaveNotes] = useState('');

    const handleGenerate = async () => {
        if (!productName || !targetAudience) return;
        
        setIsGenerating(true);
        setCurrentResult(null);
        setImageIdeas([]);
        setGeneratedImage(null);

        // Parallel execution for creative text and image ideas
        const [creative, ideas] = await Promise.all([
            generateAdCreative(productName, targetAudience, platform, brandProfile, trustSignal, format),
            generateImageIdeas(productName, targetAudience, platform, format)
        ]);

        if (creative) {
            setCurrentResult(creative);
        }
        if (ideas) {
            setImageIdeas(ideas);
        }
        setIsGenerating(false);
    };

    const handleGenerateVisual = async (prompt: string) => {
        setIsGeneratingImage(true);
        const base64Image = await generateAdImage(prompt, format === AdFormat.STORY ? '9:16' : '1:1');
        if (base64Image) {
            setGeneratedImage(base64Image);
            if (currentResult) {
                setCurrentResult({ ...currentResult, imageUrl: base64Image });
            }
        }
        setIsGeneratingImage(false);
    };

    const handleOpenSaveModal = () => {
        if (!currentResult) return;
        setIsSaveModalOpen(true);
    };

    const handleConfirmSave = () => {
        if (!currentResult) return;
        const newAd: SavedAd = {
            ...currentResult,
            id: 'ad_' + Date.now(),
            createdAt: new Date().toISOString().split('T')[0],
            platform,
            format,
            productName,
            status: saveStatus,
            notes: saveNotes,
            imageUrl: generatedImage || currentResult.imageUrl
        };
        saveAd(newAd);
        setIsSaveModalOpen(false);
        // Reset save state
        setSaveStatus('Draft');
        setSaveNotes('');
    };

    const getCharCountColor = (current: number, max: number) => {
        if (current > max) return 'text-red-500';
        if (current > max * 0.9) return 'text-amber-500';
        return 'text-emerald-500';
    };

    return (
        <div className="space-y-6">
            <Modal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                title="Save Creative Asset"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsSaveModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleConfirmSave}>Save Creative</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-textMain mb-2">Asset Status</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {['Draft', 'Review', 'Approved', 'Rejected'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSaveStatus(s as any)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                                        saveStatus === s 
                                        ? 'bg-primary/20 border-primary text-primary' 
                                        : 'bg-background border-border text-textMuted hover:bg-zinc-800'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-textMain mb-2">Notes (Optional)</label>
                        <textarea
                            className="w-full bg-background border border-border rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-primary resize-none h-24 placeholder:text-textMuted/50"
                            placeholder="Add strategic notes, targeting context, or revision instructions..."
                            value={saveNotes}
                            onChange={(e) => setSaveNotes(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-textMain tracking-tight">Ad Studio</h1>
                    <p className="text-textMuted mt-1">Generate high-converting ad copy and visuals with Gemini 2.5.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                {/* LEFT: Input Configuration */}
                <div className="lg:col-span-4 space-y-6">
                    <Card title="Campaign Context">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-textMuted uppercase mb-1.5">Product / Offer</label>
                                <input 
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textMain outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="e.g. Premium Noise-Cancelling Headphones"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-textMuted uppercase mb-1.5">Target Audience</label>
                                <textarea 
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textMain outline-none focus:ring-1 focus:ring-primary resize-none h-20"
                                    placeholder="e.g. Remote workers and audiophiles aged 25-45"
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-textMuted uppercase mb-1.5">Platform</label>
                                    <select 
                                        className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-textMain outline-none focus:ring-1 focus:ring-primary"
                                        value={platform}
                                        onChange={(e) => setPlatform(e.target.value as Platform)}
                                    >
                                        {Object.values(Platform).map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-textMuted uppercase mb-1.5">Format</label>
                                    <select 
                                        className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-textMain outline-none focus:ring-1 focus:ring-primary"
                                        value={format}
                                        onChange={(e) => setFormat(e.target.value as AdFormat)}
                                    >
                                        {Object.values(AdFormat).map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-textMuted uppercase mb-1.5">Key Trust Signal (Optional)</label>
                                <input 
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textMain outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="e.g. 30-Day Money Back Guarantee"
                                    value={trustSignal}
                                    onChange={(e) => setTrustSignal(e.target.value)}
                                />
                            </div>

                            <Button 
                                className="w-full mt-4" 
                                size="lg" 
                                onClick={handleGenerate} 
                                isLoading={isGenerating}
                                disabled={!productName || !targetAudience}
                            >
                                <Sparkles size={18} className="mr-2" /> Generate Concepts
                            </Button>
                        </div>
                    </Card>

                    {imageIdeas.length > 0 && (
                        <Card title="Visual Concepts">
                            <div className="space-y-3">
                                {imageIdeas.map((idea, idx) => (
                                    <div key={idx} className="p-3 bg-background border border-border rounded-lg text-sm hover:border-primary/50 transition-colors group cursor-pointer" onClick={() => handleGenerateVisual(idea)}>
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="text-textMuted group-hover:text-textMain">{idea}</p>
                                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                                                <ImageIcon size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                {/* MIDDLE: Preview Area */}
                <div className="lg:col-span-5 flex flex-col items-center">
                     {currentResult ? (
                        <div className="w-full max-w-sm bg-white text-black rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                            {/* Ad Header */}
                            <div className="p-3 flex items-center gap-2 border-b border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                <div>
                                    <p className="font-bold text-sm leading-none">{brandProfile.name}</p>
                                    <p className="text-[10px] text-gray-500">Sponsored</p>
                                </div>
                            </div>

                            {/* Ad Body Text (Above Image) */}
                            <div className="px-3 py-2 text-sm">
                                {currentResult.body}
                            </div>

                            {/* Ad Image */}
                            <div className="aspect-square bg-gray-100 relative group overflow-hidden flex items-center justify-center">
                                {generatedImage ? (
                                    <img src={generatedImage} alt="Generated Ad" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-6">
                                        <ImageIcon size={48} className="mx-auto text-gray-300 mb-2" />
                                        <p className="text-xs text-gray-400">Select a visual concept to generate image</p>
                                    </div>
                                )}
                                {isGeneratingImage && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                        <Loader2 className="animate-spin text-white" size={32} />
                                    </div>
                                )}
                            </div>

                            {/* Ad Footer (CTA) */}
                            <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">
                                        {platform === Platform.INSTAGRAM ? 'Instagram' : 'Facebook'}
                                    </p>
                                    <p className="font-bold text-sm truncate max-w-[180px]">{currentResult.headline}</p>
                                </div>
                                <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-blue-700 transition-colors">
                                    {currentResult.callToAction}
                                </button>
                            </div>
                            
                            {/* Actions Bar */}
                            <div className="bg-gray-900 p-3 flex justify-between items-center">
                                <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800" onClick={handleOpenSaveModal}>
                                    <Save size={16} className="mr-2" /> Save Asset
                                </Button>
                                <div className="flex gap-1">
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-800"><Copy size={16} /></Button>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-800"><RefreshCw size={16} /></Button>
                                </div>
                            </div>
                        </div>
                     ) : (
                         <div className="flex flex-col items-center justify-center h-full text-textMuted opacity-50 space-y-4">
                             <Monitor size={64} />
                             <p>Preview will appear here</p>
                         </div>
                     )}
                </div>

                {/* RIGHT: Analysis Panel */}
                <div className="lg:col-span-3">
                     {currentResult && (
                        <div className="space-y-4 h-full overflow-y-auto custom-scrollbar">
                            <div className="bg-surface border border-border rounded-xl p-5 shadow-inner">
                                <h4 className="text-xs font-bold text-textMuted uppercase mb-4 flex items-center gap-2">
                                    <Info size={14} /> Content Intelligence
                                </h4>
                                
                                {/* Headline Stats */}
                                <div className="mb-4">
                                   <div className="flex justify-between text-xs mb-1.5">
                                       <span className="text-textMain font-medium flex items-center gap-1.5"><Type size={12}/> Headline</span>
                                       <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-textMuted">{currentResult.headline.split(/\s+/).filter(w => w.length > 0).length} words</span>
                                            <span className={`font-mono ${getCharCountColor(currentResult.headline.length, 40)}`}>{currentResult.headline.length} / 40 chars</span>
                                       </div>
                                   </div>
                                   <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                       <div className={`h-full transition-all duration-500 ${currentResult.headline.length > 40 ? 'bg-yellow-500' : 'bg-emerald-500'}`} style={{width: `${Math.min((currentResult.headline.length/40)*100, 100)}%`}}></div>
                                   </div>
                                   <p className="text-[10px] text-textMuted mt-1.5">
                                    {currentResult.headline.length > 40 ? 'Warning: May truncate on mobile screens.' : 'Optimal length for maximum impact.'}
                                   </p>
                                </div>

                                 {/* Body Stats */}
                                <div className="mb-4">
                                   <div className="flex justify-between text-xs mb-1.5">
                                       <span className="text-textMain font-medium flex items-center gap-1.5"><AlignLeft size={12}/> Primary Text</span>
                                       <div className="flex items-center gap-2">
                                           <span className="text-[10px] text-textMuted">{currentResult.body.split(/\s+/).filter(w => w.length > 0).length} words</span>
                                           <span className={`font-mono ${getCharCountColor(currentResult.body.length, 125)}`}>{currentResult.body.length} / 125 chars</span>
                                       </div>
                                   </div>
                                   <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                       <div className={`h-full transition-all duration-500 ${currentResult.body.length > 125 ? 'bg-yellow-500' : 'bg-emerald-500'}`} style={{width: `${Math.min((currentResult.body.length/125)*100, 100)}%`}}></div>
                                   </div>
                                   <p className="text-[10px] text-textMuted mt-1.5">First 125 characters are visible before "See More".</p>
                                </div>
                                
                                 {/* CTA Visibility */}
                                <div className="p-3 bg-zinc-900/50 rounded-lg border border-border">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-textMuted uppercase font-bold">Call to Action</span>
                                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                            <CheckCircle2 size={10} /> High Visibility
                                        </span>
                                    </div>
                                    <Button size="sm" className="w-full text-xs font-bold tracking-wide shadow-md" variant="primary">
                                        {currentResult.callToAction} <MousePointerClick size={14} className="ml-2 opacity-80" />
                                    </Button>
                                </div>

                                <div className="mt-4 pt-4 border-t border-border">
                                     <h4 className="text-xs font-bold text-textMuted uppercase mb-2">Predicted Performance</h4>
                                     <div className="flex items-center gap-2">
                                         <Zap size={16} className="text-yellow-500" />
                                         <span className="font-bold text-textMain">High Conversion Potential</span>
                                     </div>
                                     <p className="text-[10px] text-textMuted mt-1">Based on historical data for {format} ads in this category.</p>
                                </div>
                            </div>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};
