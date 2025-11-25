
export enum Platform {
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  WHATSAPP = 'WhatsApp'
}

export enum AdFormat {
  FEED = 'Feed',
  STORY = 'Story',
  REEL = 'Reel'
}

export interface Page {
    id: string;
    name: string;
    followers: number;
    category: string;
    platform: Platform;
}

export interface BusinessEntity {
  id: string;
  name: string;
  verified: boolean;
  adAccounts: number;
  pages: number; // Count for display
  pageEntities?: Page[]; // Actual data
  assignedMembers?: TeamMember[]; // Local assignments
  status: 'Active' | 'Pending' | 'Restricted';
  pixelId?: string;
  domain?: string;
  spendingLimit?: number;
}

export interface AdCampaign {
  id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Review' | 'Draft';
  spend: number;
  reach: number;
  roas: number; // Return on Ad Spend
  platform: Platform;
  ctr: number;
  startDate: string; // ISO YYYY-MM-DD
  endDate: string;   // ISO YYYY-MM-DD
}

export interface GeneratedContent {
  id?: string;
  headline: string;
  body: string;
  callToAction: string;
  socialProof?: string;
  imagePrompt?: string;
  imageUrl?: string; // Base64 or URL
  timestamp?: number;
  variationName?: string;
}

export interface SavedAd extends GeneratedContent {
    id: string;
    createdAt: string;
    platform: Platform;
    format: AdFormat;
    productName: string;
    status: 'Draft' | 'Review' | 'Approved' | 'Rejected';
    notes?: string;
}

export interface BrandProfile {
    name: string;
    tagline: string;
    description: string;
    voice: string; // e.g. "Witty", "Professional"
    keywords: string[];
    primaryColor: string;
    targetAudience: string;
}

export interface MetricData {
  name: string;
  value: number;
  change?: number; // percentage
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number; // Secondary metric
  value3?: number; // Tertiary metric
}

export interface Audience {
  id: string;
  name: string;
  size: number;
  type: 'Lookalike' | 'Custom' | 'Saved';
  platform: Platform[];
  matchRate?: number;
  lastUpdated: string;
  description?: string; // For AI generated ones
  interests?: string[];
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'info' | 'warning' | 'success';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
}

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Analyst';
  status: 'Active' | 'Pending';
  lastActive: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Processing' | 'Overdue';
  cardLast4: string;
}

export interface UserPreferences {
    theme: 'dark' | 'light' | 'system';
    compactMode: boolean;
    reduceMotion: boolean;
    highContrast: boolean;
}

export interface SocialLinks {
    linkedin?: string;
    twitter?: string;
    website?: string;
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    jobTitle?: string;
    department?: string;
    location?: string;
    bio?: string;
    phone?: string;
    language?: string;
    timezone?: string;
    avatar?: string;
    coverImage?: string;
    status?: 'Online' | 'Away' | 'Busy' | 'Offline';
    socialLinks?: SocialLinks;
    preferences?: UserPreferences;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface CompetitorInsight {
    name: string;
    marketShare: number;
    strength: string;
    weakness: string;
    adStrategy: string;
}

// Inbox Types
export interface Message {
    id: string;
    sender: 'user' | 'admin';
    content: string;
    timestamp: number;
}

export interface Conversation {
    id: string;
    userName: string;
    userAvatar?: string;
    platform: Platform;
    isUnread: boolean;
    lastMessageTime: string;
    messages: Message[];
    tags: string[];
    email?: string;
    location?: string;
    ltv?: number; // Lifetime Value
}

// Asset Library Types
export interface Asset {
    id: string;
    name: string;
    type: 'image' | 'video';
    url: string;
    size: string;
    dimensions?: string;
    tags: string[];
    createdAt: string;
}

// Automation Types
export interface AutomationRule {
    id: string;
    name: string;
    status: 'Active' | 'Paused';
    triggerMetric: 'ROAS' | 'Spend' | 'CTR' | 'CPM';
    triggerOperator: '>' | '<' | '>=';
    triggerValue: number;
    timeframe: string; // e.g., "Last 3 Days"
    action: 'Pause Campaign' | 'Increase Budget' | 'Decrease Budget' | 'Notify';
    actionValue?: number; // percentage or amount
    lastRun?: string;
}

// CRM Types
export interface Lead {
    id: string;
    name: string;
    email: string;
    phone?: string;
    source: string; // e.g., "Summer Sale Lead Form"
    platform: Platform;
    status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
    qualityScore: number; // 0-100
    createdAt: string;
    notes?: string;
}