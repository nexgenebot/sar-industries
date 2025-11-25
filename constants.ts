
import { BusinessEntity, AdCampaign, Platform, ChartDataPoint, MetricData, Audience, ActivityLog, Notification, TeamMember, Invoice, Conversation, Asset, AutomationRule, Lead } from './types';
import { LayoutDashboard, Briefcase, Megaphone, Users, Settings, PieChart, Target, Calendar, Swords, Fingerprint, Inbox, Image, FolderOpen, Workflow, UserCheck } from 'lucide-react';

export const NAV_ITEMS = [
  { name: 'Command Center', icon: LayoutDashboard, path: '/' },
  { name: 'Unified Inbox', icon: Inbox, path: '/inbox' },
  { name: 'Leads CRM', icon: UserCheck, path: '/leads' },
  { name: 'Brand Hub', icon: Fingerprint, path: '/brand' },
  { name: 'Campaigns', icon: Target, path: '/campaigns' },
  { name: 'Smart Calendar', icon: Calendar, path: '/calendar' },
  { name: 'Asset Library', icon: FolderOpen, path: '/assets' },
  { name: 'Ad Studio', icon: Megaphone, path: '/ads' },
  { name: 'Smart Automation', icon: Workflow, path: '/automation' },
  { name: 'Business Assets', icon: Briefcase, path: '/businesses' },
  { name: 'Competitor Intel', icon: Swords, path: '/competitors' },
  { name: 'Audience Network', icon: Users, path: '/audiences' },
  { name: 'Analytics Pro', icon: PieChart, path: '/analytics' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export const MOCK_BUSINESSES: BusinessEntity[] = [
  { id: '1', name: 'Stellar Innovations', verified: true, adAccounts: 2, pages: 3, status: 'Active', pixelId: 'PIXEL-84920', domain: 'stellar.io', spendingLimit: 5000 },
  { id: '2', name: 'Nebula Retail Group', verified: true, adAccounts: 5, pages: 12, status: 'Active', pixelId: 'PIXEL-11204', domain: 'nebula.shop' },
  { id: '3', name: 'Quantum Coffee', verified: false, adAccounts: 1, pages: 1, status: 'Pending', domain: 'quantum.coffee' },
  { id: '4', name: 'Hyperion Tech', verified: true, adAccounts: 0, pages: 1, status: 'Restricted', pixelId: 'PIXEL-00000', spendingLimit: 0 },
];

// Helper to get relative dates
const getRelativeDate = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
};

export const MOCK_CAMPAIGNS: AdCampaign[] = [
  { id: 'c1', name: 'Summer Sale Retargeting', status: 'Active', spend: 1250, reach: 45000, roas: 3.2, platform: Platform.INSTAGRAM, ctr: 2.1, startDate: getRelativeDate(-5), endDate: getRelativeDate(10) },
  { id: 'c2', name: 'Brand Awareness Q3', status: 'Active', spend: 8500, reach: 210000, roas: 1.8, platform: Platform.FACEBOOK, ctr: 1.5, startDate: getRelativeDate(-15), endDate: getRelativeDate(15) },
  { id: 'c3', name: 'New Collection Launch', status: 'Review', spend: 0, reach: 0, roas: 0, platform: Platform.INSTAGRAM, ctr: 0, startDate: getRelativeDate(2), endDate: getRelativeDate(20) },
  { id: 'c4', name: 'Lead Gen Webinar', status: 'Paused', spend: 450, reach: 12000, roas: 2.1, platform: Platform.FACEBOOK, ctr: 3.4, startDate: getRelativeDate(-20), endDate: getRelativeDate(-2) },
  { id: 'c5', name: 'Holiday Special', status: 'Draft', spend: 0, reach: 0, roas: 0, platform: Platform.WHATSAPP, ctr: 0, startDate: getRelativeDate(10), endDate: getRelativeDate(30) },
];

export const MOCK_CHART_DATA: ChartDataPoint[] = [
  { name: 'Mon', value: 4000, value2: 2400, value3: 1200 },
  { name: 'Tue', value: 3000, value2: 1398, value3: 2100 },
  { name: 'Wed', value: 2000, value2: 9800, value3: 2290 },
  { name: 'Thu', value: 2780, value2: 3908, value3: 2000 },
  { name: 'Fri', value: 1890, value2: 4800, value3: 2181 },
  { name: 'Sat', value: 2390, value2: 3800, value3: 2500 },
  { name: 'Sun', value: 3490, value2: 4300, value3: 2100 },
];

export const DEMOGRAPHIC_AGE_DATA: ChartDataPoint[] = [
    { name: '18-24', value: 15 },
    { name: '25-34', value: 45 },
    { name: '35-44', value: 25 },
    { name: '45-54', value: 10 },
    { name: '55+', value: 5 },
];

export const DEMOGRAPHIC_GENDER_DATA: ChartDataPoint[] = [
    { name: 'Men', value: 42 },
    { name: 'Women', value: 55 },
    { name: 'Other', value: 3 },
];

export const KPIS: MetricData[] = [
  { name: 'Total Ad Spend', value: 14250, change: 12, trend: 'up' },
  { name: 'Total Impressions', value: 890000, change: 5.4, trend: 'up' },
  { name: 'Avg. CTR', value: 2.1, change: -0.4, trend: 'down' },
  { name: 'Conversion Rate', value: 3.8, change: 1.2, trend: 'up' },
];

export const MOCK_AUDIENCES: Audience[] = [
  { id: 'a1', name: 'Past Purchasers (30d)', size: 12500, type: 'Custom', platform: [Platform.FACEBOOK, Platform.INSTAGRAM], matchRate: 95, lastUpdated: '2h ago' },
  { id: 'a2', name: 'Top 5% LTV Lookalike', size: 2500000, type: 'Lookalike', platform: [Platform.FACEBOOK], matchRate: 100, lastUpdated: '1d ago' },
  { id: 'a3', name: 'Tech Enthusiasts CA', size: 450000, type: 'Saved', platform: [Platform.INSTAGRAM], lastUpdated: '5d ago' },
  { id: 'a4', name: 'Newsletter Subscribers', size: 8500, type: 'Custom', platform: [Platform.FACEBOOK, Platform.INSTAGRAM], matchRate: 88, lastUpdated: '12m ago' },
];

export const RECENT_ACTIVITY: ActivityLog[] = [
  { id: 'l1', user: 'Admin User', action: 'Created Campaign', target: 'Summer Sale', time: '10m ago', type: 'success' },
  { id: 'l2', user: 'System', action: 'Ad Rejected', target: 'Creative #422', time: '1h ago', type: 'warning' },
  { id: 'l3', user: 'Sarah M.', action: 'Updated Budget', target: 'Brand Awareness Q3', time: '2h ago', type: 'info' },
  { id: 'l4', user: 'Admin User', action: 'Connected Asset', target: 'Instagram Page', time: '4h ago', type: 'success' },
];

export const NOTIFICATIONS: Notification[] = [
    { id: 'n1', title: 'Ad Account Restricted', message: 'Hyperion Tech ad account has been flagged.', time: '20m ago', read: false, type: 'alert' },
    { id: 'n2', title: 'Campaign Approved', message: 'Summer Sale Retargeting is now active.', time: '1h ago', read: false, type: 'success' },
    { id: 'n3', title: 'New Feature Available', message: 'Try the new AI Audience builder.', time: '2d ago', read: true, type: 'info' }
];

export const MOCK_TEAM: TeamMember[] = [
    { id: 't1', name: 'Alex Rivera', email: 'alex.r@nexus.com', role: 'Admin', status: 'Active', lastActive: 'Now' },
    { id: 't2', name: 'Sarah Chen', email: 'sarah.c@nexus.com', role: 'Editor', status: 'Active', lastActive: '2h ago' },
    { id: 't3', name: 'Mike Johnson', email: 'mike.j@nexus.com', role: 'Analyst', status: 'Pending', lastActive: '-' },
];

export const MOCK_INVOICES: Invoice[] = [
    { id: 'INV-2024-001', date: 'Oct 01, 2024', amount: 4250.00, status: 'Paid', cardLast4: '4242' },
    { id: 'INV-2024-002', date: 'Sep 01, 2024', amount: 3800.50, status: 'Paid', cardLast4: '4242' },
    { id: 'INV-2024-003', date: 'Aug 01, 2024', amount: 4100.00, status: 'Paid', cardLast4: '4242' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'conv1',
        userName: 'Jessica Miller',
        platform: Platform.FACEBOOK,
        isUnread: true,
        lastMessageTime: '5m',
        email: 'jess.miller@example.com',
        location: 'Austin, TX',
        ltv: 450,
        tags: ['VIP', 'Repeat'],
        messages: [
            { id: 'm1', sender: 'user', content: 'Hi, I received my order but the size seems small.', timestamp: Date.now() - 300000 },
        ]
    },
    {
        id: 'conv2',
        userName: 'David Chen',
        platform: Platform.INSTAGRAM,
        isUnread: false,
        lastMessageTime: '1h',
        email: 'd.chen@design.co',
        location: 'Toronto, CA',
        ltv: 120,
        tags: ['New Customer'],
        messages: [
            { id: 'm1', sender: 'user', content: 'Do you ship to Canada?', timestamp: Date.now() - 3600000 },
            { id: 'm2', sender: 'admin', content: 'Yes we do! Shipping takes 3-5 business days.', timestamp: Date.now() - 3500000 },
            { id: 'm3', sender: 'user', content: 'Great, thanks!', timestamp: Date.now() - 3400000 },
        ]
    },
    {
        id: 'conv3',
        userName: 'Sophie Watts',
        platform: Platform.WHATSAPP,
        isUnread: true,
        lastMessageTime: '3h',
        email: 'sophie.w@gmail.com',
        location: 'London, UK',
        tags: ['Inquiry'],
        messages: [
            { id: 'm1', sender: 'user', content: 'Is the black model in stock?', timestamp: Date.now() - 10800000 },
        ]
    }
];

export const MOCK_ASSETS: Asset[] = [
    { id: 'ast1', name: 'Summer Campaign Hero', type: 'image', url: '', size: '2.4 MB', dimensions: '1080x1080', tags: ['Summer', 'Lifestyle', 'Outdoor'], createdAt: '2024-10-10' },
    { id: 'ast2', name: 'Product Demo Reel', type: 'video', url: '', size: '15.2 MB', dimensions: '1080x1920', tags: ['Product', 'Reel', 'Tutorial'], createdAt: '2024-10-12' },
    { id: 'ast3', name: 'Logo Transparent', type: 'image', url: '', size: '0.5 MB', dimensions: '500x500', tags: ['Branding', 'Logo'], createdAt: '2024-09-01' },
    { id: 'ast4', name: 'Office Interior', type: 'image', url: '', size: '3.1 MB', dimensions: '1920x1080', tags: ['Office', 'Team', 'Culture'], createdAt: '2024-09-15' },
    { id: 'ast5', name: 'Customer Testimonial', type: 'video', url: '', size: '24 MB', dimensions: '1080x1080', tags: ['Social Proof', 'Interview'], createdAt: '2024-10-05' },
];

export const MOCK_RULES: AutomationRule[] = [
    { id: 'r1', name: 'Pause Losers', status: 'Active', triggerMetric: 'ROAS', triggerOperator: '<', triggerValue: 1.5, timeframe: 'Last 3 Days', action: 'Pause Campaign', lastRun: '2h ago' },
    { id: 'r2', name: 'Scale Winners', status: 'Active', triggerMetric: 'ROAS', triggerOperator: '>', triggerValue: 3.0, timeframe: 'Last 7 Days', action: 'Increase Budget', actionValue: 20, lastRun: '1d ago' },
    { id: 'r3', name: 'CTR Watchdog', status: 'Paused', triggerMetric: 'CTR', triggerOperator: '<', triggerValue: 0.8, timeframe: 'Last 3 Days', action: 'Notify', lastRun: '-' }
];

export const MOCK_LEADS: Lead[] = [
    { id: 'ld1', name: 'Marcus Thorne', email: 'm.thorne@corp.com', phone: '+1 555 0102', source: 'Enterprise Webinar Form', platform: Platform.FACEBOOK, status: 'New', qualityScore: 88, createdAt: '10m ago' },
    { id: 'ld2', name: 'Elena Rodriguez', email: 'elena.r@gmail.com', phone: '+1 555 0199', source: 'Summer Sale Popup', platform: Platform.INSTAGRAM, status: 'Contacted', qualityScore: 65, createdAt: '2h ago' },
    { id: 'ld3', name: 'Tech Startups Inc', email: 'info@techstart.io', phone: '+1 555 0222', source: 'Lead Gen Campaign V2', platform: Platform.FACEBOOK, status: 'Qualified', qualityScore: 94, createdAt: '1d ago' },
    { id: 'ld4', name: 'John Smith', email: 'jsmith1990@yahoo.com', phone: '', source: 'Newsletter Signup', platform: Platform.INSTAGRAM, status: 'Lost', qualityScore: 32, createdAt: '3d ago' }
];