
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AdCreator } from './components/AdCreator';
import { BusinessManager } from './components/BusinessManager';
import { Audiences } from './components/Audiences';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { CampaignManager } from './components/CampaignManager';
import { SmartCalendar } from './components/SmartCalendar';
import { CompetitorIntel } from './components/CompetitorIntel';
import { BrandHub } from './components/BrandHub';
import { UnifiedInbox } from './components/UnifiedInbox';
import { AssetLibrary } from './components/AssetLibrary';
import { AutomationRules } from './components/AutomationRules';
import { LeadCRM } from './components/LeadCRM';
import { DataProvider } from './context/DataContext';

const App: React.FC = () => {
  return (
    <DataProvider>
        <Router>
        <Layout>
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inbox" element={<UnifiedInbox />} />
            <Route path="/leads" element={<LeadCRM />} />
            <Route path="/assets" element={<AssetLibrary />} />
            <Route path="/brand" element={<BrandHub />} />
            <Route path="/campaigns" element={<CampaignManager />} />
            <Route path="/calendar" element={<SmartCalendar />} />
            <Route path="/ads" element={<AdCreator />} />
            <Route path="/automation" element={<AutomationRules />} />
            <Route path="/businesses" element={<BusinessManager />} />
            <Route path="/competitors" element={<CompetitorIntel />} />
            <Route path="/audiences" element={<Audiences />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            </Routes>
        </Layout>
        </Router>
    </DataProvider>
  );
};

export default App;