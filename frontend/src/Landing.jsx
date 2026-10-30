import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
  MessageSquareText,
  BarChart3,
  Clock3,
  Menu,
  X,
  GraduationCap,
  CircleHelp
} from "lucide-react";
import { useAuth } from "./context/AuthContext";
import "./landing.css";

const features = [
  {
    icon: MessageSquareText,
    number: "01",
    title: "One place for every concern",
    text: "Submit campus issues with clear details and keep every request organized."
  },
  {
    icon: BrainCircuit,
    number: "02",
    title: "AI-assisted understanding",
    text: "Help the campus team categorize issues and identify possible duplicates."
  },
  {
    icon: Clock3,
    number: "03",
    title: "Track every update",
    text: "Follow your complaint status instead of wondering what happens next."
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Insights that improve campus",
    text: "Give administrators a clearer view of recurring issues and resolution progress."
  }
];

function Brand({ footer = false }) {
  return (
    <Link to="/" className={`cm-brand ${footer ? "cm-brand-footer" : ""}`} aria-label="CampusMindAI home">
      <span className="cm-brand-mark">
        <BrainCircuit size={23} strokeWidth={1.8} />
        <span className="cm-brand-spark"><Sparkles size={10} /></span>
      </span>
      <span className="cm-brand-copy">
        <strong>CampusMind<span>AI</span></strong>
        <small>SMARTER CAMPUS. BETTER TOGETHER.</small>
      </span>
    </Link>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const openWorkspace = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
  };

  return (
    <div className="cm-landing">
      <div className="cm-background-grid" aria-hidden="true" />
      <div className="cm-orb cm-orb-one" aria-hidden="true" />
      <div className="cm-orb cm-orb-two" aria-hidden="true" />

      <header className="cm-header">
        <div className="cm-header-inner">
          <Brand />
          <button
            type="button"
            className="cm-mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className={`cm-nav ${menuOpen ? "cm-nav-open" : ""}`}>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <Link className="cm-nav-login" to="/login">Log in</Link>
            <Link className="cm-button cm-button-small" to="/register">
              Get started <ArrowUpRight size={16} />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="cm-hero">
          <div className="cm-hero-copy">
            <div className="cm-eyebrow">
              <span className="cm-live-dot" />
              BUILT FOR A BETTER CAMPUS EXPERIENCE
            </div>

            <h1>
              Your campus.
              <br />
              Your voice.
              <br />
              <span className="cm-gradient-text">Real change.</span>
            </h1>

            <p className="cm-hero-description">
              A smarter way to raise campus concerns, follow progress, and help
              your institution become a better place for everyone.
            </p>

            <div className="cm-hero-actions">
              <button type="button" className="cm-button" onClick={openWorkspace}>
                {user ? "Open my dashboard" : "Raise a concern"}
                <ArrowRight size={18} />
              </button>
              <Link to="/login" className="cm-button cm-button-ghost">
                <span className="cm-play-icon"><ArrowRight size={14} /></span>
                Explore your portal
              </Link>
            </div>

            <div className="cm-trust-row">
              <div className="cm-avatar-stack" aria-hidden="true">
                <span><GraduationCap size={15} /></span>
                <span><ShieldCheck size={15} /></span>
                <span><Sparkles size={15} /></span>
              </div>
              <div>
                <strong>One connected campus</strong>
                <small>Students and administrators, working together</small>
              </div>
            </div>
          </div>

          <div className="cm-hero-visual" aria-label="Illustration of the CampusMindAI complaint tracking dashboard">
            <div className="cm-visual-glow" />
            <div className="cm-dashboard-window">
              <div className="cm-window-top">
                <div className="cm-window-dots"><i /><i /><i /></div>
                <span>campusmind.ai <ShieldCheck size={12} /></span>
                <span className="cm-window-menu">•••</span>
              </div>

              <div className="cm-preview-content">
                <div className="cm-preview-greeting">
                  <div>
                    <small>YOUR CAMPUS, IN FOCUS</small>
                    <h3>Welcome back<span>.</span></h3>
                  </div>
                  <div className="cm-preview-avatar"><GraduationCap size={19} /></div>
                </div>

                <div className="cm-preview-stats">
                  <div className="cm-preview-stat">
                    <span className="cm-stat-icon cyan"><MessageSquareText size={16} /></span>
                    <small>Total requests</small>
                    <strong>24</strong>
                    <span className="cm-stat-foot">Your submissions</span>
                  </div>
                  <div className="cm-preview-stat">
                    <span className="cm-stat-icon violet"><Clock3 size={16} /></span>
                    <small>In progress</small>
                    <strong>08</strong>
                    <span className="cm-stat-foot">Being reviewed</span>
                  </div>
                </div>

                <div className="cm-preview-list-heading">
                  <strong>Recent activity</strong>
                  <span>Live overview</span>
                </div>

                <div className="cm-preview-ticket">
                  <span className="cm-ticket-icon"><Zap size={16} /></span>
                  <div><strong>Library Wi-Fi issue</strong><small>Facilities · Ticket #CM-1042</small></div>
                  <span className="cm-status status-progress">In progress</span>
                </div>
                <div className="cm-preview-ticket">
                  <span className="cm-ticket-icon purple"><CircleHelp size={16} /></span>
                  <div><strong>Classroom projector</strong><small>Academic · Ticket #CM-1038</small></div>
                  <span className="cm-status status-resolved">Resolved</span>
                </div>

                <div className="cm-ai-note">
                  <span className="cm-ai-note-icon"><Sparkles size={16} /></span>
                  <div><strong>Designed for clarity</strong><small>Every concern has a place and a next step.</small></div>
                  <CheckCircle2 size={17} />
                </div>
              </div>
            </div>

            <div className="cm-float-card cm-float-top">
              <span className="cm-float-icon"><BrainCircuit size={18} /></span>
              <div><strong>AI-assisted</strong><small>Smarter issue triage</small></div>
              <span className="cm-float-pulse" />
            </div>

            <div className="cm-float-card cm-float-bottom">
              <span className="cm-float-check"><CheckCircle2 size={19} /></span>
              <div><strong>Progress, made visible</strong><small>From submitted to resolved</small></div>
            </div>
          </div>
        </section>

        <section className="cm-value-strip" aria-label="Platform values">
          <div><ShieldCheck size={18} /><span>Role-based access</span></div>
          <div><BrainCircuit size={18} /><span>AI-assisted workflows</span></div>
          <div><Clock3 size={18} /><span>Transparent tracking</span></div>
          <div><Zap size={18} /><span>Built for campus life</span></div>
        </section>

        <section id="features" className="cm-section">
          <div className="cm-section-heading">
            <span className="cm-section-kicker">A BETTER WAY FORWARD</span>
            <h2>Small concerns deserve<br /><span className="cm-gradient-text">meaningful action.</span></h2>
            <p>Everything you need to make campus feedback more organized, visible, and actionable.</p>
          </div>

          <div className="cm-feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article className="cm-feature-card" key={feature.number}>
                  <div className="cm-feature-top">
                    <span className="cm-feature-icon"><Icon size={21} /></span>
                    <span className="cm-feature-number">{feature.number}</span>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                  <span className="cm-feature-line" />
                </article>
              );
            })}
          </div>
        </section>

        <section id="how-it-works" className="cm-process-section">
          <div className="cm-process-panel">
            <div className="cm-process-copy">
              <span className="cm-section-kicker">SIMPLE BY DESIGN</span>
              <h2>From concern<br />to <span className="cm-gradient-text">clear progress.</span></h2>
              <p>No complicated process. Just a clear path to share an issue and stay informed.</p>
              <Link to="/register" className="cm-text-link">Get started today <ArrowRight size={17} /></Link>
            </div>
            <div className="cm-steps">
              <div className="cm-step">
                <span className="cm-step-number">01</span>
                <div><h3>Sign in securely</h3><p>Access your portal with your account.</p></div>
                <CheckCircle2 size={19} />
              </div>
              <div className="cm-step">
                <span className="cm-step-number">02</span>
                <div><h3>Share the issue</h3><p>Describe your concern with the relevant details.</p></div>
                <MessageSquareText size={19} />
              </div>
              <div className="cm-step">
                <span className="cm-step-number">03</span>
                <div><h3>Follow the progress</h3><p>Check updates and see when action is taken.</p></div>
                <BarChart3 size={19} />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="cm-cta-section">
          <div className="cm-cta-spark"><Sparkles size={23} /></div>
          <span className="cm-section-kicker">YOUR CAMPUS, BETTER TOGETHER</span>
          <h2>Make your voice<br /><span className="cm-gradient-text">part of the solution.</span></h2>
          <p>Start with one concern. Help create a better campus experience.</p>
          <Link to="/register" className="cm-button">Join CampusMindAI <ArrowRight size={18} /></Link>
        </section>
      </main>

      <footer className="cm-footer">
        <div className="cm-footer-main">
          <Brand footer />
          <p>Thoughtful technology for a more connected campus community.</p>
          <div className="cm-footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <Link to="/login">Log in</Link>
            <Link to="/register">Create account</Link>
          </div>
        </div>
        <div className="cm-footer-bottom">
          <span>© {new Date().getFullYear()} CampusMindAI. Built for better campus experiences.</span>
          <span><span className="cm-live-dot" /> Designed for clarity. Built for progress.</span>
        </div>
      </footer>
    </div>
  );
}

