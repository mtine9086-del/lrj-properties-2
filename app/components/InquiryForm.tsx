"use client";

import {FormEvent, useState} from "react";
import {CheckCircle2, Loader2, Send} from "lucide-react";
import styles from "./InquiryForm.module.css";

const API_URL = "https://laksarproperties-api.mtine9086.workers.dev/";

export default function InquiryForm() {
  const [form, setForm] = useState({name:"",phone:"",email:"",property_interest:"",location:"",budget:"",message:""});
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [error, setError] = useState("");
  const update = (key:keyof typeof form,value:string) => setForm((current)=>({...current,[key]:value}));
  const submit = async (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setStatus("loading"); setError("");
    try {
      const response=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const result=await response.json();
      if(!response.ok||!result.success) throw new Error(result.message||"Unable to submit your inquiry.");
      setStatus("success"); setForm({name:"",phone:"",email:"",property_interest:"",location:"",budget:"",message:""});
    } catch(err) { setStatus("error"); setError(err instanceof Error?err.message:"Something went wrong. Please try again."); }
  };
  return <div className={styles.wrap}>
    <div className={styles.intro}>
      <span className="kicker">PROPERTY INQUIRY</span><h2>Tell us what you&apos;re looking for.</h2>
      <p>Share a few details and our local property team can get back to you about suitable options in Laksar, Haridwar and nearby areas.</p>
      <div className={styles.trust}><span><CheckCircle2 size={15}/> Local property guidance</span><span><CheckCircle2 size={15}/> Your details go securely through our API</span><span><CheckCircle2 size={15}/> No Supabase credentials are exposed in the browser</span></div>
    </div>
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.grid}>
        <label>Name *<input required value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Your full name" autoComplete="name"/></label>
        <label>Phone *<input required type="tel" value={form.phone} onChange={e=>update("phone",e.target.value)} placeholder="10-digit phone number" autoComplete="tel"/></label>
        <label>Email<input type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="you@example.com" autoComplete="email"/></label>
        <label>Property interest<select value={form.property_interest} onChange={e=>update("property_interest",e.target.value)}><option value="">Select property type</option><option>Residential Plot</option><option>Independent House</option><option>Flat / Apartment</option><option>Agricultural Land</option><option>Commercial Property</option><option>Rental Property</option><option>Sell / List My Property</option></select></label>
        <label>Preferred location<input value={form.location} onChange={e=>update("location",e.target.value)} placeholder="Laksar, Haridwar, Roorkee..."/></label>
        <label>Budget<input value={form.budget} onChange={e=>update("budget",e.target.value)} placeholder="e.g. ₹25 lakh"/></label>
        <label className={styles.full}>Message<textarea value={form.message} onChange={e=>update("message",e.target.value)} placeholder="Tell us what you need, preferred area, size, timeline, etc." rows={5}/></label>
      </div>
      {status==="success"&&<div className={styles.success}><CheckCircle2 size={19}/><div><strong>Inquiry submitted successfully.</strong><span>We have received your property request.</span></div></div>}
      {status==="error"&&<div className={styles.error}>{error}</div>}
      <button className={`primary ${styles.submit}`} type="submit" disabled={status==="loading"}>{status==="loading"?<><Loader2 size={17} className={styles.spin}/> Sending...</>:<><Send size={17}/> Send property inquiry</>}</button>
    </form>
  </div>;
}
