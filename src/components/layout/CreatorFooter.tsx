import { Mail, ExternalLink } from 'lucide-react';

export default function CreatorFooter() {
  return (
    <footer className="w-full mt-20 pb-12 relative z-10 border-t border-[var(--border)] pt-16">
      <div className="max-w-[960px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left Side: Branding/Intro */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6c63ff] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#6c63ff20]">
              <span className="font-['Syne'] font-extrabold text-[20px] text-white">H</span>
            </div>
            <div>
              <h3 className="font-['Syne'] font-bold text-[18px] text-white leading-tight">Harsh Malviya</h3>
              <p className="text-[12px] text-[var(--text-muted)] font-medium uppercase tracking-wider">Lead Developer & Architect</p>
            </div>
          </div>
          <p className="body-sm text-[var(--text-secondary)] max-w-[380px] mb-8">
            Crafting high-performance academic systems and intuitive digital experiences. ExamEdge is a vision to simplify engineering studies for everyone.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/harshfly"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[var(--bg-overlay)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[#6c63ff] hover:border-[#6c63ff80] hover:bg-[#6c63ff10] transition-all duration-300"
              title="GitHub Profile"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/harsh-malviya-446111293/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[var(--bg-overlay)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[#0077b5] hover:border-[#0077b580] hover:bg-[#0077b510] transition-all duration-300"
              title="LinkedIn Profile"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.2225 0h.003z" />
              </svg>
            </a>
            <a
              href="mailto:harshhmalviya09@gmail.com"
              className="w-10 h-10 rounded-full bg-[var(--bg-overlay)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[#f97316] hover:border-[#f9731680] hover:bg-[#f9731610] transition-all duration-300"
              title="Send an Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Right Side: Creative "About" Card */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ExternalLink className="w-6 h-6" />
          </div>
          <div className="relative z-10">
            <h4 className="font-['Syne'] font-bold text-[16px] text-white mb-3">Connect for Projects</h4>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-6">
              I specialize in Full-Stack development, AI Integration, and UI/UX Design. Let's build something extraordinary together.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[12px] text-[var(--text-muted)]">Official Email</span>
                <span className="text-[12px] font-mono text-[var(--accent)] font-semibold">harshhmalviya09@gmail.com</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[12px] text-[var(--text-muted)]">Availability</span>
                <span className="text-[12px] font-semibold text-[#10b981]">Open for Collaboration</span>
              </div>
            </div>
          </div>

          {/* Subtle Glow Effect */}
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[var(--accent)] rounded-full blur-[80px] opacity-20"></div>
        </div>

      </div>

      {/* Copyright Line */}
      <div className="max-w-[960px] mx-auto px-6 mt-16 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
        <span>© 2024 ExamEdge — All Rights Reserved</span>
        <div className="flex gap-6">
          <Link href="/terms" className="hover:text-[var(--text-primary)] transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy</Link>
          <span className="opacity-40">Built with Precision in India</span>
        </div>
      </div>
    </footer>
  );
}

// Minimal Link helper for local navigation
function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={className}>{children}</a>
  );
}
