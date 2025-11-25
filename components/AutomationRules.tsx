
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { useData } from '../context/DataContext';
import { AutomationRule } from '../types';
import { generateAutomationRule } from '../services/geminiService';
import { Workflow, Play, Pause, Plus, Trash2, Zap, ArrowRight, AlertTriangle, Sparkles, CheckCircle } from 'lucide-react';

export const AutomationRules: React.FC = () => {
    const { rules, addRule, updateRule, deleteRule } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [goal, setGoal] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
        triggerMetric: 'ROAS',
        triggerOperator: '<',
        triggerValue: 1.5,
        timeframe: 'Last 3 Days',
        action: 'Pause Campaign'
    });

    const handleGenerate = async () => {
        if (!goal) return;
        setIsGenerating(true);
        const generated = await generateAutomationRule(goal);
        if (generated) {
            setNewRule({ ...newRule, ...generated });
        }
        setIsGenerating(false);
    };

    const handleSaveRule = () => {
        if (!newRule.name) return;
        addRule({
            id: 'r_' + Date.now(),
            name: newRule.name,
            status: 'Active',
            triggerMetric: newRule.triggerMetric!,
            triggerOperator: newRule.triggerOperator!,
            triggerValue: newRule.triggerValue!,
            timeframe: newRule.timeframe || 'Last 3 Days',
            action: newRule.action!,
            actionValue: newRule.actionValue,
            lastRun: 'Never'
        });
        setIsModalOpen(false);
        setGoal('');
        setNewRule({ triggerMetric: 'ROAS', triggerOperator: '<', triggerValue: 1.5, timeframe: 'Last 3 Days', action: 'Pause Campaign' });
    };

    return (
        <div className="space-y-6">
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Automation Rule"
                maxWidth="2xl"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveRule} disabled={!newRule.name}>Create Rule</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    {/* AI Generator */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                        <label className="text-sm font-bold text-primary flex items-center gap-2">
                            <Sparkles size={14} /> AI Strategy Generator
                        </label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="e.g. Scale profitable campaigns aggressively" 
                                className="flex-1 bg-background border border-border rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-primary text-sm"
                                value={goal}
                                onChange={e => setGoal(e.target.value)}
                            />
                            <Button size="sm" onClick={handleGenerate} isLoading={isGenerating}>Generate</Button>
                        </div>
                    </div>

                    {/* Manual Builder */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-textMuted uppercase mb-1">Rule Name</label>
                            <input 
                                type="text" 
                                className="w-full bg-background border border-border rounded p-2 outline-none"
                                value={newRule.name || ''}
                                onChange={e => setNewRule({...newRule, name: e.target.value})}
                                placeholder="e.g. Stop Loss"
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-background/50 rounded-xl border border-border overflow-x-auto">
                            <div className="flex flex-col gap-1 min-w-[120px]">
                                <span className="text-xs text-textMuted font-bold uppercase">IF</span>
                                <select 
                                    className="bg-zinc-800 border border-border rounded p-2 text-sm outline-none"
                                    value={newRule.triggerMetric}
                                    onChange={e => setNewRule({...newRule, triggerMetric: e.target.value as any})}
                                >
                                    {['ROAS', 'Spend', 'CTR', 'CPM'].map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 min-w-[80px]">
                                <span className="text-xs text-textMuted font-bold uppercase">IS</span>
                                <select 
                                    className="bg-zinc-800 border border-border rounded p-2 text-sm outline-none"
                                    value={newRule.triggerOperator}
                                    onChange={e => setNewRule({...newRule, triggerOperator: e.target.value as any})}
                                >
                                    {['>', '<', '>='].map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 min-w-[100px]">
                                <span className="text-xs text-textMuted font-bold uppercase">VALUE</span>
                                <input 
                                    type="number" 
                                    className="bg-zinc-800 border border-border rounded p-2 text-sm outline-none w-24"
                                    value={newRule.triggerValue}
                                    onChange={e => setNewRule({...newRule, triggerValue: Number(e.target.value)})}
                                />
                            </div>
                            <div className="flex flex-col gap-1 min-w-[150px]">
                                <span className="text-xs text-textMuted font-bold uppercase">TIMEFRAME</span>
                                <select 
                                    className="bg-zinc-800 border border-border rounded p-2 text-sm outline-none"
                                    value={newRule.timeframe}
                                    onChange={e => setNewRule({...newRule, timeframe: e.target.value})}
                                >
                                    {['Today', 'Last 3 Days', 'Last 7 Days', 'Lifetime'].map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-center text-textMuted">
                            <ArrowRight size={24} className="rotate-90 md:rotate-0" />
                        </div>

                        <div className="p-4 bg-background/50 rounded-xl border border-border">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-textMuted font-bold uppercase">THEN</span>
                                <div className="flex gap-3">
                                    <select 
                                        className="bg-zinc-800 border border-border rounded p-2 text-sm outline-none flex-1"
                                        value={newRule.action}
                                        onChange={e => setNewRule({...newRule, action: e.target.value as any})}
                                    >
                                        {['Pause Campaign', 'Increase Budget', 'Decrease Budget', 'Notify'].map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                    {['Increase Budget', 'Decrease Budget'].includes(newRule.action || '') && (
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                className="bg-zinc-800 border border-border rounded p-2 text-sm outline-none w-20"
                                                value={newRule.actionValue || 0}
                                                onChange={e => setNewRule({...newRule, actionValue: Number(e.target.value)})}
                                                placeholder="%"
                                            />
                                            <span className="text-textMuted">%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-textMain tracking-tight">Smart Automation</h1>
                    <p className="text-textMuted mt-1">Rules and triggers to optimize your campaigns 24/7.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} className="mr-2" /> Create Rule
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {rules.map((rule) => (
                    <Card key={rule.id} className="relative group border-l-4 border-l-primary hover:border-primary transition-colors">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button 
                                onClick={() => updateRule(rule.id, { status: rule.status === 'Active' ? 'Paused' : 'Active' })}
                                className="p-1.5 hover:bg-zinc-800 rounded text-textMuted hover:text-textMain"
                            >
                                {rule.status === 'Active' ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                            <button 
                                onClick={() => deleteRule(rule.id)}
                                className="p-1.5 hover:bg-red-900/30 rounded text-textMuted hover:text-red-400"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-textMain">{rule.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={rule.status === 'Active' ? 'success' : 'neutral'}>{rule.status}</Badge>
                                    <span className="text-xs text-textMuted">Run: {rule.lastRun}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Logic Visualization */}
                            <div className="bg-background/50 p-3 rounded-lg border border-border space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-textMuted w-10">IF</span>
                                    <span className="font-mono text-primary">{rule.triggerMetric}</span>
                                    <span className="font-mono text-textMain">{rule.triggerOperator}</span>
                                    <span className="font-mono text-white">{rule.triggerValue}</span>
                                </div>
                                <div className="flex items-center gap-2 pl-12 text-xs text-textMuted">
                                    <span className="border-l-2 border-b-2 border-zinc-700 w-3 h-3 -ml-1"></span>
                                    in {rule.timeframe}
                                </div>
                                <div className="flex items-center gap-2 border-t border-dashed border-border pt-2 mt-2">
                                    <span className="text-xs font-bold text-textMuted w-10">THEN</span>
                                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                        <Zap size={12} /> {rule.action}
                                    </span>
                                    {rule.actionValue && <span className="bg-zinc-800 px-1 rounded text-xs">{rule.actionValue}%</span>}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}

                {/* Add New Placeholder */}
                <button onClick={() => setIsModalOpen(true)} className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-textMuted hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer min-h-[200px]">
                    <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
                        <Plus size={24} />
                    </div>
                    <p className="font-medium">Add New Rule</p>
                </button>
            </div>
        </div>
    );
};