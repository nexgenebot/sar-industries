
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { MOCK_CHART_DATA, DEMOGRAPHIC_AGE_DATA, DEMOGRAPHIC_GENDER_DATA, KPIS } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { Calendar, MapPin, Users, FileText, CheckCircle, AlertTriangle, Lightbulb, Loader2, Download } from 'lucide-react';
import { Button } from './ui/Button';
import { generatePerformanceReport } from '../services/geminiService';

const COLORS = ['#3b82f6', '#ec4899', '#8b5cf6', '#10b981'];

export const Analytics: React.FC = () => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState<{ summary: string, wins: string[], improvements: string[] } | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleGenerateReport = async () => {
      setIsGeneratingReport(true);
      setShowReportModal(true);
      
      const metricsSummary = {
          kpis: KPIS,
          traffic: MOCK_CHART_DATA.slice(-3),
          demographics: {
              topAge: '25-34',
              topGender: 'Women'
          }
      };
      
      const result = await generatePerformanceReport(metricsSummary);
      setReportData(result);
      setIsGeneratingReport(false);
  };

  return (
    <div className="space-y-6">
       {showReportModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-surface border border-border rounded-xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                    <div className="p-4 border-b border-border flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                            <FileText size={18} className="text-primary" />
                            Executive AI Report
                        </h3>
                        <button onClick={() => setShowReportModal(false)} className="text-textMuted hover:text-white">&times;</button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                        {isGeneratingReport ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <Loader2 size={40} className="animate-spin text-primary" />
                                <div className="text-center">
                                    <p className="font-medium text-textMain">Analyzing Data Points...</p>
                                    <p className="text-sm text-textMuted">Synthesizing insights from your campaign performance.</p>
                                </div>
                            </div>
                        ) : reportData ? (
                            <div className="space-y-6">
                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                    <h4 className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">Executive Summary</h4>
                                    <p className="text-textMain leading-relaxed">{reportData.summary}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-4">
                                        <h4 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                                            <CheckCircle size={16} /> Key Wins
                                        </h4>
                                        <ul className="space-y-2">
                                            {reportData.wins.map((win, i) => (
                                                <li key={i} className="text-sm text-textMain flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                                                    {win}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4">
                                        <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                                            <AlertTriangle size={16} /> Areas for Review
                                        </h4>
                                        <ul className="space-y-2">
                                            {reportData.improvements.map((imp, i) => (
                                                <li key={i} className="text-sm text-textMain flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                                                    {imp}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-red-400">Failed to generate report. Please try again.</p>
                        )}
                    </div>

                    <div className="p-4 border-t border-border flex justify-end gap-2 bg-background/50 rounded-b-xl">
                        <Button variant="ghost" onClick={() => setShowReportModal(false)}>Close</Button>
                        <Button disabled={isGeneratingReport || !reportData} onClick={() => alert("Report downloaded (simulation)")}>
                            <Download size={16} className="mr-2" /> Export PDF
                        </Button>
                    </div>
                </div>
            </div>
       )}

       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-textMain tracking-tight">Analytics Pro</h1>
            <p className="text-textMuted mt-1">Deep dive into performance metrics and attribution.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" onClick={handleGenerateReport}>
                <FileText size={16} className="mr-2" /> Generate AI Report
            </Button>
            <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm text-textMain hover:bg-zinc-800 transition-colors">
                <Calendar size={16} />
                <span>Last 30 Days</span>
            </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="text-center p-6 bg-gradient-to-b from-surface to-background">
               <p className="text-textMuted text-sm">Avg. Cost Per Click</p>
               <h3 className="text-3xl font-bold text-textMain mt-2">$1.42</h3>
               <p className="text-xs text-red-400 mt-1">+2.4% vs last period</p>
           </Card>
           <Card className="text-center p-6 bg-gradient-to-b from-surface to-background">
               <p className="text-textMuted text-sm">Avg. Order Value</p>
               <h3 className="text-3xl font-bold text-textMain mt-2">$85.20</h3>
               <p className="text-xs text-green-400 mt-1">+12% vs last period</p>
           </Card>
           <Card className="text-center p-6 bg-gradient-to-b from-surface to-background">
               <p className="text-textMuted text-sm">Total Leads</p>
               <h3 className="text-3xl font-bold text-textMain mt-2">4,290</h3>
               <p className="text-xs text-green-400 mt-1">+5.8% vs last period</p>
           </Card>
      </div>

      {/* Main Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Traffic Source Comparison">
             <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                        <Legend />
                        <Bar dataKey="value" name="Facebook" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="value2" name="Instagram" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </Card>
        
        <Card title="Conversion Trends">
            <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorVal3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }} />
                <Area type="monotone" dataKey="value3" name="Conversions" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorVal3)" />
              </AreaChart>
            </ResponsiveContainer>
            </div>
        </Card>
      </div>

      {/* Demographics & Geo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Age Distribution" className="lg:col-span-1">
              <div className="h-[250px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={DEMOGRAPHIC_AGE_DATA} layout="vertical" margin={{left: -20}}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} width={60} />
                          <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                          <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </Card>

          <Card title="Gender Split" className="lg:col-span-1">
               <div className="h-[250px] w-full flex items-center justify-center">
                   <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                           <Pie
                               data={DEMOGRAPHIC_GENDER_DATA}
                               innerRadius={60}
                               outerRadius={80}
                               paddingAngle={5}
                               dataKey="value"
                           >
                               {DEMOGRAPHIC_GENDER_DATA.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                               ))}
                           </Pie>
                           <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }} />
                           <Legend verticalAlign="bottom" height={36}/>
                       </PieChart>
                   </ResponsiveContainer>
               </div>
          </Card>

          <Card title="Top Locations" className="lg:col-span-1">
              <div className="space-y-4 mt-2">
                  {[
                      { city: 'New York, USA', percent: 35 },
                      { city: 'London, UK', percent: 22 },
                      { city: 'Toronto, CA', percent: 15 },
                      { city: 'Sydney, AU', percent: 8 }
                  ].map((loc, idx) => (
                      <div key={idx}>
                          <div className="flex justify-between text-sm mb-1">
                              <span className="flex items-center gap-2 text-textMain">
                                  <MapPin size={14} className="text-textMuted" /> {loc.city}
                              </span>
                              <span className="font-mono text-textMuted">{loc.percent}%</span>
                          </div>
                          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${loc.percent}%` }}></div>
                          </div>
                      </div>
                  ))}
              </div>
          </Card>
      </div>
    </div>
  );
};
