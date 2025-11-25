
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { useData } from '../context/DataContext';
import { AdCampaign, Platform } from '../types';
import { 
    Filter, Search, MoreHorizontal, ArrowUpRight, ArrowDownRight, 
    Plus, Trash2, Copy, Edit3, Play, Pause, AlertCircle, ChevronDown, Check,
    Grid, List, CheckSquare, Square, X, GripVertical, BarChart2
} from 'lucide-react';

export const CampaignManager: React.FC = () => {
    const { campaigns, addCampaign, updateCampaign, deleteCampaign, showToast } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Paused'>('All');
    const [platformFilter, setPlatformFilter] = useState<'All' | Platform>('All');
    const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
    
    // Selection State
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Edit Modal State
    const [editingCampaign, setEditingCampaign] = useState<AdCampaign | null>(null);
    const [editForm, setEditForm] = useState<Partial<AdCampaign>>({});

    const filteredCampaigns = campaigns.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        const matchesPlatform = platformFilter === 'All' || c.platform === platformFilter;
        return matchesSearch && matchesStatus && matchesPlatform;
    });

    // Selection Logic
    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredCampaigns.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredCampaigns.map(c => c.id));
        }
    };

    // Bulk Actions
    const handleBulkDelete = () => {
        const count = selectedIds.length;
        selectedIds.forEach(id => deleteCampaign(id));
        setSelectedIds([]);
        showToast({ title: 'Bulk Delete Complete', message: `Removed ${count} campaigns.`, type: 'success' });
    };

    const handleBulkStatus = (status: 'Active' | 'Paused') => {
        const count = selectedIds.length;
        selectedIds.forEach(id => updateCampaign(id, { status }));
        setSelectedIds([]);
        showToast({ title: 'Status Updated', message: `${status} ${count} campaigns.`, type: 'success' });
    };

    const handleStatusToggle = (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
        updateCampaign(id, { status: newStatus as any });
        showToast({ title: `Campaign ${newStatus}`, type: newStatus === 'Active' ? 'success' : 'info', duration: 2000 });
    };

    const handleDuplicate = (campaign: AdCampaign) => {
        const now = new Date();
        const nextMonth = new Date();
        nextMonth.setDate(now.getDate() + 30);

        addCampaign({
            ...campaign,
            id: 'c_' + Date.now(),
            name: `${campaign.name} (Copy)`,
            status: 'Draft',
            spend: 0,
            reach: 0,
            startDate: now.toISOString().split('T')[0],
            endDate: nextMonth.toISOString().split('T')[0]
        });
    };

    const openEditModal = (campaign: AdCampaign) => {
        setEditingCampaign(campaign);
        setEditForm({ name: campaign.name, status: campaign.status, platform: campaign.platform });
    };

    const saveEdit = () => {
        if (editingCampaign) {
            updateCampaign(editingCampaign.id, editForm);
            setEditingCampaign(null);
            showToast({ title: 'Changes Saved', type: 'success' });
        }
    };

    const totalSpend = filteredCampaigns.reduce((acc, c) => acc + c.spend, 0);
    const avgRoas = filteredCampaigns.length ? (filteredCampaigns.reduce((acc, c) => acc + c.roas, 0) / filteredCampaigns.length).toFixed(1) : 0;

    return (
        <div className="space-y-6 relative h-full">
            <Modal
                isOpen={!!editingCampaign}
                onClose={() => setEditingCampaign(null)}
                title="Edit Campaign"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setEditingCampaign(null)}>Cancel</Button>
                        <Button onClick={saveEdit}>Save Changes</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-textMuted mb-1">Name</label>
                        <input 
                            className="w-full bg-background border border-border rounded p-2 text-textMain outline-none focus:border-primary"
                            value={editForm.name || ''}
                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-textMuted mb-1">Platform</label>
                        <select 
                            className="w-full bg-background border border-border rounded p-2 text-textMain outline-none focus:border-primary"
                            value={editForm.platform}
                            onChange={e => setEditForm({...editForm, platform: e.target.value as Platform})}
                        >
                            {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-textMuted mb-1">Status</label>
                        <select 
                            className="w-full bg-background border border-border rounded p-2 text-textMain outline-none focus:border-primary"
                            value={editForm.status}
                            onChange={e => setEditForm({...editForm, status: e.target.value as any})}
                        >
                            <option value="Active">Active</option>
                            <option value="Paused">Paused</option>
                            <option value="Draft">Draft</option>
                            <option value="Review">Review</option>
                        </select>
                    </div>
                </div>
            </Modal>

            {/* Floating Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-full py-2 px-6 flex items-center gap-6 animate-in slide-in-from-bottom-10 duration-300 ring-1 ring-white/10">
                    <div className="flex items-center gap-2 border-r border-zinc-700 pr-4">
                        <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{selectedIds.length}</span>
                        <span className="text-sm font-medium text-white">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <button onClick={() => handleBulkStatus('Active')} className="p-2 hover:bg-emerald-500/20 text-emerald-500 rounded-full transition-colors" title="Activate All">
                             <Play size={18} fill="currentColor" />
                         </button>
                         <button onClick={() => handleBulkStatus('Paused')} className="p-2 hover:bg-zinc-700 text-zinc-300 rounded-full transition-colors" title="Pause All">
                             <Pause size={18} fill="currentColor" />
                         </button>
                         <button onClick={handleBulkDelete} className="p-2 hover:bg-red-500/20 text-red-500 rounded-full transition-colors" title="Delete All">
                             <Trash2 size={18} />
                         </button>
                    </div>
                    <div className="border-l border-zinc-700 pl-4">
                        <button onClick={() => setSelectedIds([])} className="text-zinc-500 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-textMain tracking-tight">Campaign Manager</h1>
                    <p className="text-textMuted mt-1">Create, manage, and optimize your ad campaigns.</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-surface border border-border rounded-lg flex p-1">
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-zinc-700 text-white' : 'text-textMuted hover:text-textMain'}`}
                        >
                            <List size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('board')}
                            className={`p-2 rounded ${viewMode === 'board' ? 'bg-zinc-700 text-white' : 'text-textMuted hover:text-textMain'}`}
                        >
                            <Grid size={16} />
                        </button>
                    </div>
                    <Button>
                        <Plus size={18} className="mr-2" /> New Campaign
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-primary/5 border-primary/20">
                    <p className="text-xs text-textMuted uppercase font-semibold">Active Campaigns</p>
                    <h3 className="text-2xl font-bold mt-1">{filteredCampaigns.filter(c => c.status === 'Active').length}</h3>
                </Card>
                <Card className="p-4">
                    <p className="text-xs text-textMuted uppercase font-semibold">Total Spend</p>
                    <h3 className="text-2xl font-bold mt-1">${totalSpend.toLocaleString()}</h3>
                </Card>
                <Card className="p-4">
                    <p className="text-xs text-textMuted uppercase font-semibold">Avg. ROAS</p>
                    <h3 className="text-2xl font-bold mt-1 text-emerald-400">{avgRoas}x</h3>
                </Card>
                <Card className="p-4">
                    <p className="text-xs text-textMuted uppercase font-semibold">Total Reach</p>
                    <h3 className="text-2xl font-bold mt-1">{(filteredCampaigns.reduce((acc, c) => acc + c.reach, 0) / 1000).toFixed(1)}k</h3>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface border border-border rounded-xl p-4 sticky top-20 z-10 shadow-lg">
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                        <input 
                            type="text" 
                            placeholder="Search campaigns..." 
                            className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none w-64"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="h-9 w-px bg-border mx-2"></div>
                    <select 
                        className="bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                    </select>
                    <select 
                        className="bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                        value={platformFilter}
                        onChange={(e) => setPlatformFilter(e.target.value as any)}
                    >
                        <option value="All">All Platforms</option>
                        {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div className="flex gap-2 text-textMuted">
                    <button className="p-2 hover:bg-zinc-800 rounded-lg"><Filter size={18} /></button>
                </div>
            </div>

            {viewMode === 'list' ? (
                <Card className="min-h-[400px] flex flex-col p-0 overflow-hidden">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="text-xs text-textMuted uppercase bg-background/50 border-b border-border">
                                <tr>
                                    <th className="px-4 py-3 w-10">
                                        <button onClick={toggleSelectAll} className="text-textMuted hover:text-white">
                                            {selectedIds.length > 0 && selectedIds.length === filteredCampaigns.length ? <CheckSquare size={16} /> : <Square size={16} />}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 font-medium">On/Off</th>
                                    <th className="px-4 py-3 font-medium">Campaign Name</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium text-right">Spend</th>
                                    <th className="px-4 py-3 font-medium text-right">Reach</th>
                                    <th className="px-4 py-3 font-medium text-right">ROAS</th>
                                    <th className="px-4 py-3 font-medium text-right">CTR</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredCampaigns.map((campaign) => (
                                    <tr 
                                        key={campaign.id} 
                                        className={`group transition-colors ${selectedIds.includes(campaign.id) ? 'bg-primary/10 hover:bg-primary/20' : 'hover:bg-white/5'}`}
                                    >
                                        <td className="px-4 py-3">
                                            <button onClick={() => toggleSelection(campaign.id)} className={`${selectedIds.includes(campaign.id) ? 'text-primary' : 'text-zinc-600 hover:text-zinc-400'}`}>
                                                {selectedIds.includes(campaign.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={campaign.status === 'Active'} 
                                                        onChange={() => handleStatusToggle(campaign.id, campaign.status)}
                                                        className="sr-only peer"
                                                        disabled={campaign.status === 'Draft' || campaign.status === 'Review'}
                                                    />
                                                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-textMain">{campaign.name}</div>
                                            <div className="text-[10px] text-textMuted flex items-center gap-2 mt-0.5">
                                                <span className={`px-1.5 py-0.5 rounded ${
                                                    campaign.platform === Platform.FACEBOOK ? 'bg-blue-900/30 text-blue-400' : 
                                                    campaign.platform === Platform.INSTAGRAM ? 'bg-pink-900/30 text-pink-400' :
                                                    'bg-green-900/30 text-green-400'
                                                }`}>{campaign.platform}</span>
                                                <span>ID: {campaign.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={
                                                campaign.status === 'Active' ? 'success' :
                                                campaign.status === 'Paused' ? 'neutral' :
                                                campaign.status === 'Review' ? 'warning' : 'info'
                                            }>
                                                {campaign.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono">${campaign.spend.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">{campaign.reach.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={campaign.roas >= 3 ? 'text-emerald-400 font-bold' : campaign.roas < 1.5 && campaign.spend > 0 ? 'text-rose-400' : ''}>
                                                {campaign.roas}x
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">{campaign.ctr}%</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEditModal(campaign)} className="p-1.5 hover:bg-zinc-700 rounded text-textMuted hover:text-white" title="Edit">
                                                    <Edit3 size={14} />
                                                </button>
                                                <button onClick={() => handleDuplicate(campaign)} className="p-1.5 hover:bg-zinc-700 rounded text-textMuted hover:text-white" title="Duplicate">
                                                    <Copy size={14} />
                                                </button>
                                                <button onClick={() => deleteCampaign(campaign.id)} className="p-1.5 hover:bg-rose-900/50 rounded text-textMuted hover:text-rose-400" title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-border bg-background/30 text-xs text-textMuted flex justify-between items-center rounded-b-xl">
                        <span>Showing {filteredCampaigns.length} campaigns</span>
                        <div className="flex gap-2">
                            <button className="px-2 py-1 rounded hover:bg-zinc-800 disabled:opacity-50">Previous</button>
                            <button className="px-2 py-1 rounded hover:bg-zinc-800 disabled:opacity-50">Next</button>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="flex overflow-x-auto gap-6 pb-6 items-start h-[calc(100vh-300px)] custom-scrollbar">
                     {['Draft', 'Review', 'Active', 'Paused'].map(status => {
                         const items = filteredCampaigns.filter(c => c.status === status);
                         const statusSpend = items.reduce((acc, curr) => acc + curr.spend, 0);
                         
                         return (
                             <div key={status} className="w-80 shrink-0 flex flex-col h-full bg-surface/30 border border-border/50 rounded-xl overflow-hidden backdrop-blur-sm">
                                 {/* Column Header */}
                                 <div className="p-4 border-b border-border/50 bg-surface/80 sticky top-0 flex flex-col gap-1 z-10">
                                     <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${
                                                status === 'Active' ? 'bg-emerald-500' : 
                                                status === 'Paused' ? 'bg-zinc-500' : 
                                                status === 'Review' ? 'bg-amber-500' : 'bg-blue-500'
                                            }`}></div>
                                            {status}
                                        </h3>
                                        <Badge variant="neutral" className="bg-zinc-800 text-textMuted">{items.length}</Badge>
                                     </div>
                                     <div className="flex justify-between items-center text-[10px] text-textMuted mt-1">
                                         <span>Total Spend</span>
                                         <span className="font-mono">${statusSpend.toLocaleString()}</span>
                                     </div>
                                 </div>

                                 {/* Column Content */}
                                 <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-zinc-900/20">
                                     {items.length === 0 && (
                                         <div className="h-24 flex items-center justify-center text-textMuted text-xs border-2 border-dashed border-border/50 rounded-lg opacity-50">
                                             Empty
                                         </div>
                                     )}
                                     {items.map(item => (
                                         <div key={item.id} className="bg-surface border border-border rounded-lg p-4 hover:border-primary/50 transition-all shadow-sm group cursor-pointer relative hover:shadow-lg hover:-translate-y-0.5 duration-200" onClick={() => openEditModal(item)}>
                                             <div className="absolute top-3 right-3 text-zinc-600 opacity-0 group-hover:opacity-100 cursor-grab">
                                                <GripVertical size={14} />
                                             </div>

                                             <div className="flex justify-between items-start mb-2 pr-4">
                                                 <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                                    item.platform === Platform.FACEBOOK ? 'bg-blue-900/20 text-blue-400' : 
                                                    item.platform === Platform.INSTAGRAM ? 'bg-pink-900/20 text-pink-400' :
                                                    'bg-green-900/20 text-green-400'
                                                }`}>{item.platform}</span>
                                             </div>
                                             
                                             <h4 className="font-bold text-textMain mb-3 leading-tight">{item.name}</h4>
                                             
                                             {/* Budget Visual */}
                                             <div className="mb-3">
                                                 <div className="flex justify-between text-[10px] text-textMuted mb-1">
                                                     <span>Budget Usage</span>
                                                     <span>{(Math.random() * 80 + 10).toFixed(0)}%</span>
                                                 </div>
                                                 <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                     <div className="h-full bg-gradient-to-r from-primary/50 to-primary" style={{width: `${Math.random() * 80 + 10}%`}}></div>
                                                 </div>
                                             </div>

                                             <div className="grid grid-cols-2 gap-2 text-xs border-t border-border pt-3">
                                                 <div className="flex flex-col">
                                                     <p className="text-textMuted text-[10px]">Spend</p>
                                                     <p className="font-mono font-semibold text-textMain">${item.spend.toLocaleString()}</p>
                                                 </div>
                                                 <div className="flex flex-col text-right">
                                                     <p className="text-textMuted text-[10px]">ROAS</p>
                                                     <p className={`font-mono font-semibold ${item.roas >= 2.5 ? 'text-emerald-400' : ''}`}>{item.roas}x</p>
                                                 </div>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         )
                     })}
                </div>
            )}
        </div>
    );
};
