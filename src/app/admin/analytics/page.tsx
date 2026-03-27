'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { ArrowDownRight, ArrowUpRight, Filter } from "lucide-react";

export default function AdminDetailedAnalytics() {
  const chartData = [
    { name: 'Mon', active: 1200, quiz: 450 },
    { name: 'Tue', active: 2100, quiz: 800 },
    { name: 'Wed', active: 1800, quiz: 600 },
    { name: 'Thu', active: 2400, quiz: 950 },
    { name: 'Fri', active: 2200, quiz: 850 },
    { name: 'Sat', active: 3100, quiz: 1200 },
    { name: 'Sun', active: 2800, quiz: 1100 },
  ];

  return (
    <div className="max-w-[1400px]">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="h1 mb-1">Advanced Analytics</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Deep-dive into student engagement & performance metrics.</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter Clusters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-8">
           <div className="flex items-center justify-between mb-8">
             <h3 className="font-bold text-[15px]">Active Users Trend</h3>
             <div className="text-[12px] font-bold text-[#10b981] flex items-center gap-1">
               <ArrowUpRight className="w-4 h-4" /> +18.4% this week
             </div>
           </div>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData}>
                 <defs>
                   <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                 <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: '12px' }} />
                 <Area type="monotone" dataKey="active" stroke="var(--accent)" fillOpacity={1} fill="url(#colorActive)" strokeWidth={3} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-8">
           <div className="flex items-center justify-between mb-8">
             <h3 className="font-bold text-[15px]">Quiz Completion Rate</h3>
             <div className="text-[12px] font-bold text-[#f43f5e] flex items-center gap-1">
               <ArrowDownRight className="w-4 h-4" /> -2.1% since yesterday
             </div>
           </div>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                 <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                 <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: '12px' }} />
                 <Bar dataKey="quiz" fill="var(--color-cloud)" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] overflow-hidden">
        <div className="px-8 py-6 border-b border-[var(--border)] bg-[rgba(255,255,255,0.02)]">
          <h3 className="font-bold text-[15px]">Subject-wise Mastery Distribution</h3>
        </div>
        <div className="p-8">
           <div className="space-y-6">
             {[
               { name: 'Compiler Design', pct: 78, color: 'var(--color-cd)' },
               { name: 'OOAD', pct: 92, color: 'var(--color-ooad)' },
               { name: 'Cloud Computing', pct: 45, color: 'var(--color-cloud)' },
               { name: 'Blockchain', pct: 64, color: 'var(--color-bc)' },
             ].map((sub, i) => (
               <div key={i}>
                 <div className="flex items-center justify-between mb-2">
                   <div className="text-[13px] font-medium text-[var(--text-primary)]">{sub.name}</div>
                   <div className="text-[12px] font-mono font-bold" style={{ color: sub.color }}>{sub.pct}%</div>
                 </div>
                 <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                   <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${sub.pct}%`, backgroundColor: sub.color }}></div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
