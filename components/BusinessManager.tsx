import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useData } from '../context/DataContext';
import { BusinessEntity, Platform, Page } from '../types';
import { Building2, Plus, ShieldCheck, AlertTriangle, ExternalLink, Settings, CreditCard, Users, Link, ChevronLeft, Globe, Activity, Lock, Database, Trash2, Facebook, Instagram } from 'lucide-react';

export const BusinessManager: React.FC = () => {
    const { businesses, addBusiness } = useData();
    const [isAdding, setIsAdding] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState<BusinessEntity | null>(null);
    const [step, setStep] = useState(1);
    const [activeDetailTab, setActiveDetailTab] = useState('Overview');
    
    // Form state for new business
    const [newBizId, setNewBizId] = useState('');
    
    // Add Person Modal state
    const [isAddingPerson, setIsAddingPerson] = useState(false);
    const [newPersonEmail, setNewPersonEmail] = useState('');

    const handleConnectBusiness = () => {
        // Simulate adding a business
        const newBusiness: BusinessEntity = {
            id: newBizId || Math.random().toString(36).substr(2, 9),
            name: `Imported Business (${newBizId.slice(0,4)})`,
            verified: true,
            adAccounts: 1,
            pages: 1,
            status: 'Active',
            pixelId: 'PIXEL-' + Math.floor(Math.random() * 10000),
            domain: 'pending-verification.com',
            spendingLimit: 1000,
            assignedMembers: [],
            pageEntities: [
                { id: 'p1', name: 'Brand Page', followers: 120, category: 'Retail', platform: Platform.FACEBOOK }
            ]
        };
        addBusiness(newBusiness);
        setIsAdding(false);
        setStep(1);
        setNewBizId('');
    };

    const handleAddPerson = () => {
        if (!selectedBusiness || !newPersonEmail) return;
        // In a real app, this would update the specific business in the context.
        // For this demo, we'll update the local selected business state to reflect the UI change immediately.
        const newMember = {
            id: Math.random().toString(),
            name: newPersonEmail.split('@')[0],
            email: newPersonEmail,
            role: 'Analyst' as const,
            status: 'Pending' as const,
            lastActive: 'Invited'
        };
        
        const updatedBusiness = {
            ...selectedBusiness,
            assignedMembers: [...(selectedBusiness.assignedMembers || []), newMember]
        };
        setSelectedBusiness(updatedBusiness);
        setIsAddingPerson(false);
        setNewPersonEmail('');
    };

    const AddBusinessModal = () => (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface border border-border rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-border">
                    <h3 className="text-xl font-bold text-textMain">Connect Business Portfolio</h3>
                    <p className="text-sm text-textMuted mt-1">Import your assets from Meta Business Suite.</p>
                </div>
                <div className="p-6">
                    {step === 1 && (
                         <div className="space-y-4">
                            <label className="block">
                                <span className="text-sm font-medium text-textMain">Business ID</span>
                                <input 
                                    type="text" 
                                    value={newBizId}
                                    onChange={(e) => setNewBizId(e.target.value)}
                                    className="mt-1 w-full bg-background border border-border rounded-lg px-4 py-2 text-textMain focus:ring-2 focus:ring-primary outline-none" 
                                    placeholder="1234567890" 
                                />
                            </label>
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3">
                                <Link className="text-blue-400 shrink-0" size={20} />
                                <div className="text-sm text-blue-100">
                                    <p className="font-semibold">Meta Login Required</p>
                                    <p className="opacity-80">You'll be redirected to authenticate your permissions.</p>
                                </div>
                            </div>
                         </div>
                    )}
                    {step === 2 && (
                        <div className="flex flex-col items-center py-8 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center animate-pulse">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-textMain">Authentication Successful</h4>
                                <p className="text-textMuted">We found "Imported Business" with assets.</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-6 border-t border-border flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => { setIsAdding(false); setStep(1); }}>Cancel</Button>
                    <Button onClick={() => step === 1 ? setStep(2) : handleConnectBusiness()}>
                        {step === 1 ? 'Connect' : 'Import Assets'}
                    </Button>
                </div>
            </div>
        </div>
    );

    const AddPersonModal = () => (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface border border-border rounded-xl w-full max-w-md shadow-2xl">
                <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">Invite People</h3>
                    <input 
                        type="email" 
                        value={newPersonEmail}
                        onChange={(e) => setNewPersonEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 mb-4 outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setIsAddingPerson(false)}>Cancel</Button>
                        <Button onClick={handleAddPerson}>Invite</Button>
                    </div>
                </div>
            </div>
        </div>
    );

  if (selectedBusiness) {
      // Create mock pages if none exist (for initial mock data compatibility)
      const pages = selectedBusiness.pageEntities || [
          { id: 'p1', name: selectedBusiness.name + ' Official', followers: 12500, category: 'Brand', platform: Platform.FACEBOOK },
          { id: 'p2', name: '@' + selectedBusiness.name.replace(/\s/g, '').toLowerCase(), followers: 8400, category: 'Creator', platform: Platform.INSTAGRAM }
      ];

      return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {isAddingPerson && <AddPersonModal />}
              <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={() => setSelectedBusiness(null)} className="pl-0">
                      <ChevronLeft size={20} className="mr-1" /> Back
                  </Button>
                  <div className="h-6 w-px bg-border"></div>
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                          <Building2 size={16} />
                      </div>
                      <h2 className="text-xl font-bold">{selectedBusiness.name}</h2>
                      {selectedBusiness.verified && <ShieldCheck size={16} className="text-blue-500" />}
                  </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                  {/* Settings Sidebar */}
                  <div className="col-span-12 md:col-span-3">
                      <Card className="p-2 space-y-1">
                          {['Overview', 'People', 'Pages', 'Ad Accounts', 'Data Sources'].map(tab => (
                              <button
                                key={tab}
                                onClick={() => setActiveDetailTab(tab)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeDetailTab === tab ? 'bg-zinc-800 text-white' : 'text-textMuted hover:bg-zinc-800/50 hover:text-textMain'}`}
                              >
                                  {tab}
                              </button>
                          ))}
                      </Card>
                  </div>

                  {/* Main Detail Content */}
                  <div className="col-span-12 md:col-span-9 space-y-6">
                        <Card 
                            title={activeDetailTab} 
                            action={activeDetailTab === 'People' ? <Button size="sm" onClick={() => setIsAddingPerson(true)}><Plus size={14} className="mr-2" /> Add People</Button> : null}
                        >
                            {activeDetailTab === 'Overview' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-xl bg-surface border border-border">
                                            <p className="text-textMuted text-xs uppercase font-semibold">Spending Limit</p>
                                            <p className="text-xl font-bold mt-1 text-textMain">${selectedBusiness.spendingLimit?.toLocaleString() || 'Unlimited'}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-surface border border-border">
                                            <p className="text-textMuted text-xs uppercase font-semibold">Pixel Status</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                <p className="text-lg font-bold text-textMain">Active</p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-surface border border-border">
                                            <p className="text-textMuted text-xs uppercase font-semibold">Domain</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Globe size={16} className="text-textMuted" />
                                                <p className="text-lg font-bold text-textMain">{selectedBusiness.domain || 'Not Connected'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeDetailTab === 'People' && (
                                <div className="space-y-1">
                                    {selectedBusiness.assignedMembers && selectedBusiness.assignedMembers.length > 0 ? (
                                        selectedBusiness.assignedMembers.map(member => (
                                            <div key={member.id} className="flex items-center justify-between p-3 hover:bg-zinc-800/30 rounded-lg transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">
                                                        {member.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-textMain">{member.name}</p>
                                                        <p className="text-xs text-textMuted">{member.email}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="warning">Pending</Badge>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-textMuted">
                                            <p>No explicit member assignments yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeDetailTab === 'Pages' && (
                                <div className="space-y-4">
                                    {pages.map((page) => (
                                        <div key={page.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-background/50">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${page.platform === Platform.FACEBOOK ? 'bg-blue-600/20 text-blue-500' : 'bg-pink-600/20 text-pink-500'}`}>
                                                    {page.platform === Platform.FACEBOOK ? <Facebook size={20} /> : <Instagram size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-textMain">{page.name}</p>
                                                    <p className="text-xs text-textMuted">{page.category} • {page.followers.toLocaleString()} followers</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="secondary">View Page</Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeDetailTab === 'Data Sources' && (
                                <div className="space-y-4">
                                    <div className="p-4 border border-border rounded-lg bg-background/50">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-3">
                                                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg h-fit">
                                                    <Activity size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-textMain">Main Website Pixel</h4>
                                                    <p className="text-xs text-textMuted font-mono mt-1">ID: {selectedBusiness.pixelId}</p>
                                                </div>
                                            </div>
                                            <Badge variant="success">Receiving Data</Badge>
                                        </div>
                                        <div className="mt-4 grid grid-cols-3 gap-4">
                                            <div className="bg-surface p-2 rounded border border-border">
                                                <p className="text-[10px] text-textMuted uppercase">Page Views (24h)</p>
                                                <p className="text-lg font-bold">24.5k</p>
                                            </div>
                                            <div className="bg-surface p-2 rounded border border-border">
                                                <p className="text-[10px] text-textMuted uppercase">Purchases (24h)</p>
                                                <p className="text-lg font-bold">342</p>
                                            </div>
                                            <div className="bg-surface p-2 rounded border border-border">
                                                <p className="text-[10px] text-textMuted uppercase">Match Quality</p>
                                                <p className="text-lg font-bold text-emerald-400">8.9/10</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeDetailTab === 'Ad Accounts' && (
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/30 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center text-textMuted">
                                                    <CreditCard size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-textMain">Ad Account #{selectedBusiness.id}00{i}</p>
                                                    <p className="text-xs text-textMuted">USD • America/New_York</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="success">Active</Badge>
                                                <Button size="sm" variant="secondary">Open in Ads Manager</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-6">
      {isAdding && <AddBusinessModal />}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-textMain tracking-tight">Business Assets</h2>
          <p className="text-textMuted mt-1">Manage your centralized portfolios and permissions.</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus size={18} className="mr-2" />
          Add Portfolio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {businesses.map((biz) => (
          <Card key={biz.id} className="hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden" onClick={() => setSelectedBusiness(biz)}>
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings size={18} className="text-textMuted hover:text-textMain" />
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors border border-border">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-textMain leading-tight">{biz.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-textMuted">ID: {biz.id}</span>
                        {biz.verified && <span title="Verified"><ShieldCheck size={12} className="text-blue-500" /></span>}
                    </div>
                  </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-textMuted flex items-center gap-2"><CreditCard size={14} /> Ad Accounts</span>
                    <span className="font-semibold text-textMain">{biz.adAccounts}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-textMuted flex items-center gap-2"><Users size={14} /> Linked Pages</span>
                    <span className="font-semibold text-textMain">{biz.pages}</span>
                </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-center">
              <Badge variant={
                  biz.status === 'Active' ? 'success' :
                  biz.status === 'Pending' ? 'warning' : 'danger'
              }>{biz.status}</Badge>
              
              <span className="text-sm font-medium text-primary flex items-center group-hover:underline">
                Manage <ChevronLeft size={14} className="ml-1 rotate-180" />
              </span>
            </div>
          </Card>
        ))}
        
        {/* Add New Placeholder */}
        <button onClick={() => setIsAdding(true)} className="border border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-textMuted hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer min-h-[200px] group">
          <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Plus size={24} />
          </div>
          <p className="font-medium">Connect New Business</p>
          <p className="text-xs text-textMuted mt-1">Link Meta Business Suite</p>
        </button>
      </div>
    </div>
  );
};