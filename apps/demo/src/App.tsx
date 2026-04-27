import { CareerChatWidget } from '@career-agent/widget';

const TECH_STACK = [
  'React', 'TypeScript', 'Next.js', 'Zustand', 'Tailwind CSS',
  'Mastra', 'Vitest', 'Playwright', 'GraphQL', 'Redux',
];

export function App() {
  return (
    <>
      {/* Ambient background glow */}
      <div className="os-ambient" aria-hidden="true" />

      <div className="os-page">
        {/* Top bar */}
        <header className="os-topbar os-reveal">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="os-logo">Davi Araki</span>
            <span className="os-logo-tag">Portfolio Agent</span>
          </div>
          <a
            href="https://github.com/davi-araki"
            target="_blank"
            rel="noopener noreferrer"
            className="os-footer-link"
            style={{ fontSize: '12px' }}
          >
            GitHub ↗
          </a>
        </header>

        {/* Main split panel */}
        <main className="os-main">
          {/* Left — About Card */}
          <aside className="os-about os-reveal os-delay-1">
            <div className="os-section-label">About</div>

            <h1 className="os-about-headline">
              Senior Software<br />
              <span className="os-accent-word">Engineer</span>
            </h1>

            <p className="os-about-role">
              Juiz de Fora, Brazil · 5+ years in production
            </p>

            <p className="os-about-summary">
              I architect and lead the development of scalable, high-performance 
              web applications. Specializing in conversational AI, gamification, 
              and high-traffic platforms — I drive technical excellence, DX, and 
              product impact.
            </p>

            {/* Stats */}
            <div className="os-stats">
              <div className="os-stat">
                <div className="os-stat-value">5+</div>
                <div className="os-stat-label">Years</div>
              </div>
              <div className="os-stat">
                <div className="os-stat-value">2M+</div>
                <div className="os-stat-label">Users Impacted</div>
              </div>
              <div className="os-stat">
                <div className="os-stat-value">15+</div>
                <div className="os-stat-label">Countries</div>
              </div>
            </div>

            {/* Tech stack */}
            <div className="os-section-label" style={{ marginTop: '4px' }}>Stack</div>
            <div className="os-pills">
              {TECH_STACK.map((tech) => (
                <span key={tech} className="os-pill">{tech}</span>
              ))}
            </div>
          </aside>

          {/* Right — Chat Widget */}
          <div className="os-widget-col os-reveal os-delay-2">
            <CareerChatWidget
              apiBaseUrl={import.meta.env.VITE_API_URL || "http://localhost:4111"}
              initialMessage="Hi! I'm Davi's Career Agent — powered by AI. Ask me anything about his experience, projects, or skills."
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="os-footer os-reveal os-delay-4">
          <span className="os-footer-text">
            Built with Mastra · React · TypeScript
          </span>
          <span className="os-footer-text">
            © {new Date().getFullYear()} Davi Araki
          </span>
        </footer>
      </div>
    </>
  );
}
