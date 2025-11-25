import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BusinessEntity, TeamMember, Audience, UserProfile, Platform, Notification, AdCampaign, SavedAd, BrandProfile, Asset, AutomationRule, Lead, Toast } from '../types';
import { MOCK_BUSINESSES, MOCK_TEAM, MOCK_AUDIENCES, NOTIFICATIONS, MOCK_CAMPAIGNS, MOCK_ASSETS, MOCK_RULES, MOCK_LEADS } from '../constants';

interface DataContextType {
  businesses: BusinessEntity[];
  addBusiness: (business: BusinessEntity) => void;
  teamMembers: TeamMember[];
  addTeamMember: (member: TeamMember) => void;
  audiences: Audience[];
  addAudience: (audience: Audience) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markAllNotificationsRead: () => void;
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  campaigns: AdCampaign[];
  addCampaign: (campaign: AdCampaign) => void;
  updateCampaign: (id: string, updates: Partial<AdCampaign>) => void;
  deleteCampaign: (id: string) => void;
  savedAds: SavedAd[];
  saveAd: (ad: SavedAd) => void;
  deleteAd: (id: string) => void;
  updateAdStatus: (id: string, status: SavedAd['status']) => void;
  brandProfile: BrandProfile;
  updateBrandProfile: (profile: Partial<BrandProfile>) => void;
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  deleteAsset: (id: string) => void;
  rules: AutomationRule[];
  addRule: (rule: AutomationRule) => void;
  deleteRule: (id: string) => void;
  updateRule: (id: string, updates: Partial<AutomationRule>) => void;
  leads: Lead[];
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  addLead: (lead: Lead) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [businesses, setBusinesses] = useState<BusinessEntity[]>(MOCK_BUSINESSES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(MOCK_TEAM);
  const [audiences, setAudiences] = useState<Audience[]>(MOCK_AUDIENCES);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(MOCK_CAMPAIGNS);
  const [savedAds, setSavedAds] = useState<SavedAd[]>([]);
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [rules, setRules] = useState<AutomationRule[]>(MOCK_RULES);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: 'Saiful',
    lastName: 'Alam Rafi',
    email: 'admin@sarindustries.com',
    role: 'Enterprise Admin',
    jobTitle: 'Chief Operations Officer',
    department: 'Sar Industries Global',
    location: 'New York, USA',
    bio: 'Lead developer and strategist at Sar Industries.',
    language: 'English (US)',
    timezone: 'America/New_York',
    phone: '+1 (555) 123-4567',
    status: 'Online',
    socialLinks: {
        linkedin: 'linkedin.com/in/saifulalamrafi',
        twitter: '@sar_ind',
        website: 'sarindustries.com'
    },
    preferences: {
        theme: 'dark',
        compactMode: false,
        reduceMotion: false,
        highContrast: false
    }
  });
  
  const [brandProfile, setBrandProfile] = useState<BrandProfile>({
      name: 'Sar Industries',
      tagline: 'Innovating the Future',
      description: 'A global technology conglomerate pioneering solutions in AI, infrastructure, and digital ecosystems.',
      voice: 'Authoritative, Visionary, and Sophisticated',
      keywords: ['Innovation', 'Leadership', 'Future', 'Industrial'],
      primaryColor: '#3b82f6',
      targetAudience: 'Global Enterprises and Government Sectors'
  });

  const showToast = (toast: Omit<Toast, 'id'>) => {
      const id = Date.now().toString() + Math.random();
      setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
      setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addBusiness = (business: BusinessEntity) => {
    setBusinesses(prev => [...prev, business]);
    showToast({ title: 'Business Connected', message: `${business.name} has been imported successfully.`, type: 'success' });
    addNotification({
        id: Date.now().toString(),
        title: 'Portfolio Connected',
        message: `${business.name} has been successfully added.`,
        time: 'Just now',
        read: false,
        type: 'success'
    });
  };

  const addTeamMember = (member: TeamMember) => {
    setTeamMembers(prev => [...prev, member]);
    showToast({ title: 'Invite Sent', message: `Invitation sent to ${member.email}.`, type: 'success' });
  };

  const addAudience = (audience: Audience) => {
    setAudiences(prev => [audience, ...prev]);
    showToast({ title: 'Audience Created', message: `${audience.name} is ready for targeting.`, type: 'success' });
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
    showToast({ title: 'Profile Updated', type: 'success' });
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addCampaign = (campaign: AdCampaign) => {
    setCampaigns(prev => [campaign, ...prev]);
    showToast({ title: 'Campaign Draft Created', message: `${campaign.name} has been created.`, type: 'success' });
  };

  const updateCampaign = (id: string, updates: Partial<AdCampaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCampaign = (id: string) => {
      setCampaigns(prev => prev.filter(c => c.id !== id));
      showToast({ title: 'Campaign Deleted', type: 'info' });
  };

  const saveAd = (ad: SavedAd) => {
      setSavedAds(prev => [ad, ...prev]);
      showToast({ title: 'Creative Saved', message: 'Asset saved to library successfully.', type: 'success' });
  };

  const deleteAd = (id: string) => {
      setSavedAds(prev => prev.filter(a => a.id !== id));
      showToast({ title: 'Ad Deleted', type: 'info' });
  };

  const updateAdStatus = (id: string, status: SavedAd['status']) => {
      setSavedAds(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const updateBrandProfile = (profile: Partial<BrandProfile>) => {
      setBrandProfile(prev => ({ ...prev, ...profile }));
      showToast({ title: 'Brand Identity Saved', type: 'success' });
  };

  const addAsset = (asset: Asset) => {
      setAssets(prev => [asset, ...prev]);
      showToast({ title: 'Upload Complete', message: `${asset.name} added to assets.`, type: 'success' });
  };

  const deleteAsset = (id: string) => {
      setAssets(prev => prev.filter(a => a.id !== id));
      showToast({ title: 'Asset Removed', type: 'info' });
  };

  const addRule = (rule: AutomationRule) => {
      setRules(prev => [rule, ...prev]);
      showToast({ title: 'Rule Active', message: `Automation "${rule.name}" is now running.`, type: 'success' });
  };

  const deleteRule = (id: string) => {
      setRules(prev => prev.filter(r => r.id !== id));
      showToast({ title: 'Rule Deleted', type: 'info' });
  };

  const updateRule = (id: string, updates: Partial<AutomationRule>) => {
      setRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
      if(updates.status) showToast({ title: `Rule ${updates.status}`, type: updates.status === 'Active' ? 'success' : 'warning' });
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      showToast({ title: 'Lead Status Updated', message: `Moved to ${status}`, type: 'info' });
  };

  const addLead = (lead: Lead) => {
      setLeads(prev => [lead, ...prev]);
  };

  return (
    <DataContext.Provider value={{
      businesses,
      addBusiness,
      teamMembers,
      addTeamMember,
      audiences,
      addAudience,
      userProfile,
      updateUserProfile,
      notifications,
      addNotification,
      markAllNotificationsRead,
      toasts,
      showToast,
      removeToast,
      campaigns,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      savedAds,
      saveAd,
      deleteAd,
      updateAdStatus,
      brandProfile,
      updateBrandProfile,
      assets,
      addAsset,
      deleteAsset,
      rules,
      addRule,
      deleteRule,
      updateRule,
      leads,
      updateLeadStatus,
      addLead
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};