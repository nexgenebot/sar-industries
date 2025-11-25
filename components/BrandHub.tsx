
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useData } from '../context/DataContext';
import { Fingerprint, Save, Sparkles, Hash, Palette, Megaphone, Target, Loader2 } from 'lucide-react';
import { auditBrandProfile } from '../services/geminiService';

export const BrandHub: React.FC = () => {
    const { brandProfile, updateBrandProfile } = useData();
    const [form, setForm] = useState(brandProfile);
    const [newKeyword, setNewKeyword] = useState('');
    const [manifesto, setManifesto] = useState('');
    const [isAuditing, setIsAuditing] = useState(false);

    const handleSave = () => {
        updateBrandProfile(form);
    };

    const handleAddKeyword = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newKeyword.trim()) {
            if (!form.keywords.includes(newKeyword.trim())) {
                setForm(prev => ({ ...prev, keywords: [...prev.keywords, newKeyword.trim()] }));
            }
            setNewKeyword('');
        }
    };

    const removeKeyword = (kw: string) => {
        setForm(prev => ({ ...prev, keywords: prev.keywords.filter(k => k !== kw) }));
    };

    const handleAudit = async () => {
        setIsAuditing(true);
        const result = await auditBrandProfile(form);
        setManifesto(result);
        setIsAuditing(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-textMain tracking-tight">Brand Identity Hub</h1>
                    <p className="text-textMuted mt-1">Define your brand's soul. AI will use this to generate consistent, on-brand content.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={handleAudit} isLoading={isAuditing}>
                        <Sparkles size={16} className="mr-2 text-accent" /> Generate Manifesto
                    </Button>
                    <Button onClick={handleSave}>
                        <Save size={16} className="mr-2" /> Save Identity
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Identity Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="relative overflow-hidden border-2 border-primary/20">
                         <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary to-accent opacity-20"></div>
                         <div className="relative pt-12 px-4 pb-4 text-center">
                             <div className="w-24 h-24 rounded-2xl bg-surface border-4 border-background shadow-xl mx-auto flex items-center justify-center text-4xl font-bold text-textMain mb-4">
                                 {form.name.charAt(0)}
                             </div>
                             <h2 className="text-2xl font-bold text-textMain">{form.name || 'Brand Name'}</h2>
                             <p className="text-textMuted text-sm mt-1">{form.tagline || 'Your catchy tagline here'}</p>
                             
                             <div className="mt-6 flex justify-center gap-4">
                                 <div className="text-center">
                                     <div className="w-8 h-8 rounded-full shadow-lg mx-auto mb-1 border border-white/10" style={{backgroundColor: form.primaryColor}}></div>
                                     <span className="text-[10px] text-textMuted uppercase">Primary</span>
                                 </div>
                                 <div className="text-center">
                                     <div className="w-8 h-8 rounded-full shadow-lg mx-auto mb-1 border border-white/10 bg-zinc-800"></div>
                                     <span className="text-[10px] text-textMuted uppercase">Secondary</span>
                                 </div>
                             </div>
                         </div>
                    </Card>

                    {manifesto && (
                        <Card title="AI Brand Manifesto" className="bg-gradient-to-br from-surface to-accent/5 border-accent/20">
                            <p className="text-sm text-textMain italic leading-relaxed font-serif opacity-90">
                                "{manifesto}"
                            </p>
                        </Card>
                    )}
                </div>

                {/* Configuration Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Core Identity">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-textMuted uppercase mb-2">Brand Name</label>
                                <div className="relative">
                                    <Fingerprint size={16} className="absolute left-3 top-3 text-textMuted" />
                                    <input 
                                        type="text" 
                                        value={form.name}
                                        onChange={e => setForm({...form, name: e.target.value})}
                                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-textMain focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-textMuted uppercase mb-2">Tagline</label>
                                <div className="relative">
                                    <Megaphone size={16} className="absolute left-3 top-3 text-textMuted" />
                                    <input 
                                        type="text" 
                                        value={form.tagline}
                                        onChange={e => setForm({...form, tagline: e.target.value})}
                                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-textMain focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-textMuted uppercase mb-2">Brand Description</label>
                                <textarea 
                                    value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                    rows={3}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textMain focus:ring-2 focus:ring-primary outline-none resize-none"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card title="Strategy & Aesthetics">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-textMuted uppercase mb-2">Brand Voice</label>
                                    <div className="relative">
                                        <Megaphone size={16} className="absolute left-3 top-3 text-textMuted" />
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Witty, Professional, Empathetic"
                                            value={form.voice}
                                            onChange={e => setForm({...form, voice: e.target.value})}
                                            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-textMain focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-textMuted uppercase mb-2">Primary Color (Hex)</label>
                                    <div className="relative">
                                        <Palette size={16} className="absolute left-3 top-3 text-textMuted" />
                                        <input 
                                            type="text" 
                                            value={form.primaryColor}
                                            onChange={e => setForm({...form, primaryColor: e.target.value})}
                                            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-textMain focus:ring-2 focus:ring-primary outline-none font-mono"
                                        />
                                        <div className="absolute right-3 top-2.5 w-6 h-6 rounded border border-white/20" style={{backgroundColor: form.primaryColor}}></div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-textMuted uppercase mb-2">Target Audience</label>
                                <div className="relative">
                                    <Target size={16} className="absolute left-3 top-3 text-textMuted" />
                                    <input 
                                        type="text" 
                                        value={form.targetAudience}
                                        onChange={e => setForm({...form, targetAudience: e.target.value})}
                                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-textMain focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-textMuted uppercase mb-2">Strategic Keywords</label>
                                <div className="bg-background border border-border rounded-lg p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-primary">
                                    {form.keywords.map((kw, i) => (
                                        <span key={i} className="bg-surface border border-border text-xs px-2 py-1 rounded flex items-center gap-1 animate-in fade-in zoom-in duration-200">
                                            <Hash size={10} className="text-textMuted" />
                                            {kw}
                                            <button onClick={() => removeKeyword(kw)} className="hover:text-red-400 ml-1"><span className="sr-only">Remove</span>&times;</button>
                                        </span>
                                    ))}
                                    <input 
                                        type="text" 
                                        value={newKeyword}
                                        onChange={e => setNewKeyword(e.target.value)}
                                        onKeyDown={handleAddKeyword}
                                        placeholder="Add keyword..."
                                        className="bg-transparent outline-none text-sm min-w-[100px] flex-1 py-1"
                                    />
                                </div>
                                <p className="text-[10px] text-textMuted mt-1">Press Enter to add tags.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};