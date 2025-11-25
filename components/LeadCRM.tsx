
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useData } from '../context/DataContext';
import { Lead, Platform } from '../types';
import { scoreLead } from '../services/geminiService';
import { 
    UserCheck, Phone, Mail, Facebook, Instagram, MoreHorizontal, 
    Star, Download, Search, Filter, TrendingUp, CheckCircle, XCircle,
    Clock, Calendar, MessageCircle, X
} from 'lucide-react';

export const LeadCRM: React.FC = () => {
    const { leads, updateLeadStatus } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'All' | 'New' | 'Qualified'>('All');
    const [scoringLeadId, setScoringLeadId] = useState<string | null>(null);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const handleScoreLead = async (lead: Lead) => {
        setScoringLeadId(lead.id);
        // Simulate AI scoring call
        await new Promise(resolve => setTimeout(resolve, 800));
        const score = Math.floor(Math.random() * 40) + 60; // Mock updated score
        setScoringLeadId(null);
    };

    const filteredLeads = leads.filter(l => 
        (activeTab === 'All' || l.status === activeTab) &&
        (l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const statusColors = {
        'New': 'bg-blue-500/20 text-blue-400',
        'Contacted': 'bg-yellow-500/20 text-yellow-400',
        'Qualified': 'bg-emerald-500/20 text-emerald-400',
        'Converted': 'bg-purple-500/20 text-purple-400',
        'Lost': 'bg-zinc-500/20 text-zinc-400'
    };

    return (
        <div className="space-y-6">
            {/* Lead Detail Modal */}
            {selectedLead && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
                    <div className="w-full max-w-md bg-surface border-l border-border h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="p-6 border-b border-border flex justify-between items-start bg-background/50">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-lg font-bold text-white">
                                        {selectedLead.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-textMain">{selectedLead.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusColors[selectedLead.status]}`}>
                                                {selectedLead.status}
                                            </span>
                                            <span className="text-xs text-textMuted">Added {selectedLead.createdAt}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedLead(null)} className="text-textMuted hover:text-white p-1">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Score Card */}
                            <div className="bg-zinc-900/50 border border-border rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-textMuted uppercase font-bold mb-1">Lead Quality Score</p>
                                    <div className="flex items-center gap-2">
                                        <div className="text-3xl font-bold text-textMain">{selectedLead.qualityScore}</div>
                                        <span className="text-xs text-emerald-400 font-medium">High Potential</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 relative flex items-center justify-center">
                                     <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-zinc-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                        <path className={`${selectedLead.qualityScore > 80 ? 'text-emerald-500' : selectedLead.qualityScore > 50 ? 'text-yellow-500' : 'text-red-500'}`} strokeDasharray={`${selectedLead.qualityScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                    </svg>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-textMain border-b border-border pb-2">Contact Information</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail size={16} className="text-textMuted" />
                                        <a href={`mailto:${selectedLead.email}`} className="text-blue-400 hover:underline">{selectedLead.email}</a>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone size={16} className="text-textMuted" />
                                        <span className="text-textMain">{selectedLead.phone || 'No phone provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        {selectedLead.platform === Platform.FACEBOOK ? <Facebook size={16} className="text-blue-500" /> : <Instagram size={16} className="text-pink-500" />}
                                        <span className="text-textMain">Source: {selectedLead.source}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-textMain border-b border-border pb-2">Notes</h4>
                                <textarea 
                                    className="w-full bg-background border border-border rounded-lg p-3 text-sm min-h-[100px] outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Add a note about this lead..."
                                    defaultValue={selectedLead.notes}
                                />
                                <div className="flex justify-end">
                                    <Button size="sm" variant="secondary">Save Note</Button>
                                </div>
                            </div>

                             {/* History Mockup */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-textMain border-b border-border pb-2">Activity History</h4>
                                <div className="relative pl-4 border-l border-border space-y-6">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background"></div>
                                        <p className="text-sm font-medium text-textMain">Lead Created</p>
                                        <p className="text-xs text-textMuted">{selectedLead.createdAt}</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-zinc-600 border-2 border-background"></div>
                                        <p className="text-sm font-medium text-textMain">Viewed Pricing Page</p>
                                        <p className="text-xs text-textMuted">2 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-border bg-background/50 flex gap-2">
                            <Button className="flex-1" onClick={() => updateLeadStatus(selectedLead.id, 'Qualified')}>Qualify</Button>
                            <Button className="flex-1" variant="secondary">Send Email</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-textMain tracking-tight">Leads CRM</h1>
                    <p className="text-textMuted mt-1">Manage and score incoming leads from your campaigns.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary">
                        <Download size={16} className="mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                        <UserCheck size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-textMuted uppercase font-bold">Total Leads</p>
                        <p className="text-xl font-bold text-textMain">{leads.length}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                        <Star size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-textMuted uppercase font-bold">Qualified</p>
                        <p className="text-xl font-bold text-textMain">{leads.filter(l=>l.status==='Qualified').length}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-textMuted uppercase font-bold">Conv. Rate</p>
                        <p className="text-xl font-bold text-textMain">12.5%</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 text-textMuted flex items-center justify-center">
                        <Filter size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-textMuted uppercase font-bold">Avg Score</p>
                        <p className="text-xl font-bold text-textMain">72</p>
                    </div>
                </Card>
            </div>

            <Card className="min-h-[500px] flex flex-col">
                <div className="p-4 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-1 bg-background border border-border p-1 rounded-lg">
                        {['All', 'New', 'Qualified'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === tab ? 'bg-zinc-700 text-white shadow-sm' : 'text-textMuted hover:text-textMain'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search size={16} className="absolute left-3 top-2.5 text-textMuted" />
                        <input 
                            type="text" 
                            placeholder="Search name or email..." 
                            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-textMuted uppercase bg-background/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-3 font-medium">Lead Name</th>
                                <th className="px-6 py-3 font-medium">Platform</th>
                                <th className="px-6 py-3 font-medium">Quality Score</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Created</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredLeads.map(lead => (
                                <tr 
                                    key={lead.id} 
                                    onClick={() => setSelectedLead(lead)}
                                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">
                                                {lead.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-textMain">{lead.name}</p>
                                                <p className="text-xs text-textMuted flex items-center gap-1">
                                                    <Mail size={10} /> {lead.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {lead.platform === Platform.FACEBOOK ? <Facebook size={16} className="text-blue-500" /> : <Instagram size={16} className="text-pink-500" />}
                                            <span className="text-textMuted">{lead.source}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${lead.qualityScore > 80 ? 'bg-emerald-500' : lead.qualityScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                                    style={{width: `${lead.qualityScore}%`}}
                                                ></div>
                                            </div>
                                            <span className={`font-bold ${lead.qualityScore > 80 ? 'text-emerald-400' : lead.qualityScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {lead.qualityScore}
                                            </span>
                                        </div>
                                        {scoringLeadId === lead.id && <span className="text-[10px] text-primary animate-pulse">Updating...</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[lead.status] || 'bg-zinc-800 text-textMuted'}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-textMuted">
                                        {lead.createdAt}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                            <button 
                                                onClick={() => updateLeadStatus(lead.id, 'Qualified')}
                                                className="p-1.5 hover:bg-emerald-500/20 rounded text-emerald-500" title="Qualify"
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                            <button 
                                                onClick={() => updateLeadStatus(lead.id, 'Lost')}
                                                className="p-1.5 hover:bg-red-500/20 rounded text-red-500" title="Mark Lost"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                            <button className="p-1.5 hover:bg-zinc-800 rounded text-textMuted hover:text-white">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
