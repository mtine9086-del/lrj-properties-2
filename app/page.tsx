'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Home, MapPin, Menu, Phone, Search, ShieldCheck, Sparkles, X } from 'lucide-react';

const properties = [
  { title: 'Residential Plot — Laksar', type: 'Plot', location: 'Laksar, Haridwar', size: '1,200 sq ft', price: 'Contact for price' },
  { title: 'Family Home — Roorkee Road', type: 'House', location: 'Laksar, Haridwar', size: '1,650 sq ft', price: 'Contact for price' },
  { title: 'Agricultural Land — Nearby', type: 'Land', location: 'Haridwar District', size: '1 Bigha+', price: 'Contact for price' },
];

const services = ['Residential Plots', 'Independent Houses', 'Agricultural Land', 'Property Guidance'];

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => properties.filter(p => `${p.title} ${p.location} ${p.type}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return <main>
    <header className="nav"><a href="#top" className="brand"><span className="brandMark"><Home size={18}/></span><span>LRJ <b>PROPERTIES</b></span></a><nav className={open ? 'navLinks open' : 'navLinks'}><a href="#properties" onClick={()=>setOpen(false)}>Properties</a><a href="#services" onClick={()=>setOpen(false)}>Services</a><a href="#about" onClick={()=>setOpen(false)}>About</a><a href="#contact" onClick={()=>setOpen(false)}>Contact</a></nav><a className="navCta" href="tel:+919876543210"><Phone size={16}/> Call</a><button className="menu" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X/>:<Menu/>}</button></header>

    <section id="top" className="hero"><div className="heroGlow"/><div className="heroGrid"/><div className="heroContent"><div className="eyebrow"><Sparkles size={15}/> LOCAL PROPERTY • LAKSAR / HARIDWAR</div><h1>Find a place that<br/><em>feels like home.</em></h1><p>Practical property guidance for plots, homes and land around Laksar and Haridwar — with a local-first approach.</p><div className="heroActions"><a className="primary" href="#properties">Explore properties <ArrowRight size={17}/></a><a className="secondary" href="https://wa.me/919876543210">WhatsApp us</a></div><div className="trust"><span><CheckCircle2/> Local guidance</span><span><ShieldCheck/> Clear communication</span></div></div><div className="heroVisual"><div className="orb orb1"/><div className="orb orb2"/><div className="houseCard"><div className="miniHouse"><div className="roof"/><div className="houseBody"><i/><i/><i/></div></div><span>Property search</span><strong>Laksar • Haridwar</strong></div></div></section>

    <section className="strip">{services.map(s=><div key={s}>{s}<span>•</span></div>)}</section>

    <section id="properties" className="section"><div className="sectionHead"><div><span className="kicker">CURRENT OPTIONS</span><h2>Explore local properties</h2></div><div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search property..."/></div></div><div className="cards">{filtered.map((p,i)=><article className="card" key={p.title}><div className={`propertyVisual v${i}`}><span>{p.type}</span><div className="landscape"><div className="sun"/><div className="hill h1"/><div className="hill h2"/><div className="plotHouse"/></div></div><div className="cardBody"><span className="location"><MapPin size={14}/>{p.location}</span><h3>{p.title}</h3><p>{p.size}</p><div className="cardFoot"><strong>{p.price}</strong><a href="#contact">Enquire <ArrowRight size={15}/></a></div></div></article>)}</div>{!filtered.length&&<p className="empty">No matching property found. Call us for more options.</p>}</section>

    <section id="services" className="darkSection"><div className="kicker">WHAT WE DO</div><h2>Simple property help,<br/><em>without the confusion.</em></h2><div className="serviceGrid">{services.map((s,i)=><div className="service" key={s}><span>0{i+1}</span><h3>{s}</h3><p>Local information, practical guidance and a straightforward way to move from enquiry to property visit.</p></div>)}</div></section>

    <section id="about" className="about"><div className="aboutVisual"><div className="mapLines"/><div className="pin"><MapPin/></div><span>LAKSAR</span></div><div className="aboutText"><span className="kicker">ABOUT LRJ</span><h2>A local approach to finding the right property.</h2><p>We focus on useful information, honest communication and properties that make sense for everyday buyers, families and land investors.</p><div className="checks"><span><CheckCircle2/> Local area focus</span><span><CheckCircle2/> Property guidance</span><span><CheckCircle2/> Visit coordination</span></div></div></section>

    <section id="contact" className="contact"><div><span className="kicker">LET'S TALK</span><h2>Have a property in mind?</h2><p>Call or WhatsApp directly. No account, app, API or lead database is required.</p></div><div className="contactActions"><a className="primary" href="tel:+919876543210"><Phone size={17}/> Call now</a><a className="secondary light" href="https://wa.me/919876543210">WhatsApp</a></div></section>

    <footer><div className="brand"><span className="brandMark"><Home size={17}/></span><span>LRJ <b>PROPERTIES</b></span></div><p>© 2026 LRJ Properties. Local property guidance in Laksar & Haridwar.</p></footer>
  </main>;
}
