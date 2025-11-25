import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { Command, Bell, Search, UserCircle, Menu, X, ChevronRight, ArrowRight, Zap, Plus, ChevronLeft, PanelLeftClose, PanelLeftOpen, Home, LogOut, Settings, Hexagon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { AIAssistant } from './AIAssistant';
import { ToastContainer } from './ui/Toast';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  
  const { userProfile, notifications, markAllNotificationsRead } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    }
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const filteredCommands = NAV_ITEMS.filter(item => 
    item.name.toLowerCase().includes(commandQuery.toLowerCase())
  );

  const handleCommandSelect = (path: string) => {
      navigate(path);
      setCommandOpen(false);
      setCommandQuery('');
  };

  // Generate Breadcrumbs
  const currentPath = NAV_ITEMS.find(item => item.path === location.pathname);
  const breadcrumbName = currentPath ? currentPath.name : 'Unknown';

  // Navigation Groups
  const navGroups = [
    { title: 'Overview', items: ['Command Center', 'Analytics Pro'] },
    { title: 'Operations', items: ['Unified Inbox', 'Leads CRM', 'Business Assets', 'Smart Calendar'] },
    { title: 'Creative & Ads', items: ['Campaigns', 'Ad Studio', 'Asset Library', 'Audience Network'] },
    { title: 'Intelligence', items: ['Brand Hub', 'Competitor Intel', 'Smart Automation'] },
    { title: 'Configuration', items: ['Settings'] }
  ];

  const getNavItem = (name: string) => NAV_ITEMS.find(item => item.name === name);

  return (
    <div className="min-h-screen bg-background flex text-textMain font-sans selection:bg-primary/30">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* AI Assistant Widget */}
      <AIAssistant />

      {/* Command Palette Modal */}
      {commandOpen && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh] p-4" onClick={() => setCommandOpen(false)}>
              <div 
                className="w-full max-w-xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-100 flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                  <div className="flex items-center px-4 py-3 border-b border-border">
                      <Search size={20} className="text-textMuted mr-3" />
                      <input 
                        className="flex-1 bg-transparent outline-none text-lg placeholder:text-textMuted"
                        placeholder="Type a command or search..."
                        autoFocus
                        value={commandQuery}
                        onChange={e => setCommandQuery(e.target.value)}
                      />
                      <kbd className="hidden md:inline-block px-2 py-0.5 text-xs font-mono text-textMuted bg-zinc-800 rounded border border-zinc-700">ESC</kbd>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar">
                      <div className="text-xs font-bold text-textMuted px-2 py-1.5 uppercase tracking-wider">Navigation</div>
                      {filteredCommands.map((item) => (
                          <button
                            key={item.path}
                            onClick={() => handleCommandSelect(item.path)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-left group"
                          >
                              <item.icon size={18} className="text-textMuted group-hover:text-primary" />
                              <span className="flex-1">{item.name}</span>
                              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                      ))}
                      
                      <div className="text-xs font-bold text-textMuted px-2 py-1.5 uppercase tracking-wider mt-2">Quick Actions</div>
                      <button onClick={() => handleCommandSelect('/ads')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-left group">
                          <Zap size={18} className="text-textMuted group-hover:text-primary" />
                          <span className="flex-1">Create New Ad</span>
                      </button>
                      <button onClick={() => handleCommandSelect('/campaigns')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-left group">
                          <Plus size={18} className="text-textMuted group-hover:text-primary" />
                          <span className="flex-1">New Campaign</span>
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-surface/95 backdrop-blur-xl border-r border-border transform transition-all duration-300 ease-in-out md:static md:h-screen flex flex-col
        ${mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
        ${sidebarCollapsed ? 'md:w-[4.5rem]' : 'md:w-72'}
      `}>
        {/* Header / Logo */}
        <div className={`h-16 flex items-center border-b border-border/50 bg-background/50 ${sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
          <div className="flex items-center gap-2 text-primary group cursor-pointer overflow-hidden">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors shrink-0 border border-primary/20">
              <Hexagon size={20} className="text-primary fill-primary/20" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col animate-in fade-in duration-200">
                <span className="text-lg font-bold tracking-tight text-white leading-none">SAR IND</span>
                <span className="text-[9px] font-semibold text-textMuted tracking-widest uppercase mt-0.5">Sar Industries</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-textMuted hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {navGroups.map((group, groupIdx) => (
             <div key={groupIdx}>
                {!sidebarCollapsed && group.items.length > 0 && (
                  <h4 className="px-3 mb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest animate-in fade-in duration-300">
                    {group.title}
                  </h4>
                )}
                <div className="space-y-0.5">
                  {group.items.map(itemName => {
                     const item = getNavItem(itemName);
                     if (!item) return null;
                     return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                              isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
                            }`
                          }
                          title={sidebarCollapsed ? item.name : ''}
                        >
                          {({ isActive }) => (
                            <>
                              <div className="flex items-center gap-3">
                                <item.icon size={20} className={`shrink-0 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-zinc-100'}`} strokeWidth={isActive ? 2.5 : 2} />
                                {!sidebarCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                              </div>
                              {/* Active Indicator */}
                              {isActive && (
                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full ${sidebarCollapsed ? 'left-[-8px]' : 'left-[-12px]'} shadow-[0_0_8px_rgba(59,130,246,0.6)]`} />
                              )}
                            </>
                          )}
                        </NavLink>
                     )
                  })}
                </div>
                {!sidebarCollapsed && groupIdx < navGroups.length - 1 && (
                   <div className="mx-3 mt-4 border-b border-border/40"></div>
                )}
             </div>
          ))}
          
          {/* System Status Box */}
          {!sidebarCollapsed && (
              <div className="mx-3 p-3 rounded-lg bg-zinc-900/50 border border-border mt-6 animate-in fade-in">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">System Status</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[10px] font-medium text-emerald-400">Stable</span>
                    </div>
                 </div>
                 <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[99%]"></div>
                 </div>
              </div>
          )}
        </nav>

        {/* Developer Attribution & Footer */}
        {!sidebarCollapsed && (
            <div className="px-6 py-2 text-center animate-in fade-in">
                <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest leading-relaxed">
                    Build & Developed By<br/>
                    <span className="text-zinc-500 hover:text-primary transition-colors cursor-default">SAIFUL ALAM RAFI</span>
                </p>
            </div>
        )}

        {/* User Footer */}
        <div className="p-3 border-t border-border/50 bg-background/30 flex flex-col gap-2">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex w-full items-center justify-center p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 px-2'} py-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-colors group`}>
            <div className="relative shrink-0">
                {userProfile.avatar ? (
                     <img src={userProfile.avatar} alt="User" className="w-9 h-9 rounded-full object-cover border border-border" />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center border border-border">
                        <UserCircle size={20} className="text-zinc-400" />
                    </div>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-surface rounded-full"></span>
            </div>
            {!sidebarCollapsed && (
                <div className="flex-1 min-w-0 animate-in fade-in">
                    <p className="text-sm font-semibold text-textMain truncate">{userProfile.firstName} {userProfile.lastName}</p>
                    <p className="text-xs text-textMuted truncate">Sar Admin</p>
                </div>
            )}
            {!sidebarCollapsed && <ChevronRight size={14} className="text-zinc-500 group-hover:text-zinc-300" />}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between shadow-sm relative">
          <div className="flex items-center gap-4">
             {/* Mobile Menu Trigger */}
             <button 
              onClick={() => setMobileMenuOpen(true)}
              className="text-textMuted hover:text-white md:hidden"
            >
              <Menu size={24} />
            </button>
            
            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center text-sm text-textMuted">
                <Home size={16} className="mr-2 hover:text-textMain transition-colors cursor-pointer" onClick={() => navigate('/')} />
                <ChevronRight size={14} className="mx-1 opacity-50" />
                <span className="font-medium text-textMain tracking-tight">{breadcrumbName}</span>
            </div>
            
            <span className="font-bold text-lg md:hidden">SAR IND</span>
          </div>

          <div className="hidden md:flex items-center w-full max-w-sm lg:max-w-md relative group mx-4">
            <Search size={16} className="absolute left-3 text-textMuted group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              readOnly
              onClick={() => setCommandOpen(true)}
              placeholder="Search Sar Industries assets..." 
              className="w-full bg-surface/50 border border-border/50 rounded-lg pl-10 pr-12 py-2 text-sm text-textMain focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-zinc-600 cursor-pointer shadow-sm hover:bg-surface"
            />
            <div className="absolute right-3 flex gap-1 pointer-events-none items-center top-1/2 -translate-y-1/2">
                <kbd className="text-[10px] font-bold font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 shadow-sm">⌘K</kbd>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-5">
            <div className="relative">
                <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className={`relative p-2 transition-colors hover:bg-surface/50 rounded-full ${notificationsOpen ? 'text-white bg-surface' : 'text-textMuted hover:text-textMain'}`}
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-background"></span>
                    )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)}></div>
                        <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-4 border-b border-border flex justify-between items-center bg-background/50">
                                <h4 className="font-semibold text-sm">Notifications</h4>
                                <button onClick={markAllNotificationsRead} className="text-xs text-primary hover:underline">Mark all read</button>
                            </div>
                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-textMuted text-sm">No new notifications</div>
                                ) : (
                                    notifications.map(notif => (
                                        <div key={notif.id} className={`p-4 border-b border-border/50 last:border-0 hover:bg-background/50 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <p className={`text-sm ${!notif.read ? 'font-semibold text-textMain' : 'text-textMuted'}`}>{notif.title}</p>
                                                <span className="text-[10px] text-textMuted">{notif.time}</span>
                                            </div>
                                            <p className="text-xs text-textMuted leading-relaxed">{notif.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="h-8 w-px bg-border/50 hidden md:block"></div>
            <div className="flex items-center gap-3 pl-1">
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-textMain">Sar Industries Global</p>
                    <div className="flex items-center justify-end gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <p className="text-[10px] text-textMuted">Enterprise</p>
                    </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 flex items-center justify-center text-white font-bold border border-white/10">
                    S
                </div>
            </div>
          </div>
        </header>

        {/* Page Content Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-8 bg-black/20">
          {children}
        </div>
      </main>
    </div>
  );
};