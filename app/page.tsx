'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, CheckCircle2, Home, MapPin, Menu, MousePointer2, Phone, Search, ShieldCheck, Sparkles, X } from 'lucide-react';

const PHONE = '+919876543210';
const WHATSAPP = `https://wa.me/${PHONE.replace('+', '')}`;
const properties = [
  { title: 'Residential Plot — Laksar', type: 'Plot', location: 'Laksar, Haridwar', size: '1,200 sq ft', price: 'Contact for price', visual: 'v0' },
  { title: 'Family Home — Roorkee Road', type: 'House', location: 'Laksar, Haridwar', size: '1,650 sq ft', price: 'Contact for price', visual: 'v1' },
  { title: 'Agricultural Land — Nearby', type: 'Land', location: 'Haridwar District', size: '1 Bigha+', price: 'Contact for price', visual: 'v2' },
];
const services = ['Residential Plots', 'Independent Houses', 'Agricultural Land', 'Property Guidance'];
const heroSlides = [
  { eyebrow: 'LOCAL PROPERTY • LAKSAR / HARIDWAR', title: <>Find a place that<br /><em>feels like home.</em></>, text: 'Practical property guidance for plots, homes and land around Laksar and Haridwar — with a local-first approach.', image: '/lrj-properties-2/visuals/hero-1.svg', tag: 'LOCAL LANDSCAPES' },
  { eyebrow: 'PLOTS • HOMES • LAND', title: <>Move closer to<br /><em>the right place.</em></>, text: 'Explore everyday homes, residential plots and nearby land with clear local guidance.', image: '/lrj-properties-2/visuals/hero-2.svg', tag: 'PROPERTY SEARCH' },
  { eyebrow: 'LAKSAR • ROORKEE • HARIDWAR', title: <>Property choices<br /><em>made simpler.</em></>, text: 'A straightforward way to discover options, ask questions and arrange a property visit.', image: '/lrj-properties-2/visuals/hero-3.svg', tag: 'LOCAL CONNECTIONS' },
];

function useReveal(delay = 0) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) { el.classList.add('revealed'); observer.unobserve(el); }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return ref;
}

function useTilt(maxDeg = 7) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: none)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-y * maxDeg).toFixed(2)}deg) rotateY(${(x * maxDeg).toFixed(2)}deg) translateY(-7px) scale(1.015)`;
    };
    const leave = () => { el.style.transform = ''; };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); };
  }, [maxDeg]);
  return ref;
}

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [slide, setSlide] = useState(0);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [cursorHot, setCursorHot] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const propertyRef = useReveal();
  const serviceRef = useReveal(80);
  const aboutRef = useReveal(120);
  const contactRef = useReveal(160);
  const tiltA = useTilt(6);
  const tiltB = useTilt(6);
  const tiltC = useTilt(6);
  const filtered = useMemo(() => properties.filter((p) => `${p.title} ${p.location} ${p.type}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const goTo = useCallback((index: number) => setSlide((index + heroSlides.length) % heroSlides.length), []);
  const restartSlider = useCallback(() => {
    if (slideTimer.current) clearInterval(slideTimer.current);
    slideTimer.current = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6500);
  }, []);

  useEffect(() => {
    const hasHover = window.matchMedia('(hover: hover)').matches;
    const move = (e: MouseEvent) => { if (hasHover) setCursor({ x: e.clientX, y: e.clientY }); };
    const scroll = () => { const max = document.documentElement.scrollHeight - window.innerHeight; setScrollProgress(max > 0 ? (window.scrollY / max) * 100 : 0); };
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    scroll();
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('scroll', scroll); };
  }, []);
  useEffect(() => { restartSlider(); return () => { if (slideTimer.current) clearInterval(slideTimer.current); }; }, [restartSlider]);
  const selectSlide = (index: number) => { goTo(index); restartSlider(); };
  const active = heroSlides[slide];

  return (
    <main id="top">
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      <div className={`cursor-dot ${cursorHot ? 'hovering' : ''}`} style={{ left: cursor.x, top: cursor.y }} />
      <div className={`cursor-ring ${cursorHot ? 'hovering' : ''}`} style={{ left: cursor.x, top: cursor.y }} />
      <div className="cursorGlow" style={{ left: cursor.x, top: cursor.y }} />

      <header className="nav">
        <a href="#top" className="brand interactive" onMouseEnter={() => setCursorHot(true)} onMouseLeave={() => setCursorHot(false)}><span className="brandMark"><Home size={18} /></span><span>LRJ <b>PROPERTIES</b></span></a>
        <nav className={open ? 'navLinks open' : 'navLinks'}>{['properties', 'services', 'about', 'contact'].map((id) => <a key={id} className="interactive" href={`#${id}`} onClick={() => setOpen(false)} onMouseEnter={() => setCursorHot(true)} onMouseLeave={() => setCursorHot(false)}>{id[0].toUpperCase() + id.slice(1)}</a>)}</nav>
        <a className="navCta interactive" href={`tel:${PHONE}`} onMouseEnter={() => setCursorHot(true)} onMouseLeave={() => setCursorHot(false)}><Phone size={16} /> Call</a>
        <button className="menu interactive" onClick={() => setOpen(!open)} aria-label="Menu" onMouseEnter={() => setCursorHot(true)} onMouseLeave={() => setCursorHot(false)}>{open ? <X /> : <Menu />}</button>
      </header>

      <section id="home" className="hero heroSlider" aria-roledescription="carousel" aria-label="Property showcase" onWheel={(e) => { if (Math.abs(e.deltaY) > 45) selectSlide(slide + (e.deltaY > 0 ? 1 : -1)); }} onTouchStart={(e) => setTouchStart(e.touches[0].clientY)} onTouchEnd={(e) => { if (touchStart === null) return; const delta = touchStart - e.changedTouches[0].clientY; if (Math.abs(delta) > 55) selectSlide(slide + (delta > 0 ? 1 : -1)); setTouchStart(null); }}>
        {heroSlides.map((s, i) => <div key={s.image} className={`heroBackdropLayer ${i === slide ? 'active' : ''}`} aria-hidden={i !== slide}><div className="heroBackdrop" style={{ backgroundImage: `url(${s.image})`, transform: `translate3d(${cursor.x * 0.012 - 8}px, ${cursor.y * 0.008 - 6}px, 0) scale(1.08)` }} /></div>)}
        <div className="heroShade" /><div className="heroGrid" /><div className="heroGlow" />
        <div className="heroParticles" aria-hidden="true">{Array.from({ length: 10 }).map((_, i) => <i key={i} style={{ left: `${8 + i * 9}%`, animationDelay: `${i * -0.8}s` }} />)}</div>
        <div className="heroContent slideIn" key={`text-${slide}`}>
          <div className="eyebrow"><Sparkles size={15} />{active.eyebrow}</div><h1>{active.title}</h1><p>{active.text}</p>
          <div className="heroActions"><a className="primary btn-magnetic interactive" href="#properties" onMouseEnter={() => setCursorHot(true)} onMouseLeave={() => setCursorHot(false)}>Explore properties <ArrowRight size={17} /></a><a className="secondary interactive" href={WHATSAPP} target="_blank" rel="noreferrer" onMouseEnter={() => setCursorHot(true)} onMouseLeave={() => setCursorHot(false)}>WhatsApp us</a></div>
          <div className="trust"><span><CheckCircle2 /> Local guidance</span><span><ShieldCheck /> Clear communication</span></div>
        </div>
        <div className="heroVisual" key={`visual-${slide}`}><div className="visualFrame"><img src={active.image} alt="Local property landscape" /><div className="visualLabel"><small>0{slide + 1} / 03</small><strong>{active.tag}</strong></div></div><div className="parallaxCard"><span>Property search</span><strong>Laksar • Haridwar</strong><i>Local-first</i></div></div>
        <div className="verticalPager">{heroSlides.map((_, i) => <button key={i} className={`interactive ${i === slide ? 'active' : ''}`} onClick={() => selectSlide(i)} aria-label={`Go to slide ${i + 1}`}><span>0{i + 1}</span></button>)}</div>
        <div className="heroScroll"><MousePointer2 size={14} /> DRAG / SCROLL TO EXPLORE</div><div className="heroProgress"><div key={slide} /></div>
      </section>

      <section className="strip marquee" aria-label="Property categories"><div className="marqueeTrack">{[...services, ...services].map((s, i) => <div key={`${s}-${i}`}>{s}<span>✦</span></div>)}</div></section>

      <section id="properties" className="section revealSection" ref={propertyRef as React.RefObject<HTMLElement>}>
        <div className="sectionHead"><div><span className="kicker">CURRENT OPTIONS</span><h2>Explore local properties</h2></div><div className="search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search property..." aria-label="Search properties" /></div></div>
        <div className="cards">{filtered.map((p, i) => { const ref = [tiltA, tiltB, tiltC][i] || tiltA; return <article ref={ref as React.RefObject<HTMLElement>} className="card revealCard tilt-card" key={p.title} style={{ transitionDelay: `${i * 80}ms` }}><div className={`propertyVisual ${p.visual}`}><span>{p.type}</span><div className="landscape"><div className="sun" /><div className="hill h1" /><div className="hill h2" /><div className="plotHouse" /></div></div><div className="cardBody"><span className="location"><MapPin size={14} />{p.location}</span><h3>{p.title}</h3><p>{p.size}</p><div className="cardFoot"><strong>{p.price}</strong><a href="#contact" className="interactive" onMouseEnter={() => setCursorHot(true)} onMouseLeave={() => setCursorHot(false)}>Enquire <ArrowRight size={15} /></a></div></div></article>; })}</div>
        {!filtered.length && <p className="empty">No matching property found. Call us for more options.</p>}
      </section>

      <section id="services" className="darkSection revealSection" ref={serviceRef as React.RefObject<HTMLElement>}><div className="kicker">WHAT WE DO</div><h2>Simple property help,<br /><em>without the confusion.</em></h2><div className="serviceGrid">{services.map((s, i) => <div className="service" key={s}><span>0{i + 1}</span><h3>{s}</h3><p>Local information, practical guidance and a straightforward way to move from enquiry to property visit.</p><ArrowRight className="serviceArrow" size={18} /></div>)}</div></section>

      <section id="about" className="about revealSection" ref={aboutRef as React.RefObject<HTMLElement>}><div className="aboutVisual"><div className="mapLines" /><div className="pin"><MapPin /></div><span>LAKSAR • HARIDWAR</span><div className="mapLabel">LOCAL MARKET FOCUS</div></div><div className="aboutText"><span className="kicker">ABOUT LRJ</span><h2>A local approach to finding the right property.</h2><p>We focus on useful information, honest communication and properties that make sense for everyday buyers, families and land investors.</p><div className="checks"><span><CheckCircle2 /> Local area focus</span><span><CheckCircle2 /> Property guidance</span><span><CheckCircle2 /> Visit coordination</span></div></div></section>

      <section id="contact" className="contact revealSection" ref={contactRef as React.RefObject<HTMLElement>}><div><span className="kicker">LET&apos;S TALK</span><h2>Have a property in mind?</h2><p>Call or WhatsApp directly. No account, app, API or lead database is required.</p></div><div className="contactActions"><a className="primary interactive" href={`tel:${PHONE}`} onMouseEnter={() => setCursorHot(true)} onMouseLeave={() => setCursorHot(false)}><Phone size={17} /> Call now</a><a className="secondary light interactive" href={WHATSAPP} target="_blank" rel="noreferrer" onMouseEnter={() => setCursorHot(true)} onMouseLeave={() => setCursorHot(false)}>WhatsApp</a></div></section>

      <footer><div className="brand"><span className="brandMark"><Home size={17} /></span><span>LRJ <b>PROPERTIES</b></span></div><p>© 2026 LRJ Properties. Local property guidance in Laksar & Haridwar.</p></footer>
    </main>
  );
}
