import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Switch } from './ui/Switch';
import { MOCK_INVOICES, RECENT_ACTIVITY } from '../constants';
import { useData } from '../context/DataContext';
import { 
    User, Building, CreditCard, Bell, Shield, Mail, Download, Plus, 
    Trash2, CheckCircle, Lock, Smartphone, Globe, Key, LogOut, Zap, 
    LayoutGrid, RefreshCw, AlertTriangle, Link, Laptop, ShieldCheck, 
    Facebook, Instagram, Slack, Database, Server, Clock, Phone, FileDown, ShieldAlert,
    Video, Monitor, Moon, Sun, List, Filter, FileClock, Eye, Camera, Briefcase, MapPin, Linkedin, Twitter
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { userProfile, updateUserProfile, teamMembers, addTeamMember, businesses } = useData();
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'billing' | 'security' | 'integrations' | 'notifications' | 'privacy' | 'appearance' | 'audit'>('profile');
  
  // Profile Form State
  const [formData, setFormData] = useState(userProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Invite Member State
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [teamSearch, setTeamSearch] = useState('');

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(true);

  // Audit Logs State
  const [auditFilter, setAuditFilter] = useState('');

  const handleSaveProfile = () => {
    updateUserProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAvatarUpload = () => {
      setIsUploading(true);
      setTimeout(() => {
          setIsUploading(false);
          // Simulate new avatar
          setFormData({ ...formData, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName + Date.now()}&backgroundColor=b6e3f4` });
      }, 1500);
  };

  const handleCoverUpload = () => {
      setIsUploadingCover(true);
      setTimeout(() => {
          setIsUploadingCover(false);
          setFormData({ ...formData, coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop' });
      }, 1500);
  }

  const handleInvite = () => {
      if(!inviteEmail) return;
      addTeamMember({
          id: Math.random().toString(),
          name: inviteEmail.split('@')[0],
          email: inviteEmail,
          role: 'Analyst',
          status: 'Pending',
          lastActive: 'Invited'
      });
      setInviteEmail('');
      setIsInviting(false);
  };

  const tabs = [
      { id: 'profile', label: 'My Profile', icon: User },
      { id: 'team', label: 'Organization', icon: Building },
      { id: 'appearance', label: 'Appearance', icon: Monitor },
      { id: 'security', label: 'Security & Login', icon: Lock },
      { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
      { id: 'integrations', label: 'Integrations', icon: Link },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'audit', label: 'Audit Logs', icon: FileClock },
      { id: 'privacy', label: 'Data & Privacy', icon: ShieldAlert },
  ];

  const sessions = [
      { device: 'MacBook Pro 16"', location: 'San Francisco, US', active: 'Now', icon: Laptop, ip: '192.168.1.1' },
      { device: 'iPhone 15 Pro', location: 'San Francisco, US', active: '2h ago', icon: Smartphone, ip: '10.0.0.12' },
      { device: 'Windows PC', location: 'London, UK', active: '3d ago', icon: Server, ip: '172.16.0.5' },
  ];

  const loginHistory = [
      { event: 'Login Success', date: 'Oct 24, 10:42 AM', ip: '192.168.1.1', location: 'San Francisco, US', status: 'success' },
      { event: 'Password Changed', date: 'Oct 20, 04:15 PM', ip: '192.168.1.1', location: 'San Francisco, US', status: 'warning' },
      { event: 'Failed Attempt', date: 'Oct 15, 09:30 AM', ip: '45.22.19.112', location: 'Moscow, RU', status: 'danger' },
  ];

  const integrations = [
      { name: 'Meta for Business', icon: Facebook, status: 'Connected', desc: 'Sync ads, pages, and pixel data.' },
      { name: 'Google Analytics 4', icon: Zap, status: 'Connected', desc: 'Cross-reference traffic sources.' },
      { name: 'Slack', icon: Slack, status: 'Disconnected', desc: 'Get alerts in your team channel.' },
      { name: 'HubSpot', icon: Database, status: 'Disconnected', desc: 'Sync leads to your CRM.' },
      { name: 'Shopify', icon: LayoutGrid, status: 'Connected', desc: 'Product catalog sync active.' },
      { name: 'TikTok Ads', icon: Video, status: 'Disconnected', desc: 'Expand reach to new demographics.' },
  ];

  const filteredTeam = teamMembers.filter(m => 
    m.name.toLowerCase().includes(teamSearch.toLowerCase()) || 
    m.email.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const filteredAuditLogs = RECENT_ACTIVITY.filter(log => 
    log.action.toLowerCase().includes(auditFilter.toLowerCase()) ||
    log.user.toLowerCase().includes(auditFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-textMain tracking-tight">Settings</h1>
          <p className="text-textMuted mt-1">Manage your account preferences, security, and team access.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <div className="md:col-span-3">
                <Card className="p-2 space-y-1 sticky top-24">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab.id 
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                                : 'text-textMuted hover:bg-zinc-800/50 hover:text-textMain'
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </Card>
            </div>

            {/* Content Area */}
            <div className="md:col-span-9 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* --- PROFILE TAB --- */}
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        {/* Visual Profile Header */}
                        <div className="relative rounded-xl border border-border bg-surface overflow-hidden group">
                            {/* Cover Photo Area */}
                            <div className="h-40 bg-gradient-to-r from-primary/30 to-accent/30 relative">
                                {formData.coverImage && (
                                    <img src={formData.coverImage} className="w-full h-full object-cover" alt="Cover" />
                                )}
                                <div className="absolute inset-0 bg-black/10 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer" onClick={handleCoverUpload}>
                                    <Button variant="secondary" size="sm" isLoading={isUploadingCover}>
                                        <Camera size={14} className="mr-2" /> Change Cover
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="px-8 pb-6">
                                <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 gap-6">
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="w-32 h-32 rounded-full border-4 border-surface bg-zinc-800 flex items-center justify-center overflow-hidden shadow-xl relative group/avatar cursor-pointer">
                                            {formData.avatar ? (
                                                <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-3xl font-bold text-textMuted">{userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}</span>
                                            )}
                                            <div onClick={handleAvatarUpload} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                                {isUploading ? <RefreshCw className="animate-spin text-white" /> : <Camera className="text-white" />}
                                            </div>
                                        </div>
                                        {/* Status Indicator */}
                                        <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-surface flex items-center justify-center shadow-sm ${
                                            formData.status === 'Online' ? 'bg-green-500' : 
                                            formData.status === 'Away' ? 'bg-amber-500' : 
                                            formData.status === 'Busy' ? 'bg-red-500' : 'bg-zinc-500'
                                        }`} title={formData.status}></div>
                                    </div>
                                    
                                    <div className="flex-1 mb-1">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-textMain">{formData.firstName} {formData.lastName}</h2>
                                                <p className="text-textMuted text-sm flex items-center gap-2 mt-1">
                                                    {formData.jobTitle || 'No Job Title'} 
                                                    {formData.department && <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>}
                                                    {formData.department}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <select 
                                                    className="bg-zinc-900 border border-border rounded-lg text-xs px-3 py-2 outline-none focus:border-primary cursor-pointer text-textMain"
                                                    value={formData.status || 'Online'}
                                                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                                                >
                                                    <option value="Online">Online</option>
                                                    <option value="Away">Away</option>
                                                    <option value="Busy">Busy</option>
                                                    <option value="Offline">Invisible</option>
                                                </select>
                                                <Button size="sm" onClick={handleSaveProfile} className="shadow-lg shadow-primary/20">Save Changes</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Personal Information">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-textMuted uppercase mb-1.5">First Name</label>
                                            <input 
                                                type="text" 
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textMain focus:ring-1 focus:ring-primary outline-none" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-textMuted uppercase mb-1.5">Last Name</label>
                                            <input 
                                                type="text" 
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textMain focus:ring-1 focus:ring-primary outline-none" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-textMuted uppercase mb-1.5">Email Address</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3 top-2.5 text-textMuted" />
                                            <input 
                                                type="email" 
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-textMain focus:ring-1 focus:ring-primary outline-none" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-textMuted uppercase mb-1.5">Phone Number</label>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-3 top-2.5 text-textMuted" />
                                            <input 
                                                type="tel" 
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-textMain focus:ring-1 focus:ring-primary outline-none" 
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-textMuted uppercase mb-1.5">Bio</label>
                                        <textarea 
                                            rows={3}
                                            value={formData.bio}
                                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textMain focus:ring-1 focus:ring-primary outline-none resize-none" 
                                            placeholder="Brief description of your role..."
                                        />
                                    </div>
                                </div>
                            </Card>

                            <div className="space-y-6">
                                <Card title="Professional Details">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-textMuted uppercase mb-1.5">Job Title</label>
                                            <div className="relative">
                                                <Briefcase size={16} className="absolute left-3 top-2.5 text-textMuted" />
                                                <input 
                                                    type="text" 
                                                    value={formData.jobTitle || ''}
                                                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                                                    className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-textMain focus:ring-1 focus:ring-primary outline-none" 
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-textMuted uppercase mb-1.5">Department</label>
                                            <div className="relative">
                                                <Building size={16} className="absolute left-3 top-2.5 text-textMuted" />
                                                <input 
                                                    type="text" 
                                                    value={formData.department || ''}
                                                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                                                    className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-textMain focus:ring-1 focus:ring-primary outline-none" 
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-textMuted uppercase mb-1.5">Location</label>
                                            <div className="relative">
                                                <MapPin size={16} className="absolute left-3 top-2.5 text-textMuted" />
                                                <input 
                                                    type="text" 
                                                    value={formData.location || ''}
                                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                                    className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-textMain focus:ring-1 focus:ring-primary outline-none" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card title="Social Presence">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-[#0A66C2]/10 text-[#0A66C2] rounded-lg border border-[#0A66C2]/20"><Linkedin size={18} /></div>
                                            <input 
                                                type="text" 
                                                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#0A66C2]"
                                                placeholder="LinkedIn Profile URL"
                                                value={formData.socialLinks?.linkedin || ''}
                                                onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, linkedin: e.target.value}})}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-lg border border-[#1DA1F2]/20"><Twitter size={18} /></div>
                                            <input 
                                                type="text" 
                                                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1DA1F2]"
                                                placeholder="Twitter Handle"
                                                value={formData.socialLinks?.twitter || ''}
                                                onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, twitter: e.target.value}})}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg border border-purple-500/20"><Globe size={18} /></div>
                                            <input 
                                                type="text" 
                                                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-purple-500"
                                                placeholder="Personal Website"
                                                value={formData.socialLinks?.website || ''}
                                                onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, website: e.target.value}})}
                                            />
                                        </div>
                                    </div>
                                </Card>

                                <Card className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-primary/20">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-sm text-textMain">Profile Strength</h4>
                                        <span className="text-primary font-bold">85%</span>
                                    </div>
                                    <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden mb-3">
                                        <div className="h-full bg-gradient-to-r from-primary to-accent w-[85%]"></div>
                                    </div>
                                    <p className="text-xs text-textMuted">Complete your profile to unlock verified badge status.</p>
                                </Card>
                            </div>
                        </div>

                        <Card title="Regional Preferences">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-textMuted uppercase mb-2">Language</label>
                                    <div className="relative">
                                        <Globe size={16} className="absolute left-3 top-3 text-textMuted" />
                                        <select 
                                            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-textMain outline-none focus:ring-2 focus:ring-primary appearance-none"
                                            value={formData.language}
                                            onChange={e => setFormData({...formData, language: e.target.value})}
                                        >
                                            <option>English (US)</option>
                                            <option>English (UK)</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                            <option>German</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-textMuted uppercase mb-2">Timezone</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-3 top-3 text-textMuted" />
                                        <select 
                                            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-textMain outline-none focus:ring-2 focus:ring-primary appearance-none"
                                            value={formData.timezone}
                                            onChange={e => setFormData({...formData, timezone: e.target.value})}
                                        >
                                            <option>Pacific Time (PT)</option>
                                            <option>Eastern Time (ET)</option>
                                            <option>Greenwich Mean Time (GMT)</option>
                                            <option>Central European Time (CET)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 flex justify-between items-center border-t border-border mt-6">
                                {saveSuccess && (
                                    <span className="text-emerald-500 text-sm flex items-center animate-in fade-in">
                                        <CheckCircle size={16} className="mr-2" /> Changes saved successfully
                                    </span>
                                )}
                                <Button onClick={handleSaveProfile} className="ml-auto">Save Changes</Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* --- APPEARANCE TAB --- */}
                {activeTab === 'appearance' && (
                    <div className="space-y-6">
                        <Card title="Theme & Display">
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <button className="p-4 rounded-xl border-2 border-primary bg-zinc-800 relative flex flex-col items-center gap-3 transition-all">
                                    <div className="absolute top-2 right-2 text-primary"><CheckCircle size={16} /></div>
                                    <Moon size={24} />
                                    <span className="font-medium text-sm">Dark Mode</span>
                                </button>
                                <button className="p-4 rounded-xl border border-border bg-background opacity-50 cursor-not-allowed flex flex-col items-center gap-3">
                                    <Sun size={24} />
                                    <span className="font-medium text-sm">Light Mode</span>
                                    <Badge variant="neutral" className="absolute top-2 right-2 text-[10px]">Soon</Badge>
                                </button>
                                <button className="p-4 rounded-xl border border-border bg-background hover:border-primary/50 flex flex-col items-center gap-3 transition-all">
                                    <Monitor size={24} />
                                    <span className="font-medium text-sm">System</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border">
                                    <div>
                                        <h4 className="font-semibold text-sm">Compact Mode</h4>
                                        <p className="text-xs text-textMuted">Reduce padding and font sizes for high density.</p>
                                    </div>
                                    <Switch 
                                        checked={formData.preferences?.compactMode || false} 
                                        onCheckedChange={(c) => setFormData({...formData, preferences: {...formData.preferences!, compactMode: c}})} 
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border">
                                    <div>
                                        <h4 className="font-semibold text-sm">Reduce Motion</h4>
                                        <p className="text-xs text-textMuted">Minimize animations and transitions.</p>
                                    </div>
                                    <Switch 
                                        checked={formData.preferences?.reduceMotion || false} 
                                        onCheckedChange={(c) => setFormData({...formData, preferences: {...formData.preferences!, reduceMotion: c}})} 
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={handleSaveProfile}>Save Preferences</Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* --- SECURITY TAB --- */}
                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <Card title="Password & Authentication">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-textMuted uppercase mb-2">Current Password</label>
                                        <input 
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)} 
                                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-textMain focus:ring-2 focus:ring-primary outline-none" 
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-textMuted uppercase mb-2">New Password</label>
                                        <input 
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)} 
                                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-textMain focus:ring-2 focus:ring-primary outline-none" 
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 bg-background/50 border border-border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary/20 text-primary rounded-lg">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-textMain">Two-Factor Authentication</h4>
                                            <p className="text-sm text-textMuted">Secure your account with 2FA.</p>
                                        </div>
                                    </div>
                                    <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                                </div>
                                <div className="flex justify-end">
                                    <Button disabled={!currentPassword && !newPassword}>Update Security</Button>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Active Sessions">
                                <div className="space-y-1">
                                    {sessions.map((session, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 hover:bg-zinc-800/30 rounded-lg group transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center text-textMuted">
                                                    <session.icon size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-textMain">{session.device}</p>
                                                    <p className="text-xs text-textMuted">{session.location} • {session.active}</p>
                                                </div>
                                            </div>
                                            {idx === 0 ? (
                                                <Badge variant="success">Current</Badge>
                                            ) : (
                                                <button className="text-textMuted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Revoke Access">
                                                    <LogOut size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card title="Login Activity">
                                <div className="space-y-4">
                                    {loginHistory.map((log, idx) => (
                                        <div key={idx} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                                            <div>
                                                <p className="text-sm font-medium text-textMain flex items-center gap-2">
                                                    {log.event}
                                                    {log.status === 'danger' && <Badge variant="danger" className="text-[10px] py-0 px-1.5">Alert</Badge>}
                                                </p>
                                                <p className="text-xs text-textMuted">{log.date} • {log.ip}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-textMuted">{log.location}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* --- TEAM TAB --- */}
                {activeTab === 'team' && (
                    <Card 
                        title="Team Management" 
                        description="Control access and roles for your workspace."
                        action={<Button size="sm" onClick={() => setIsInviting(true)}><Plus size={16} className="mr-2" /> Invite Member</Button>}
                    >
                         {isInviting && (
                            <div className="mb-6 p-4 border border-primary/20 bg-primary/5 rounded-lg flex flex-col md:flex-row items-end md:items-center gap-4 animate-in slide-in-from-top-2">
                                <div className="flex-1 w-full">
                                    <label className="text-xs font-bold text-primary uppercase mb-1 block">Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="colleague@sarindustries.com" 
                                        className="w-full bg-background border border-border rounded px-3 py-2 outline-none focus:border-primary"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleInvite} disabled={!inviteEmail}>Send Invite</Button>
                                    <Button variant="ghost" onClick={() => setIsInviting(false)}>Cancel</Button>
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <input 
                                type="text" 
                                placeholder="Search team members..." 
                                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                                value={teamSearch}
                                onChange={(e) => setTeamSearch(e.target.value)}
                            />
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-border">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-textMuted uppercase bg-background/50 border-b border-border">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">User</th>
                                        <th className="px-4 py-3 font-medium">Role</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Last Active</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredTeam.map(member => (
                                        <tr key={member.id} className="group hover:bg-zinc-800/30">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white font-bold text-xs uppercase border border-border">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-textMain">{member.name}</div>
                                                        <div className="text-xs text-textMuted">{member.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <select 
                                                    defaultValue={member.role}
                                                    className="bg-transparent text-textMain border border-transparent hover:border-border rounded px-2 py-1 outline-none focus:border-primary cursor-pointer text-xs"
                                                >
                                                    <option>Admin</option>
                                                    <option>Editor</option>
                                                    <option>Analyst</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>
                                                    {member.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-textMuted text-xs">{member.lastActive}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button className="text-textMuted hover:text-red-400 transition-colors p-1 rounded hover:bg-zinc-800">
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredTeam.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-6 text-textMuted">No team members found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* --- INTEGRATIONS TAB --- */}
                {activeTab === 'integrations' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {integrations.map((app, i) => (
                                <Card key={i} className="hover:border-primary/50 transition-colors group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-textMain border border-border group-hover:bg-zinc-700 transition-colors">
                                                <app.icon size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-textMain">{app.name}</h4>
                                                <p className="text-xs text-textMuted mt-1">{app.desc}</p>
                                            </div>
                                        </div>
                                        {app.status === 'Connected' ? (
                                            <Badge variant="success">Connected</Badge>
                                        ) : (
                                            <Button size="sm" variant="secondary">Connect</Button>
                                        )}
                                    </div>
                                    {app.status === 'Connected' && (
                                        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                                            <span className="text-[10px] text-textMuted flex items-center gap-1"><RefreshCw size={10} /> Last sync: 2m ago</span>
                                            <button className="text-xs text-textMuted hover:text-textMain">Configure</button>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>

                        <Card title="API Access">
                            <div className="p-4 border border-border rounded-lg bg-background/50 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-textMuted uppercase mb-1">Production Key</p>
                                    <p className="font-mono text-sm text-textMain">pk_live_****************4x82</p>
                                    <p className="text-[10px] text-textMuted mt-1">Created on Oct 12, 2024</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="secondary">Roll Key</Button>
                                    <Button size="sm" variant="danger">Revoke</Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* --- BILLING TAB --- */}
                {activeTab === 'billing' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-primary/20 relative overflow-hidden flex flex-col justify-between h-full">
                                <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <div>
                                    <div className="flex justify-between items-start mb-6 relative">
                                        <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                                            <CreditCard size={24} className="text-white" />
                                        </div>
                                        <Badge variant="success">Active</Badge>
                                    </div>
                                    <p className="text-textMuted text-sm mb-1">Visa ending in 4242</p>
                                    <p className="text-2xl font-mono text-textMain relative">•••• •••• •••• 4242</p>
                                </div>
                                <div className="flex justify-between items-center mt-6 relative pt-6 border-t border-white/5">
                                    <span className="text-xs text-textMuted">Expires 12/25</span>
                                    <button className="text-sm text-primary hover:underline">Edit Method</button>
                                </div>
                            </Card>

                            <Card title="Current Plan">
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-3xl font-bold text-textMain">$299</span>
                                    <span className="text-textMuted">/month</span>
                                </div>
                                <h3 className="font-semibold text-white mb-1">Enterprise Scale</h3>
                                <p className="text-sm text-textMuted mb-4">Next billing date: <span className="text-textMain font-medium">Nov 01, 2024</span></p>
                                
                                {/* Usage Bars */}
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="text-textMuted">Ad Spend Managed</span>
                                            <span className="font-medium text-textMain">$142k / $500k</span>
                                        </div>
                                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{width: '28%'}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="text-textMuted">Team Seats</span>
                                            <span className="font-medium text-textMain">{teamMembers.length} / 10</span>
                                        </div>
                                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500" style={{width: `${(teamMembers.length / 10) * 100}%`}}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="secondary" className="flex-1">View Details</Button>
                                    <Button className="flex-1">Upgrade Plan</Button>
                                </div>
                            </Card>
                        </div>
                        
                        <Card title="Payment Methods">
                             <div className="space-y-3">
                                 <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/50">
                                     <div className="flex items-center gap-3">
                                         <div className="w-10 h-6 bg-zinc-200 rounded text-[10px] text-zinc-900 flex items-center justify-center font-bold">VISA</div>
                                         <div className="text-sm text-textMain">Visa ending in 4242</div>
                                         <Badge variant="neutral" className="text-[10px]">Default</Badge>
                                     </div>
                                     <button className="text-textMuted hover:text-textMain"><Trash2 size={16} /></button>
                                 </div>
                                 <button className="w-full py-3 border border-dashed border-border rounded-lg text-textMuted text-sm hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center gap-2">
                                     <Plus size={16} /> Add Payment Method
                                 </button>
                             </div>
                        </Card>

                        <Card title="Invoice History">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-textMuted uppercase bg-background/50 border-b border-border">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Invoice ID</th>
                                            <th className="px-4 py-3 font-medium">Date</th>
                                            <th className="px-4 py-3 font-medium">Amount</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                            <th className="px-4 py-3 text-right">Download</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {MOCK_INVOICES.map(inv => (
                                            <tr key={inv.id} className="hover:bg-zinc-800/30">
                                                <td className="px-4 py-3 font-mono text-textMuted">{inv.id}</td>
                                                <td className="px-4 py-3 text-textMain">{inv.date}</td>
                                                <td className="px-4 py-3 font-semibold text-textMain">${inv.amount.toLocaleString()}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="success">{inv.status}</Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button className="text-textMuted hover:text-primary transition-colors">
                                                        <Download size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {/* --- NOTIFICATIONS TAB --- */}
                {activeTab === 'notifications' && (
                    <Card title="Notification Preferences">
                         <div className="space-y-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-textMuted uppercase border-b border-border">
                                        <tr>
                                            <th className="py-3 w-1/2">Category</th>
                                            <th className="py-3 text-center">In-App</th>
                                            <th className="py-3 text-center">Email</th>
                                            <th className="py-3 text-center">Mobile Push</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {[
                                            { title: 'Campaign Updates', desc: 'Approvals, rejections, and status changes.' },
                                            { title: 'Budget Alerts', desc: 'Spending limits and forecasting warnings.' },
                                            { title: 'Performance Digests', desc: 'Weekly summaries and AI insights.' },
                                            { title: 'Security', desc: 'New device logins and password changes.' },
                                            { title: 'System Updates', desc: 'New features and maintenance notices.' }
                                        ].map((item, i) => (
                                            <tr key={i}>
                                                <td className="py-4 pr-4">
                                                    <p className="font-medium text-textMain">{item.title}</p>
                                                    <p className="text-xs text-textMuted">{item.desc}</p>
                                                </td>
                                                <td className="text-center py-4">
                                                    <div className="flex justify-center"><Switch checked={true} onCheckedChange={()=>{}} /></div>
                                                </td>
                                                <td className="text-center py-4">
                                                    <div className="flex justify-center"><Switch checked={i !== 4} onCheckedChange={()=>{}} /></div>
                                                </td>
                                                <td className="text-center py-4">
                                                    <div className="flex justify-center"><Switch checked={i < 2} onCheckedChange={()=>{}} /></div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                         </div>
                    </Card>
                )}

                {/* --- AUDIT LOGS TAB --- */}
                {activeTab === 'audit' && (
                     <div className="space-y-6">
                         <Card title="System Audit Logs" description="Track all activity within your workspace for compliance and security.">
                             <div className="mb-4 flex items-center gap-4">
                                 <div className="relative flex-1">
                                    <Filter size={16} className="absolute left-3 top-2.5 text-textMuted" />
                                    <input 
                                        type="text" 
                                        placeholder="Filter by user or action..." 
                                        className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
                                        value={auditFilter}
                                        onChange={e => setAuditFilter(e.target.value)}
                                    />
                                 </div>
                                 <Button variant="secondary">
                                     <Download size={16} className="mr-2" /> Export CSV
                                 </Button>
                             </div>
                             
                             <div className="overflow-x-auto rounded-lg border border-border">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-textMuted uppercase bg-background/50 border-b border-border">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Timestamp</th>
                                            <th className="px-4 py-3 font-medium">User</th>
                                            <th className="px-4 py-3 font-medium">Action</th>
                                            <th className="px-4 py-3 font-medium">Target</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredAuditLogs.length > 0 ? filteredAuditLogs.map(log => (
                                            <tr key={log.id} className="hover:bg-zinc-800/30">
                                                <td className="px-4 py-3 text-textMuted text-xs font-mono">{log.time}</td>
                                                <td className="px-4 py-3 font-medium text-textMain">{log.user}</td>
                                                <td className="px-4 py-3">{log.action}</td>
                                                <td className="px-4 py-3 text-textMuted">{log.target}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={
                                                        log.type === 'success' ? 'success' : 
                                                        log.type === 'warning' ? 'warning' : 'info'
                                                    }>{log.type}</Badge>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-textMuted">No logs found matching your filter.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                             </div>
                         </Card>
                     </div>
                )}

                {/* --- PRIVACY TAB --- */}
                {activeTab === 'privacy' && (
                    <div className="space-y-6">
                        <Card title="Data Export">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-textMain mb-1">Download your personal data</p>
                                    <p className="text-xs text-textMuted">Get a copy of your data including campaign history, logs, and profile info.</p>
                                </div>
                                <Button variant="secondary">
                                    <FileDown size={16} className="mr-2" /> Export Data
                                </Button>
                            </div>
                        </Card>

                        <div className="border border-red-900/50 bg-red-900/10 rounded-xl overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
                                <p className="text-sm text-red-200/70 mb-6">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-red-900/30">
                                        <span className="text-sm font-medium text-red-200">Deactivate Account</span>
                                        <Button variant="danger" size="sm">Deactivate</Button>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <span className="text-sm font-medium text-red-200">Delete Account</span>
                                        <Button variant="danger" size="sm">Delete Account</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};