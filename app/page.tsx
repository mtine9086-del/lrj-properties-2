"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  MapPin,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import InquiryForm from "./components/InquiryForm";
import OrbitGallery from "./components/OrbitGallery";

const phone = "+919876543210";
const wa = "https://wa.me/919876543210?text=Hi%20I'm%20interested%20in%20a%20property%20on%20LRJ%20Properties.";
const privacyUrl = "/lrj-properties-2/privacy/";

const heroImage1 = "/lrj-properties-2/visuals/hero-1.svg";
const heroImage2 = "/lrj-properties-2/visuals/hero-2.svg";
const heroImage3 = "/lrj-properties-2/visuals/hero-3.svg";

const slides = [
  { image: heroImage1, title: "Find Your Dream Property", accent: "in Laksar", text: "Buy, sell, or rent — houses, plots, flats, and commercial spaces. Your trusted local real estate partner in Haridwar, Uttarakhand." },
  { image: heroImage2, title: "Invest in Your Future", accent: "with Confidence", text: "Prime residential plots and ready-to-move houses in the best localities of Laksar and Haridwar." },
  { image: heroImage3, title: "A Better Place to", accent: "Call Home", text: "Explore practical homes, land and local property opportunities with straightforward guidance." },
  { image: heroImage1, title: "Sell or Rent", accent: "Your Property", text: "List your property with us and connect directly with local buyers and tenants." },
];

const props = [
  ["Residential Plot", "Residential Plot — Laksar", "Laksar, Haridwar", "1,200 sq ft", heroImage1],
  ["Independent House", "Family Home — Roorkee Road", "Laksar, Haridwar", "1,650 sq ft", heroImage2],
  ["Agricultural Land", "Agricultural Land — Nearby", "Haridwar District", "1 Bigha+", heroImage3],
];

const orbitImages = [heroImage1, heroImage2, heroImage3, heroImage1, heroImage2, heroImage3];

const services = [
  ["Buy Property", "Find your home, plot, land or commercial space from practical local options."],
  ["Sell Property", "Present your property clearly and connect with serious local buyers."],
  ["Rent Property", "Explore houses, flats and shops around Laksar and Haridwar."],
  ["Property Guidance", "Straightforward help with visits, documentation and local information."],
];

function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add("revealed");
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const propertiesRef = useReveal();
  const aboutRef = useReveal();
  const servicesRef = useReveal();
  const testimonialsRef = useReveal();

  const shownProperties = useMemo(() => props.filter((property) => property.join(" ").toLowerCase().includes(query.trim().toLowerCase())), [query]);

  const resetTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setSlide((current) => (current + 1) % slides.length), 5000);
  };

  useEffect(() => {
    resetTimer();
    const handleMouseMove = (event: MouseEvent) => setMouse({ x: event.clientX, y: event.clientY });
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      if (timer.current) clearInterval(timer.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const goToSlide = (nextSlide: number) => {
    setSlide((nextSlide + slides.length) % slides.length);
    resetTimer();
  };
  const activeSlide = slides[slide];

  return (
    <main id="top">
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      <div className={`cursor-dot ${hovering ? "hovering" : ""}`} style={{ left: mouse.x, top: mouse.y }} />
      <div className={`cursor-ring ${hovering ? "hovering" : ""}`} style={{ left: mouse.x, top: mouse.y }} />
      <div className="cursorGlow" style={{ left: mouse.x, top: mouse.y }} />

      <header className="nav">
        <a className="brand" href="#top" aria-label="LRJ Properties home"><span className="brandMark"><Home size={18} /></span><span>LRJ <b>PROPERTIES</b></span></a>
        <nav className={menuOpen ? "navLinks open" : "navLinks"} aria-label="Primary navigation">
          {["properties", "services", "about", "testimonials", "contact"].map((item) => <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>{item[0].toUpperCase() + item.slice(1)}</a>)}
        </nav>
        <a className="navCta" href={`tel:${phone}`}><Phone size={16} /> Call</a>
        <button className="menu" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero heroSlider" onWheel={(event) => { if (Math.abs(event.deltaY) > 45) goToSlide(slide + (event.deltaY > 0 ? 1 : -1)); }}>
        {slides.map((item, index) => <div key={`${item.image}-${index}`} className={`heroBackdropLayer ${index === slide ? "active" : ""}`}><div className="heroBackdrop" style={{ backgroundImage: `url(${item.image})`, transform: `translate3d(${mouse.x * 0.01}px,${mouse.y * 0.006}px,0) scale(1.08)` }} /></div>)}
        <div className="heroShade" /><div className="heroGrid" /><div className="heroGlow" />
        <div className="heroParticles">{Array.from({ length: 14 }).map((_, index) => <i key={index} style={{ left: `${index * 7 + 5}%`, animationDelay: `-${index * 0.5}s` }} />)}</div>
        <div className="heroContent slideIn" key={slide}>
          <div className="eyebrow"><Sparkles size={14} />LOCAL PROPERTY • LAKSAR / HARIDWAR</div>
          <h1>{activeSlide.title}<br /><em>{activeSlide.accent}</em></h1><p>{activeSlide.text}</p>
          <div className="heroActions"><a className="primary" href="#properties">Explore properties <ArrowRight size={17} /></a><a className="secondary" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp us</a></div>
          <div className="trust"><span><CheckCircle2 /> Local guidance</span><span><ShieldCheck /> Clear communication</span></div>
        </div>
        <div className="heroVisual"><div className="visualFrame"><img src={activeSlide.image} alt="Local property" /><div className="visualLabel"><small>0{slide + 1} / 04</small><strong>LOCAL PROPERTY</strong></div></div><div className="parallaxCard"><span>Property search</span><strong>Laksar • Haridwar</strong><i>Local-first</i></div></div>
        <div className="verticalPager" aria-label="Hero slides">{slides.map((_, index) => <button key={index} type="button" aria-label={`Show slide ${index + 1}`} className={index === slide ? "active" : ""} onClick={() => goToSlide(index)}><span>0{index + 1}</span></button>)}</div>
        <div className="heroScroll">⌄ DRAG / SCROLL TO EXPLORE</div><div className="heroProgress"><div key={slide} /></div>
      </section>

      <section className="strip marquee" aria-label="Property categories"><div className="marqueeTrack">{["🏠 Houses", "📐 Residential Plots", "🌾 Agricultural Land", "🏢 Commercial Spaces", "📍 Laksar", "📍 Haridwar", "📍 Roorkee", "🤝 Local Guidance", "📋 Documentation", "🔐 Clear Dealings", "🏠 Houses", "📐 Residential Plots"].map((item, index) => <div key={index}>{item}<span>✦</span></div>)}</div></section>

      <section className="orbitSection" aria-label="Property highlights">
        <span className="kicker">A CLOSER LOOK</span>
        <h2>Everything we work with,<br /><em>orbiting one idea: home.</em></h2>
        <div className="orbitStage"><OrbitGallery images={orbitImages} /></div>
      </section>

      <section id="properties" className="section revealSection" ref={propertiesRef}>
        <div className="sectionHead"><div><span className="kicker">CURRENT OPTIONS</span><h2>Explore local <em>properties</em></h2></div><div className="search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search property..." aria-label="Search properties" /></div></div>
        <div className="cards">{shownProperties.length ? shownProperties.map((property, index) => <article className="card tilt-card revealCard" key={property[1]}><div className={`propertyVisual v${index % 3}`}><span>{property[0]}</span><img src={property[4]} alt={property[1]} loading="lazy" /></div><div className="cardBody"><span className="location"><MapPin size={14} />{property[2]}</span><h3>{property[1]}</h3><p>{property[3]}</p><div className="cardFoot"><strong>Contact for price</strong><a href="#inquiry">Enquire <ArrowRight size={15} /></a></div></div></article>) : <div className="empty">No matching property found. Try another search or send us an inquiry.</div>}</div>
      </section>

      <section id="about" className="about revealSection" ref={aboutRef}><div className="aboutVisual"><div className="mapLines" /><div className="pin"><MapPin /></div><span>LAKSAR • HARIDWAR</span><div className="mapLabel">LOCAL MARKET FOCUS</div></div><div className="aboutText"><span className="kicker">ABOUT LRJ</span><h2>A local approach to finding the <em>right property</em>.</h2><p>We focus on useful information, honest communication and properties that make sense for everyday buyers, families and land investors.</p><div className="checks"><span><CheckCircle2 /> Local area focus</span><span><CheckCircle2 /> Property guidance</span><span><CheckCircle2 /> Visit coordination</span></div></div></section>

      <section id="services" className="darkSection revealSection" ref={servicesRef}><div className="kicker">WHAT WE DO</div><h2>Simple property help,<br /><em>without the confusion.</em></h2><div className="serviceGrid">{services.map((service, index) => <div className="service" key={service[0]}><span>0{index + 1}</span><h3>{service[0]}</h3><p>{service[1]}</p><ArrowRight className="serviceArrow" size={18} /></div>)}</div></section>

      <section id="testimonials" className="section revealSection" ref={testimonialsRef}><div className="sectionHead"><div><span className="kicker">CLIENT FEEDBACK</span><h2>Hear from our <em>clients</em></h2></div></div><div className="cards"><article className="card"><div className="cardBody"><p>Client feedback will be published here after verified customer permission is received.</p><div className="location"><ShieldCheck size={14} /> Verified feedback only</div></div></article><article className="card"><div className="cardBody"><p>We do not publish a person&apos;s name or testimonial without appropriate permission.</p><div className="location"><ShieldCheck size={14} /> Privacy-first</div></div></article></div></section>

      <section id="contact" className="contact revealSection"><div><span className="kicker">LET&apos;S TALK</span><h2>Have a <em>property</em> in mind?</h2><p>Call or WhatsApp directly, or send us a property inquiry and we&apos;ll follow up.</p></div><div className="contactActions"><a className="primary" href={`tel:${phone}`}><Phone size={17} /> Call now</a><a className="secondary" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a></div></section>
      <section id="inquiry" className="inquirySection"><InquiryForm /></section>

      <div className="floating"><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">↑</button><a href={`tel:${phone}`} aria-label="Call LRJ Properties">☎</a><a href={wa} target="_blank" rel="noopener noreferrer" className="wa" aria-label="WhatsApp LRJ Properties">◔</a></div>
      <footer><div className="brand"><span className="brandMark"><Home size={17} /></span><span>LRJ <b>PROPERTIES</b></span></div><div><p>© 2026 LRJ Properties · Laksar & Haridwar</p><a href={privacyUrl}>Privacy Notice</a></div></footer>
    </main>
  );
}
