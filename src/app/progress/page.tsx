'use client';

import Navbar from "@/components/layout/Navbar";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { useDataStore } from "@/store/useDataStore";

export default function ProgressPage() {
  const { subjects, quizzes, flashcards } = useDataStore();
  
  const weeklyData = [
    { name: 'Mon', hrs: 1.2 }, { name: 'Tue', hrs: 2.5 },
    { name: 'Wed', hrs: 1.8 }, { name: 'Thu', hrs: 3.1 },
    { name: 'Fri', hrs: 0.5 }, { name: 'Sat', hrs: 4.2 }, { name: 'Sun', hrs: 2.9 }
  ];

  const subjectData = subjects.map(s => ({
    subject: s.shortName,
    score: 0 // Placeholder until real points are tracked
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] p-3 rounded-[var(--r-md)] shadow-[var(--shadow-lg)]">
          <p className="text-[11px] font-bold text-[var(--accent)] mb-1">{label}</p>
          <p className="text-[14px] font-['JetBrains_Mono'] text-white">
            {payload[0].value} <span className="text-[var(--text-muted)] text-[12px]">Units</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--bg-base)]">
      <Navbar />
      
      <div className="flex-1 overflow-y-auto px-6 py-10">
        <div className="max-w-[1280px] mx-auto">
          
          <div className="mb-10">
            <h1 className="h1 mb-1">Your Mastery Metrics</h1>
            <p className="body-lg text-[var(--text-secondary)]">Analytics of your SVIIT B.Tech trajectory.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* WEEKLY STUDY TIME CHART */}
            <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6">
              <h3 className="text-[14px] font-bold text-[var(--text-primary)] mb-6">Study Time Trend (Last 7 Days)</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorHrs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6c63ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fontSize: 12}} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.02)'}} />
                    <Area type="monotone" dataKey="hrs" stroke="#6c63ff" strokeWidth={3} fillOpacity={1} fill="url(#colorHrs)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SUBJECT MASTERY BAR CHART */}
            <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6">
              <h3 className="text-[14px] font-bold text-[var(--text-primary)] mb-6">Quiz Average by Subject</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectData} layout="vertical" margin={{ left: -20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'rgba(255,255,255,0.6)'}} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Bar dataKey="score" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6 flex flex-col items-center justify-center text-center hover:border-[var(--accent)] transition-colors">
              <div className="text-[36px] font-['Syne'] font-bold text-[#f97316] mb-1">14h 22m</div>
              <div className="text-[12px] font-bold text-[var(--text-muted)] tracking-wider">TOTAL STUDY TIME</div>
            </div>
            <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6 flex flex-col items-center justify-center text-center hover:border-[var(--accent)] transition-colors">
              <div className="text-[36px] font-['Syne'] font-bold text-[#38bdf8] mb-1">1,240</div>
              <div className="text-[12px] font-bold text-[var(--text-muted)] tracking-wider">CARDS REVIEWED</div>
            </div>
            <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6 flex flex-col items-center justify-center text-center hover:border-[var(--accent)] transition-colors">
              <div className="text-[36px] font-['Syne'] font-bold text-[#10b981] mb-1">78%</div>
              <div className="text-[12px] font-bold text-[var(--text-muted)] tracking-wider">GLOBAL AVERAGE</div>
            </div>
            <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6 flex flex-col items-center justify-center text-center hover:border-[var(--accent)] transition-colors">
              <div className="text-[36px] font-['Syne'] font-bold text-[#fbbf24] mb-1">12</div>
              <div className="text-[12px] font-bold text-[var(--text-muted)] tracking-wider">TOPICS MASTERED</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
