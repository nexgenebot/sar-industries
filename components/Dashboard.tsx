
import React, { useEffect, useState } from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { KPIS, MOCK_CHART_DATA, RECENT_ACTIVITY } from '../constants';
import { useData } from '../context/DataContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, TrendingUp, AlertCircle, Sparkles, Activity, Eye, MousePointer, Image, Plus, X, Zap, ChevronRight, Sun, Moon, CloudSun } from 'lucide-react';
import { analyzeAdPerformance } from '../services/geminiService';
import { Platform } from '../types';

export const Dashboard: React.FC = () => {
    const { campaigns, addCampaign, userProfile } = useData();
    const [insight, setInsight] = useState<string>("");
    const [loadingInsight, setLoadingInsight] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // Quick Create State
    const [newCampaignName, setNewCampaignName] = useState('');

    useEffect(() => {
        const getInsight = async () => {
            setLoadingInsight(true);
            const dataString = JSON.stringify(campaigns.slice(0, 5).map(c => ({name: c.name, roas: c.roas, spend: c.spend})));
            const result = await analyzeAdPerformance(dataString);
            setInsight(result);
            setLoadingInsight(false);
        }
        getInsight();
    }, [campaigns]);

    const handleCreateCampaign = () => {
        if (!newCampaignName) return;
        const now = new Date();
        const nextMonth = new Date();
        nextMonth.setDate(now.getDate() + 30);

        addCampaign({
            id: 'c_' + Date.now(),
            name: newCampaignName,
            status: 'Draft',
            spend: 0,
            reach: 0,
            roas: 0,
            platform: Platform.FACEBOOK,
            ctr: 0,
            startDate: now.toISOString().split('T')[0],
            endDate: nextMonth.toISOString().split('T')[0]
        });
        setNewCampaignName('');
        setIsCreateModalOpen(false);
    };

    // Smart Optimization Logic
    const highPerformer = campaigns.find(c => c.status === 'Active' && c.roas > 2.5);
    const lowPerformer = campaigns.find(c => c.status === 'Active' && c.roas < 1.5 && c.spend > 500);

    // Time of day Greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const GreetingIcon = hour < 12 ? CloudSun : hour < 18 ? Sun : Moon;

  return (
    <div className="space-y-6">
      {/* Create Modal */}
      {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-surface border border-border rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-border flex justify-between items-center">
                      <h3 className="font-bold">New Campaign</h3>
                      <button onClick={() => setIsCreateModalOpen(false)}><X size={20} className="text-textMuted hover:text-white" /></button>
                  </div>
                  <div className="p-6">
                      <label className="block text-sm font-medium mb-2">Campaign Name</label>
                      <input 
                        type="text" 
                        value={newCampaignName}
                        onChange={(e) => setNewCampaignName(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g. Winter Sale 2024"
                        autoFocus
                      />
                  </div>
                  <div className="p-4 border-t border-border flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateCampaign}>Create Draft</Button>
                  </div>
              </div>
          </div>
      )}

      {/* Morning Briefing Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-surface to-surface border border-primary/10 p-6 md:p-8">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                  <div className="flex items-center gap-2 text-primary mb-2">
                      <GreetingIcon size={20} />
                      <span className="text-sm font-bold uppercase tracking-wider">{greeting}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-textMain mb-2">{userProfile.firstName}, here's your briefing.</h1>
                  <p className="text-textMuted max-w-xl">
                      Your campaigns have generated <span className="text-emerald-400 font-semibold">+12% more leads</span> than yesterday. 
                      Consider scaling the "Summer Sale" budget.
                  </p>
              </div>
              <div className="flex gap-3">
                  <button onClick={() => setIsCreateModalOpen(true)} className="bg-white text-black hover:bg-zinc-200 px-5 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2">
                      <Plus size={18} /> New Campaign
                  </button>
                  <button className="bg-surface border border-border hover:bg-zinc-800 text-textMain px-5 py-2.5 rounded-lg font-medium transition-colors">
                      View Reports
                  </button>
              </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((kpi, idx) => (
          <Card key={idx} className="p-0 border-l-4 border-l-primary/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">{kpi.name}</p>
                <h3 className="text-2xl font-bold text-textMain mt-2 tracking-tight">
                  {kpi.name.includes('Spend') ? '$' : ''}{kpi.value.toLocaleString()}
                  {kpi.name.includes('Rate') || kpi.name.includes('CTR') ? '%' : ''}
                </h3>
              </div>
              <Badge variant={kpi.trend === 'up' ? 'success' : kpi.trend === 'down' ? 'danger' : 'neutral'}>
                 {kpi.trend === 'up' ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                 {Math.abs(kpi.change || 0)}%
              </Badge>
            </div>
            <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{width: `${Math.random() * 60 + 20}%`}}></div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card title="Revenue & Spend" className="lg:col-span-2 min-h-[400px]">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs text-textMuted">
                <span className="w-3 h-3 rounded-full bg-primary"></span> Revenue
            </div>
            <div className="flex items-center gap-2 text-xs text-textMuted">
                <span className="w-3 h-3 rounded-full bg-accent"></span> Ad Spend
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVal2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }} 
                  itemStyle={{ color: '#f4f4f5' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                <Area type="monotone" dataKey="value2" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorVal2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Analysis & Quick Stats */}
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-surface to-blue-900/10 border-blue-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={100} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={18} className="text-blue-400" />
                        <h3 className="font-semibold text-textMain">Gemini Intelligence</h3>
                    </div>
                    {loadingInsight ? (
                        <div className="space-y-2 animate-pulse">
                            <div className="h-4 bg-white/5 rounded w-3/4"></div>
                            <div className="h-4 bg-white/5 rounded w-1/2"></div>
                            <div className="h-4 bg-white/5 rounded w-full"></div>
                        </div>
                    ) : (
                        <p className="text-sm text-textMuted leading-relaxed">
                            {insight}
                        </p>
                    )}
                    <button className="mt-4 text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center">
                        View Full Analysis <ArrowUpRight size={12} className="ml-1" />
                    </button>
                </div>
            </Card>

            {/* Smart Optimization Opportunities */}
            <Card title="Optimization Opportunities">
                <div className="space-y-3">
                    {highPerformer ? (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-3">
                            <div className="p-1.5 bg-emerald-500/20 rounded text-emerald-500 shrink-0">
                                <Zap size={14} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-emerald-400">Scale Budget</p>
                                <p className="text-xs text-textMuted mt-0.5">
                                    <span className="font-medium text-white">{highPerformer.name}</span> has a ROAS of {highPerformer.roas}x.
                                </p>
                            </div>
                            <ChevronRight size={16} className="ml-auto text-emerald-500 self-center" />
                        </div>
                    ) : null}
                    
                    {lowPerformer ? (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-3">
                            <div className="p-1.5 bg-rose-500/20 rounded text-rose-500 shrink-0">
                                <AlertCircle size={14} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-rose-400">Inefficient Spend</p>
                                <p className="text-xs text-textMuted mt-0.5">
                                    <span className="font-medium text-white">{lowPerformer.name}</span> is underperforming.
                                </p>
                            </div>
                            <ChevronRight size={16} className="ml-auto text-rose-500 self-center" />
                        </div>
                    ) : (
                        <div className="text-center py-4 text-sm text-textMuted">No critical optimizations found.</div>
                    )}
                </div>
            </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaigns Table */}
        <div className="lg:col-span-2">
            <Card title="Active Campaigns" action={<button className="text-xs text-primary hover:underline">View All</button>}>
                <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-textMuted uppercase bg-background/50 border-b border-border">
                    <tr>
                        <th className="px-4 py-3 font-medium">Campaign</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium text-right">Spend</th>
                        <th className="px-4 py-3 font-medium text-right">ROAS</th>
                        <th className="px-4 py-3 font-medium text-center"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                    {campaigns.slice(0, 5).map((campaign) => (
                        <tr key={campaign.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-4 py-3">
                            <div className="font-medium text-textMain">{campaign.name}</div>
                            <div className="text-xs text-textMuted flex items-center gap-1 mt-0.5">
                                {campaign.platform === 'Facebook' ? <span className="text-blue-500">FB</span> : <span className="text-pink-500">IG</span>}
                                <span>•</span>
                                <span>ID: {campaign.id.toUpperCase()}</span>
                            </div>
                        </td>
                        <td className="px-4 py-3">
                            <Badge variant={
                                campaign.status === 'Active' ? 'success' :
                                campaign.status === 'Paused' ? 'warning' :
                                campaign.status === 'Review' ? 'info' : 'neutral'
                            }>
                                {campaign.status}
                            </Badge>
                        </td>
                        <td className="px-4 py-3 text-right text-textMain font-mono">${campaign.spend.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                            <span className={`font-medium ${campaign.roas > 2 ? 'text-emerald-400' : 'text-textMain'}`}>
                                {campaign.roas}x
                            </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                            <button className="p-1 text-textMuted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal size={16} />
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </Card>
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-1">
            <Card title="Live Activity" className="h-full">
                <div className="space-y-0 relative">
                    {/* Vertical line connector */}
                    <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border"></div>
                    
                    {RECENT_ACTIVITY.map((log, idx) => (
                        <div key={log.id} className="relative pl-8 py-3 group">
                            <div className={`absolute left-0 top-4 w-5 h-5 rounded-full border-2 border-surface flex items-center justify-center z-10 ${
                                log.type === 'success' ? 'bg-emerald-500/20 text-emerald-500' :
                                log.type === 'warning' ? 'bg-amber-500/20 text-amber-500' :
                                'bg-blue-500/20 text-blue-500'
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full bg-current ${idx === 0 ? 'animate-pulse' : ''}`}></div>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-textMain group-hover:text-primary transition-colors">{log.action}</p>
                                    <p className="text-xs text-textMuted mt-0.5">{log.target} • <span className="text-textMuted/70">{log.user}</span></p>
                                </div>
                                <span className="text-[10px] font-mono text-textMuted bg-surface px-1.5 py-0.5 rounded border border-border">
                                    {log.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};
