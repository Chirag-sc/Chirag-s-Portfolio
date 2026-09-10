'use client';
import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Download,
  Orbit,
  Copy,
  Check,
  MapPin,
  Code2,
  Network,
  Menu,
  X,
  ArrowRight,
  Layers,
  Users,
  GraduationCap,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { portfolio } from '@/lib/portfolio-data';
import { Switch } from '@/components/ui/switch';
import SpaceBackground from '@/components/scene/space-background';
import CredentialGallery from '@/components/credential-gallery';
import HorizonInspector from '@/components/horizon-inspector';
import JourneyNavigation from '@/components/journey-navigation';

function ProjectArtwork({ astronomy }: { astronomy: boolean }) {
  return astronomy ? (
    <div className="project-art astronomy-art">
      <div className="art-top mono">
        <span>BLACK HOLE AI</span>
        <span>IMAGE → MEASUREMENT</span>
      </div>
      <div className="analysis-diagram">
        <svg
          viewBox="0 0 520 300"
          role="img"
          aria-label="Conceptual radial profile and ring geometry diagram, not project output"
        >
          <defs>
            <radialGradient id="ring-gradient">
              <stop offset="48%" stopColor="#cf9c66" stopOpacity="0" />
              <stop offset="58%" stopColor="#e4b67c" stopOpacity=".45" />
              <stop offset="64%" stopColor="#f6d5a2" stopOpacity=".7" />
              <stop offset="72%" stopColor="#b47643" stopOpacity=".15" />
              <stop offset="82%" stopColor="#b47643" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="220" cy="142" r="117" fill="url(#ring-gradient)" />
          <g stroke="#a3c7df" fill="none" strokeWidth=".65">
            <circle cx="220" cy="142" r="76" strokeDasharray="3 6" />
            <circle cx="220" cy="142" r="109" opacity=".3" />
            <path d="M85 142H355M220 13V271" opacity=".3" />
            <path d="M220 142L290 68H392M220 142L330 209H407" />
            <path d="M92 249H174M92 249V214M92 244Q112 246 120 222Q127 192 135 222Q143 247 174 244" />
          </g>
          <g fill="#b8cdd8" fontSize="10" fontFamily="monospace">
            <text x="349" y="60">
              RING GEOMETRY
            </text>
            <text x="350" y="227">
              CENTROID
            </text>
            <text x="91" y="267">
              RADIAL PROFILE
            </text>
          </g>
          <circle cx="220" cy="142" r="3" fill="#dae7ee" />
        </svg>
      </div>
      <div className="art-bottom mono">
        <span>PYTHON / NUMPY / PYDANTIC</span>
        <span>CONCEPTUAL DIAGRAM</span>
      </div>
    </div>
  ) : (
    <div className="project-art academic-art">
      <div className="art-top mono">
        <span>ACAD-SYNC</span>
        <span>CONNECTED BY DESIGN</span>
      </div>
      <div className="workflow-diagram">
        <div className="role-nodes">
          <span>
            <GraduationCap />
            Students
          </span>
          <span>
            <Users />
            Parents
          </span>
          <span>
            <Layers />
            Teachers
          </span>
        </div>
        <div className="workflow-connectors" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="workflow-core">
          <ShieldCheck size={19} />
          <span>Role-based access</span>
          <Database size={18} />
        </div>
        <div className="workflow-modules">
          <span>Attendance</span>
          <span>Courses</span>
          <span>Reports</span>
        </div>
      </div>
      <div className="art-bottom mono">
        <span>ONE PLATFORM. THREE PERSPECTIVES.</span>
        <span>CONCEPTUAL WORKFLOW</span>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [reduced, setReduced] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const [inspectionLensing, setInspectionLensing] = useState(1);
  const [sceneAvailable, setSceneAvailable] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem('event-horizon-reduced');
      } catch {
        /* Preferences remain usable without storage. */
      }
      setReduced(media.matches || saved === 'true');
    };
    const updateScroll = () => setScrolled(window.scrollY > 50);
    updatePreference();
    updateScroll();
    media.addEventListener('change', updatePreference);
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => {
      media.removeEventListener('change', updatePreference);
      window.removeEventListener('scroll', updateScroll);
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.reduced = String(reduced);
  }, [reduced]);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(timer);
  }, [copied]);
  const toggleEffects = (value: boolean) => {
    setReduced(
      value || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
    try {
      localStorage.setItem('event-horizon-reduced', String(value));
    } catch {
      /* Optional preference persistence. */
    }
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(portfolio.email);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };
  return (
    <>
      <SpaceBackground
        reduced={reduced}
        inspecting={inspecting}
        lensing={inspectionLensing}
        onAvailabilityChange={setSceneAvailable}
      />
      <div
        className={`portfolio-interface ${inspecting ? 'interface-quiet' : ''}`}
      >
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
          <a className="brand" href="#home" aria-label="Chirag S home">
            <Orbit size={23} />
            <span>
              CHIRAG S<span className="brand-dot">.</span>
            </span>
          </a>
          <button
            className="mobile-menu-button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((v) => !v)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setMenuOpen(false);
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <JourneyNavigation
            open={menuOpen}
            paused={inspecting}
            onClose={() => setMenuOpen(false)}
          />
          <a className="header-contact" href={`mailto:${portfolio.email}`}>
            Let’s talk <ArrowUpRight size={16} />
          </a>
        </header>
        <main id="main" tabIndex={-1}>
          <section className="hero" id="home">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="signal" /> A PERSONAL UNIVERSE · PORTFOLIO 2026
              </p>
              <h1>
                <span className="name-first">CHIRAG</span>{' '}
                <span className="name-last">
                  S<span className="name-period">.</span>
                </span>
              </h1>
              <div className="horizon-rule" aria-hidden="true" />
              <p className="hero-role">
                Software Engineer <span>·</span> AI & Data Science
              </p>
              <p className="hero-description">
                I build intelligent software.
                <br />
                And keep looking up.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#projects">
                  Explore Projects <ArrowUpRight size={18} />
                </a>
                <a
                  className="button button-secondary"
                  href={portfolio.resume}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Resume <Download size={16} />
                </a>
              </div>
            </div>
            <div className="hero-note">
              <span className="eyebrow">AT THE EDGE OF THE KNOWABLE</span>
              <HorizonInspector
                open={inspecting}
                onOpenChange={setInspecting}
                lensing={inspectionLensing}
                onLensingChange={setInspectionLensing}
                available={sceneAvailable}
              />
            </div>
            <div className="hero-bottom">
              <a href="#about">
                <ArrowDown size={17} /> SCROLL TO EXPLORE
              </a>
              <span>BASED ON EARTH · MANGALORE, IN</span>
              <span>12.9141° N / 74.8560° E</span>
            </div>
          </section>
          <section className="section about" id="about">
            <div>
              <p className="section-index">01 / THE OBSERVER</p>
              <div className="observer-mark" aria-hidden="true">
                <Orbit strokeWidth={0.65} />
                <span>ALWAYS CURIOUS.</span>
              </div>
            </div>
            <div>
              <h2>
                Curiosity is
                <br />
                my starting point<span>.</span>
              </h2>
              <p className="lead">{portfolio.about}</p>
              <p>{portfolio.aboutMore}</p>
              <div className="about-location">
                <MapPin size={15} />
                {portfolio.location}
              </div>
            </div>
          </section>
          <section className="section projects" id="projects">
            <div className="section-heading">
              <div>
                <p className="section-index">02 / SELECTED MISSIONS</p>
                <h2>
                  Ideas into orbit<span>.</span>
                </h2>
              </div>
              <p>
                Two explorations. <br />
                One instinct to build.
              </p>
            </div>
            {portfolio.projects.map((project, index) => (
              <article className="project" key={project.id} id={project.id}>
                <div className="project-heading">
                  <div className="project-number mono">
                    MISSION {project.number}
                    <span>{project.category}</span>
                  </div>
                  <div className="project-title-row">
                    <h3>{project.title}</h3>
                    {project.status && (
                      <span className="status-badge">
                        <span />
                        {project.status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="project-overview">
                  <p className="project-subtitle">{project.subtitle}</p>
                  <p className="project-description">{project.description}</p>
                  <div className="tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <a
                    className="project-detail-link"
                    href={`#${project.id}-details`}
                  >
                    Explore the build <ArrowDown size={16} />
                  </a>
                </div>
                <ProjectArtwork astronomy={index === 0} />
                <div className="project-details" id={`${project.id}-details`}>
                  {project.details.map((detail, detailIndex) => (
                    <div key={detail.title}>
                      <p className="project-detail-label mono">
                        {index === 0
                          ? detailIndex === 0
                            ? 'ENGINEERING APPROACH'
                            : 'CURRENT PROGRESS'
                          : detailIndex === 0
                            ? 'THE PLATFORM'
                            : 'THE WORKFLOW'}
                      </p>
                      <h4>{detail.title}</h4>
                      <p>{detail.text}</p>
                    </div>
                  ))}
                  <p className="art-disclaimer">
                    {index === 0
                      ? 'Conceptual illustration. The portfolio’s decorative black hole renderer is separate from this project’s image-analysis capabilities.'
                      : 'Conceptual workflow diagram, not a product screenshot.'}
                  </p>
                </div>
              </article>
            ))}
          </section>
          <section className="section experience" id="experience">
            <div>
              <p className="section-index">03 / MISSION LOG</p>
              <h2>
                Built in the
                <br />
                real world<span>.</span>
              </h2>
            </div>
            <div className="timeline">
              <div className="timeline-meta mono">
                <span>{portfolio.experience.dates}</span>
                <span>{portfolio.experience.location}</span>
              </div>
              <h3>{portfolio.experience.company}</h3>
              <p className="experience-role">{portfolio.experience.role}</p>
              <ul>
                {portfolio.experience.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              <div className="tags">
                <span>Kotlin</span>
                <span>Jetpack Compose</span>
                <span>Google AI Studio</span>
                <span>Firebase</span>
              </div>
            </div>
          </section>
          <section className="section capabilities" id="skills">
            <div className="section-heading">
              <div>
                <p className="section-index">04 / CAPABILITIES</p>
                <h2>
                  Tools for the unknown<span>.</span>
                </h2>
              </div>
            </div>
            <div className="skills-grid">
              {portfolio.skills.map((group, index) => (
                <div className="skill-group" key={group.title}>
                  <div className="skill-heading">
                    <span className="mono">0{index + 1}</span>
                    <h3>{group.title}</h3>
                  </div>
                  <ul>
                    {group.items.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <section className="section education" id="education">
            <p className="section-index">05 / FOUNDATIONS</p>
            <div>
              <p className="mono education-date">{portfolio.education.dates}</p>
              <h2>{portfolio.education.degree}</h2>
              <div className="education-bottom">
                <p>{portfolio.education.school}</p>
                <span>{portfolio.education.score}</span>
              </div>
            </div>
          </section>
          <section className="section certificates" id="certificates">
            <div className="section-heading">
              <div>
                <p className="section-index">06 / CREDENTIALS ARCHIVE</p>
                <h2>
                  Always a student<span>.</span>
                </h2>
              </div>
              <p>
                Foundations, expanded. <br />
                Curiosity, continued.
              </p>
            </div>
            <CredentialGallery />
          </section>
          <section className="section contact" id="contact">
            <img
              className="contact-horizon"
              src="/space-inspect-desktop.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              width="1440"
              height="1000"
            />
            <p className="section-index">
              <span className="signal" />
              07 / OPEN A CHANNEL
            </p>
            <h2>
              Let’s build
              <br />
              <em>something.</em>
            </h2>
            <p className="contact-intro">
              Have something in mind? Let’s make it happen.
            </p>
            <a className="email-link" href={`mailto:${portfolio.email}`}>
              {portfolio.email}
              <ArrowUpRight />
            </a>
            <div className="contact-actions">
              <button className="copy-button" onClick={copyEmail}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Address copied' : 'Copy email address'}</span>
              </button>
              <div className="social-links">
                <a href={portfolio.github} target="_blank" rel="noreferrer">
                  <Code2 size={16} />
                  GitHub
                  <ArrowUpRight size={14} />
                </a>
                <a href={portfolio.linkedin} target="_blank" rel="noreferrer">
                  <Network size={16} />
                  LinkedIn
                  <ArrowUpRight size={14} />
                </a>
                <a href={portfolio.resume} target="_blank" rel="noreferrer">
                  <Download size={16} />
                  Resume
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
            <p role="status" aria-live="polite" className="copy-status">
              {copyError
                ? 'Copy is unavailable in this browser. Select the email address above to copy it.'
                : copied
                  ? 'Email address copied to clipboard.'
                  : ''}
            </p>
          </section>
        </main>
        <footer className="site-footer">
          <a className="brand" href="#home">
            <Orbit size={20} />
            <span>CHIRAG S.</span>
          </a>
          <p>© 2026 Chirag S · Made of curiosity.</p>
          <a href="#home">
            BACK TO THE TOP <ArrowRight size={15} />
          </a>
        </footer>
        <div className="effects-control">
          <Switch
            id="reduced-effects"
            aria-label="Reduced effects"
            checked={reduced}
            onCheckedChange={toggleEffects}
          />
          <label htmlFor="reduced-effects">Reduced effects</label>
        </div>
      </div>
    </>
  );
}
