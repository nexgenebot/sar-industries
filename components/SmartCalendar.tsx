
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useData } from '../context/DataContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Zap } from 'lucide-react';
import { getScheduleRecommendation } from '../services/geminiService';

export const SmartCalendar: React.FC = () => {
    const { campaigns } = useData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [recommendation, setRecommendation] = useState<string | null>(null);
    const [isGettingAdvice, setIsGettingAdvice] = useState(false);

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleGetAdvice = async () => {
        setIsGettingAdvice(true);
        const advice = await getScheduleRecommendation("Sales and Conversions");
        setRecommendation(advice);
        setIsGettingAdvice(false);
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const days = [];
    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-32 bg-background/30 border border-border/50 opacity-50"></div>);
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        // Find campaigns active on this day
        const activeCampaigns = campaigns.filter(c => {
            return dateStr >= c.startDate && dateStr <= c.endDate;
        });

        days.push(
            <div key={i} className="h-32 bg-background border border-border/50 p-2 relative group hover:bg-zinc-800/30 transition-colors">
                <span className={`text-sm font-medium ${activeCampaigns.length > 0 ? 'text-textMain' : 'text-textMuted'}`}>{i}</span>
                <div className="mt-1 space-y-1 overflow-y-auto max-h-[100px] custom-scrollbar">
                    {activeCampaigns.map(c => (
                        <div key={c.id} className={`text-[10px] px-1.5 py-1 rounded truncate border-l-2 ${
                            c.platform === 'Facebook' ? 'bg-blue-900/30 text-blue-200 border-blue-500' :
                            c.platform === 'Instagram' ? 'bg-pink-900/30 text-pink-200 border-pink-500' :
                            'bg-green-900/30 text-green-200 border-green-500'
                        }`}>
                            {c.name}
                        </div>
                    ))}
                </div>
                {/* Quick Add Button on Hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="w-5 h-5 rounded bg-primary/20 text-primary flex items-center justify-center">+</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-textMain tracking-tight">Smart Calendar</h1>
                    <p className="text-textMuted mt-1">Visualize your campaign timelines and optimize delivery.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={handleGetAdvice} isLoading={isGettingAdvice}>
                        <Zap size={16} className="mr-2 text-yellow-500" /> AI Optimize Schedule
                    </Button>
                    <Button>
                        <Clock size={16} className="mr-2" /> Sync Timezones
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <Card className="p-0 overflow-hidden">
                        <div className="p-4 border-b border-border flex justify-between items-center bg-surface">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <CalendarIcon size={20} className="text-primary" /> {monthName} {year}
                            </h2>
                            <div className="flex gap-1">
                                <button onClick={prevMonth} className="p-2 hover:bg-zinc-700 rounded-lg"><ChevronLeft size={20} /></button>
                                <button onClick={nextMonth} className="p-2 hover:bg-zinc-700 rounded-lg"><ChevronRight size={20} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 bg-surface border-b border-border text-center py-2 text-xs font-semibold text-textMuted uppercase tracking-wider">
                            <div>Sun</div>
                            <div>Mon</div>
                            <div>Tue</div>
                            <div>Wed</div>
                            <div>Thu</div>
                            <div>Fri</div>
                            <div>Sat</div>
                        </div>
                        <div className="grid grid-cols-7">
                            {days}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card title="AI Schedule Insight">
                        {recommendation ? (
                            <div className="prose prose-invert prose-sm">
                                <p className="text-sm text-textMain whitespace-pre-line">{recommendation}</p>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-textMuted text-sm">
                                <Zap size={32} className="mx-auto mb-2 opacity-20" />
                                Click "AI Optimize Schedule" to get posting time recommendations based on your goals.
                            </div>
                        )}
                    </Card>
                    
                    <Card title="Upcoming Events">
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <div className="text-center bg-background rounded p-1.5 min-w-[50px]">
                                    <div className="text-[10px] uppercase text-textMuted">Oct</div>
                                    <div className="font-bold text-lg">31</div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Halloween Special</h4>
                                    <p className="text-xs text-textMuted">Campaign Launch • 09:00 AM</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <div className="text-center bg-background rounded p-1.5 min-w-[50px]">
                                    <div className="text-[10px] uppercase text-textMuted">Nov</div>
                                    <div className="font-bold text-lg">24</div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Black Friday Prep</h4>
                                    <p className="text-xs text-textMuted">Ad Set Review • 02:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
