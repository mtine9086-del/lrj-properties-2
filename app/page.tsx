'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, CheckCircle2, Home, MapPin, Menu, Phone, Search, ShieldCheck, Sparkles, X } from 'lucide-react';

const properties = [
  { title: 'Residential Plot — Laksar', type: 'Plot', location: 'Laksar, Haridwar', size: '1,200 sq ft', price: 'Contact for price', visual: 'v0' },
  { title: 'Family Home — Roorkee Road', type: 'House', location: 'Laksar, Haridwar', size: '1,650 sq ft', price: 'Contact for price', visual: 'v1' },
  { title: 'Agricultural Land — Nearby', type: 'Land', location: 'Haridwar District', size: '1 Bigha+', price: 'Contact for price', visual: 'v2' },
];

const services = ['Residential Plots', 'Independent Houses', 'Agricultural Land', 'Property Guidance'];
const heroSlides = [
  { eyebrow: 'LOCAL PROPERTY • LAKSAR / HARIDWAR', title: <>Find a place that<br/><em>feels like home.</em></>, text: 'Practical property guidance for plots, homes and land around Laksar and Haridwar — with a local-first approach.', image: '/lrj-properties-2/visuals/hero-1.svg', tag: 'LOCAL LANDSCAPES' },
  { eyebrow: 'PLOTS • HOMES • LAND', title: <>Move closer to<br/><em>the right place.</em></>, text: 'Explore everyday homes, residential plots and nearby land with clear local guidance.', image: '/lrj-properties-2/visuals/hero-2.svg', tag: 'PROPERTY SEARCH' },
  { eyebrow: 'LAKSAR • ROORKEE • HARIDWAR', title: <>Property choices<br/><em>made simpler.</em></>, text: 'A straightforward way to discover options, ask questions and arrange a property visit.', image: '/lrj-properties-2/visuals/hero-3.svg', tag: 'LOCAL CONNECTIONS' },
];

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [slide, setSlide] = useState(0);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const filtered = useMemo(() => properties.filter(p => `${p.title} ${p.location} ${p.type}`.toLowerCase().includes(query.toLowerCase())), [query]);

  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    const timer = window.setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 6500);
    return () => { window.removeEventListener('mousemove', move); window.clearInterval(timer); };
  }, []);

  useEffect(() => {
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 20) return;
      const target = e.deltaY > 0 ? (slide + 1) % heroSlides.length : (slide - 1 + heroSlides.length) % heroSlides.length;
      setSlide(target);
    };
    window.addEventListener('wheel', wheel, { passive: true });
    return () => window.removeEventListener('wheel', wheel);
  }, [slide]);

  const active = heroSlides[slide];
  return <main>
    <div className="cursorGlow" style={{ transform: `translate3d(${cursor.x - 180}px,${cursor.y - 180}px,0)` }} />
    <header className="nav"><a href="#top" className="brand"><span className="brandMark"><Home size={18}/></span><span>LRJ <b>PROPERTIES</b></span></a><nav className={open ? 'navLinks open' : 'navLinks'}><a href="#properties" onClick={()=>setOpen(false)}>Properties</a><a href="#services" onClick={()=>setOpen(false)}>Services</a><a href="#about" onClick={()=>setOpen(false)}>About</a><a href="#contact" onClick={()=>setOpen(false)}>Contact</a></nav><a className="navCta" href="tel:+919876543210"><Phone size={16}/> Call</a><button className="menu" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X/>:<Menu/>}</button></header>

    <section id="top" className="hero heroSlider">
      <div className="heroBackdrop" style={{ backgroundImage: `url(${active.image})`, transform: `translate3d(${(cursor.x / Math.max(window.innerWidth, 1) - .5) * -18}px,${(cursor.y / Math.max(window.innerHeight, 1) - .5) * -12}px,0) scale(1.08)` }} />
      <div className="heroShade"/><div className="heroGrid"/><div className="heroGlow"/>
      <div className="heroContent slideIn" key={slide}><div className="eyebrow"><Sparkles size={15}/> {active.eyebrow}</div><h1>{active.title}</h1><p>{active.text}</p><div className="heroActions"><a className="primary" href="#properties">Explore properties <ArrowRight size={17}/></a><a className="secondary" href="https://wa.me/919876543210">WhatsApp us</a></div><div className="trust"><span><CheckCircle2/> Local guidance</span><span><ShieldCheck/> Clear communication</span></div></div>
      <div className="heroVisual" key={`visual-${slide}`}><div className="visualFrame"><img src={active.image} alt="Local property landscape"/><div className="visualLabel"><small>01 / 03</small><strong>{active.tag}</strong></div></div><div className="parallaxCard"><span>Property search</span><strong>Laksar • Haridwar</strong><i>Local-first</i></div></div>
      <div className="verticalPager">{heroSlides.map((_,i)=><button key={i} className={i===slide?'active':''} onClick={()=>setSlide(i)} aria-label={`Slide ${i+1}`}><span>0{i+1}</span></button>)}</div>
      <div className="heroScroll"><ArrowDown size={15}/> SCROLL TO EXPLORE</div>
    </section>

    <section className="strip marquee"><div className="marqueeTrack">{[...services,...services].map((s,i)=><div key={`${s}-${i}`}>{s}<span>✦</span></div>)}</div></section>

    <section id="properties" className="section"><div className="sectionHead"><div><span className="kicker">CURRENT OPTIONS</span><h2>Explore local properties</h2></div><div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search property..."/></div></div><div className="cards">{filtered.map((p,i)=><article className="card revealCard" key={p.title}><div className={`propertyVisual ${p.visual}`}><span>{p.type}</span><div className="landscape"><div className="sun"/><div className="hill h1"/><div className="hill h2"/><div className="plotHouse"/></div></div><div className="cardBody"><span className="location"><MapPin size={14}/>{p.location}</span><h3>{p.title}</h3><p>{p.size}</p><div className="cardFoot"><strong>{p.price}</strong><a href="#contact">Enquire <ArrowRight size={15}/></a></div></div></article>)}</div>{!filtered.length&&<p className="empty">No matching property found. Call us for more options.</p>}</section>

    <section id="services" className="darkSection"><div className="kicker">WHAT WE DO</div><h2>Simple property help,<br/><em>without the confusion.</em></h2><div className="serviceGrid">{services.map((s,i)=><div className="service" key={s}><span>0{i+1}</span><h3>{s}</h3><p>Local information, practical guidance and a straightforward way to move from enquiry to property visit.</p></div>)}</div></section>
    <section id="about" className="about"><div className="aboutVisual"><div className="mapLines"/><div className="pin"><MapPin/></div><span>LAKSAR</span></div><div className="aboutText"><span className="kicker">ABOUT LRJ</span><h2>A local approach to finding the right property.</h2><p>We focus on useful information, honest communication and properties that make sense for everyday buyers, families and land investors.</p><div className="checks"><span><CheckCircle2/> Local area focus</span><span><CheckCircle2/> Property guidance</span><span><CheckCircle2/> Visit coordination</span></div></div></section>
    <section id="contact" className="contact"><div><span className="kicker">LET'S TALK</span><h2>Have a property in mind?</h2><p>Call or WhatsApp directly. No account, app, API or lead database is required.</p></div><div className="contactActions"><a className="primary" href="tel:+919876543210"><Phone size={17}/> Call now</a><a className="secondary light" href="https://wa.me/919876543210">WhatsApp</a></div></section>
    <footer><div className="brand"><span className="brandMark"><Home size={17}/></span><span>LRJ <b>PROPERTIES</b></span></div><p>© 2026 LRJ Properties. Local property guidance in Laksar & Haridwar.</p></footer>
  </main>;
}
