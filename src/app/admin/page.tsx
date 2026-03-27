'use client';

import { Users, BookOpen, Brain, Activity, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Students", value: "3,142", icon: Users, color: "#10b981", trend: "+12%" },
    { label: "Active Subjects", value: "7", icon: BookOpen, color: "#f97316", trend: "0" },
    { label: "Quiz Completed", value: "14.2K", icon: Brain, color: "#38bdf8", trend: "+45%" },
    { label: "Avg Platform Engagement", value: "48m/Day", icon: Activity, color: "#6c63ff", trend: "+5%" },
  ];

  const chartData = [
    { name: 'CD', views: 4500, fill: 'var(--color-cd)' }, 
    { name: 'OOAD', views: 8000, fill: 'var(--color-ooad)' },
    { name: 'Cloud', views: 2000, fill: 'var(--color-cloud)' }, 
    { name: 'BC', views: 6000, fill: 'var(--color-bc)' }, 
    { name: 'Robo', views: 9500, fill: 'var(--color-robo)' }, 
    { name: 'IoT', views: 3000, fill: 'var(--color-iot)' }, 
    { name: 'DS', views: 5000, fill: 'var(--color-ds)' }
  ];

  return (
    <div className="max-w-[1400px]">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="h1 mb-1">Platform Analytics</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">SVIIT System Overview & Engagement Metrics</p>
        </div>
        <div className="flex gap-3">
          <select className="input-field py-2 text-[13px] w-[150px]">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Semester</option>
          </select>
          <button className="btn-primary flex items-center gap-2"><ArrowUpRight className="w-4 h-4" /> Export Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 transform scale-150 -rotate-12 transition-transform group-hover:scale-110">
                <Icon size={120} color={s.color} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-[var(--r-md)] flex items-center justify-center bg-[var(--bg-elevated)] border border-[var(--border)]">
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <h3 className="text-[12px] font-bold text-[var(--text-muted)] tracking-wider">{s.label}</h3>
              </div>
              <div className="flex items-end gap-3">
                <div className="text-[36px] font-['Syne'] font-extrabold leading-none">{s.value}</div>
                <div className={`text-[12px] font-bold mb-1 ${s.trend.startsWith('+') ? 'text-green-500' : 'text-[var(--text-muted)]'}`}>
                  {s.trend}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-8">
          <h3 className="text-[14px] font-bold text-[var(--text-primary)] mb-6">Subject Engagement Analytics</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{fontSize: 12, fill: 'rgba(255,255,255,0.6)'}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: '8px', color: 'white' }} />
                  <Bar dataKey="views" radius={[4, 4, 0, 0]} />
               </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6">
           <h3 className="text-[14px] font-bold text-[var(--text-primary)] mb-6">Recent Additions</h3>
           <div className="space-y-4">
             {[
               { title: 'Turing Machines (Robotics)', time: '2m ago', author: 'Super Admin' },
               { title: 'Phase of Compiler (CD)', time: '1h ago', author: 'Super Admin' },
               { title: 'Added 40 Quiz Questions', time: '5h ago', author: 'Editor JS' },
               { title: 'Activated Year 3 Curriculum', time: '1d ago', author: 'Super Admin' },
             ].map((log, i) => (
               <div key={i} className="flex gap-3 items-start pb-4 border-b border-[var(--border)] last:border-0 last:pb-0">
                 <div className="w-2 h-2 rounded-full bg-[var(--accent)] mt-1.5 flex-shrink-0"></div>
                 <div>
                   <div className="text-[13px] text-[var(--text-primary)] font-medium">{log.title}</div>
                   <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{log.time} · {log.author}</div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
