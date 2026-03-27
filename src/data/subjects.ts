import { CurriculumYear, Subject } from '@/types';

export const curriculum: CurriculumYear[] = [
  {
    year: 1, label: 'First Year', color: '#22c55e', status: 'coming-soon',
    semesters: [
      { sem: 1, status: 'coming-soon', subjectIds: [] },
      { sem: 2, status: 'coming-soon', subjectIds: [] }
    ]
  },
  {
    year: 2, label: 'Second Year', color: '#38bdf8', status: 'coming-soon',
    semesters: [
      { sem: 3, status: 'coming-soon', subjectIds: [] },
      { sem: 4, status: 'coming-soon', subjectIds: [] }
    ]
  },
  {
    year: 3, label: 'Third Year', color: '#6c63ff', status: 'live',
    semesters: [
      { sem: 5, status: 'coming-soon', subjectIds: [] },
      { sem: 6, status: 'live', subjectIds: ['compiler-design', 'ooad', 'cloud-computing', 'blockchain', 'robotics', 'iot', 'data-science'] }
    ]
  },
  {
    year: 4, label: 'Fourth Year', color: '#f97316', status: 'coming-soon',
    semesters: [
      { sem: 7, status: 'coming-soon', subjectIds: [] },
      { sem: 8, status: 'coming-soon', subjectIds: [] }
    ]
  }
];

export const subjects: Subject[] = [
  {
    id: 'compiler-design', code: 'BTCS601N', name: 'Compiler Design', shortName: 'CD',
    icon: '⚙️', color: '#f97316', colorBg: 'rgba(249,115,22,0.12)',
    credits: 4, year: 3, semester: 6,
    tags: ['Core', 'Theory', 'Systems'],
    updatedAt: new Date().toISOString(),
    units: [
      {
        no: 'I', title: 'Introduction and Lexical Analysis', hours: 8,
        topics: [
          { id: 'cd-1-1', slug: 'phases-of-compiler', name: 'Phases of a Compiler', estimatedMinutes: 12, difficulty: 'medium', examFrequency: 'very-high', tags: ['Basics', 'Pipeline'] },
          { id: 'cd-1-2', slug: 'lexical-analysis', name: 'Lexical Analysis & Tokens', estimatedMinutes: 15, difficulty: 'easy', examFrequency: 'high', tags: ['Regex', 'DFA'] }
        ]
      },
      { no: 'II', title: 'Syntax Analysis', hours: 10, topics: [] },
      { no: 'III', title: 'Intermediate Code Generation', hours: 9, topics: [] },
      { no: 'IV', title: 'Code Optimization', hours: 10, topics: [] },
      { no: 'V', title: 'Code Generation', hours: 9, topics: [] }
    ]
  },
  {
    id: 'ooad', code: 'BTCS602N', name: 'Object Oriented Analysis & Design', shortName: 'OOAD',
    icon: '🔷', color: '#22c55e', colorBg: 'rgba(34,197,94,0.12)',
    credits: 4, year: 3, semester: 6, tags: ['Design', 'UML', 'Software Eng'], updatedAt: new Date().toISOString(),
    units: [{ no: 'I', title: 'OO Technology', hours: 10, topics: [] }, { no: 'II', title: 'Class Modeling', hours: 9, topics: [] }, { no: 'III', title: 'Lifecycle', hours: 8, topics: [] }, { no: 'IV', title: 'System Design', hours: 7, topics: [] }, { no: 'V', title: 'Class Design', hours: 8, topics: [] }]
  },
  {
    id: 'cloud-computing', code: 'BTCS603N', name: 'Cloud Computing', shortName: 'Cloud',
    icon: '☁️', color: '#38bdf8', colorBg: 'rgba(56,189,248,0.12)',
    credits: 4, year: 3, semester: 6, tags: ['Infrastructure', 'AWS'], updatedAt: new Date().toISOString(),
    units: [{ no: 'I', title: 'Evolution & Models', hours: 10, topics: [] }, { no: 'II', title: 'Virtualization & Sec', hours: 8, topics: [] }, { no: 'III', title: 'IaaS/PaaS/SaaS', hours: 9, topics: [] }, { no: 'IV', title: 'AWS/Azure Core', hours: 9, topics: [] }, { no: 'V', title: 'Case Studies', hours: 8, topics: [] }]
  },
  {
    id: 'blockchain', code: 'BTDSE611N', name: 'Blockchain Technology', shortName: 'BC',
    icon: '🔗', color: '#a855f7', colorBg: 'rgba(168,85,247,0.12)',
    credits: 3, year: 3, semester: 6, tags: ['Cryptography', 'Web3'], updatedAt: new Date().toISOString(),
    units: [{ no: 'I', title: 'Fundamentals', hours: 8, topics: [] }, { no: 'II', title: 'Consensus Algorithms', hours: 8, topics: [] }, { no: 'III', title: 'Smart Contracts (Eth)', hours: 8, topics: [] }, { no: 'IV', title: 'Hyperledger Fabric', hours: 8, topics: [] }, { no: 'V', title: 'Use Cases', hours: 8, topics: [] }]
  },
  {
    id: 'robotics', code: 'BTDSE612N', name: 'Robotics', shortName: 'Robo',
    icon: '🤖', color: '#f43f5e', colorBg: 'rgba(244,63,94,0.12)',
    credits: 3, year: 3, semester: 6, tags: ['Hardware', 'AI'], updatedAt: new Date().toISOString(),
    units: [{ no: 'I', title: 'Anatomy & DOF', hours: 8, topics: [] }, { no: 'II', title: 'DH Parameters', hours: 8, topics: [] }, { no: 'III', title: 'Dynamics & Control', hours: 8, topics: [] }, { no: 'IV', title: 'Actuators & Sensors', hours: 8, topics: [] }, { no: 'V', title: 'Programming & Cases', hours: 8, topics: [] }]
  },
  {
    id: 'iot', code: 'BTDSE613N', name: 'Internet of Things', shortName: 'IoT',
    icon: '📡', color: '#10b981', colorBg: 'rgba(16,185,129,0.12)',
    credits: 3, year: 3, semester: 6, tags: ['Embedded', 'Networking'], updatedAt: new Date().toISOString(),
    units: [{ no: 'I', title: 'Architecture & Basics', hours: 10, topics: [] }, { no: 'II', title: 'Protocols & Arduino vs RPi', hours: 9, topics: [] }, { no: 'III', title: 'Edge & Cloud Integration', hours: 8, topics: [] }, { no: 'IV', title: 'Storage & Security', hours: 7, topics: [] }, { no: 'V', title: 'IIoT & Smart Use Cases', hours: 8, topics: [] }]
  },
  {
    id: 'data-science', code: 'BTCS708N', name: 'Data Science', shortName: 'DS',
    icon: '📊', color: '#06b6d4', colorBg: 'rgba(6,182,212,0.12)',
    credits: 4, year: 3, semester: 6, tags: ['Machine Learning', 'Stats', 'Python'], updatedAt: new Date().toISOString(),
    units: [{ no: 'I', title: '5Vs & Intro', hours: 6, topics: [] }, { no: 'II', title: 'Pandas & EDA', hours: 9, topics: [] }, { no: 'III', title: 'Stats & Prob', hours: 6, topics: [] }, { no: 'IV', title: 'ML Algorithms', hours: 8, topics: [] }, { no: 'V', title: 'Advanced Use Cases', hours: 5, topics: [] }]
  }
];
