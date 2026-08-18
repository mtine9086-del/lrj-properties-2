"use client";

import {FormEvent, useState} from "react";
import {CheckCircle2, Loader2, Send, ShieldCheck} from "lucide-react";
import styles from "./InquiryForm.module.css";

const API_URL = "https://laksarproperties-api.mtine9086.workers.dev/";
const PRIVACY_VERSION = "2026-08-18-v1";

export default function InquiryForm() {
  const [form, setForm] = useState({name:"",phone:"",email:"",property_interest:"",location:"",budget:"",message:"",consent:false,marketing_consent:false});
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [error, setError] = useState("");
  const update = (key:keyof typeof form,value:string|boolean) => setForm((current)=>({...current,[key]:value}));

  const submit = async (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setStatus("loading"); setError("");
    if(!form.consent){ setStatus("error"); setError("Please read the Privacy Notice and give the required consent before submitting your inquiry."); return; }
    try {
      const response=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        name:form.name, phone:form.phone, email:form.email, property_interest:form.property_interest,
        location:form.location, budget:form.budget, message:form.message,
        consent_given:form.consent, marketing_consent:form.marketing_consent,
        consent_timestamp:new Date().toISOString(), privacy_policy_version:PRIVACY_VERSION
      })});
      const result=await response.json();
      if(!response.ok||!result.success) throw new Error(result.message||"Unable to submit your inquiry.");
      setStatus("success"); setForm({name:"",phone:"",email:"",property_interest:"",location:"",budget:"",message:"",consent:false,marketing_consent:false});
    } catch(err) { setStatus("error"); setError(err instanceof Error?err.message:"Something went wrong. Please try again."); }
  };
  return <div className={styles.wrap}>
    <div className={styles.intro}>
      <span className="kicker">PROPERTY INQUIRY</span><h2>Tell us what you&apos;re looking for.</h2>
      <p>Share only the details needed for us to respond to your property enquiry. Please review our Privacy Notice before submitting.</p>
      <div className={styles.trust}><span><CheckCircle2 size={15}/> Local property guidance</span><span><ShieldCheck size={15}/> Secure API path; no Supabase secret in the browser</span><span><CheckCircle2 size={15}/> You control optional marketing consent</span></div>
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

      <div className={styles.consentBox}>
        <label className={styles.consentRow}><input type="checkbox" checked={form.consent} onChange={e=>update("consent",e.target.checked)} required/><span>I have read the <a href="/lrj-properties-2/privacy" target="_blank" rel="noreferrer">Privacy Notice</a> and consent to LRJ Properties collecting and processing the information I provide for the specific purpose of responding to my property enquiry and providing related property assistance. *</span></label>
        <label className={styles.consentRow}><input type="checkbox" checked={form.marketing_consent} onChange={e=>update("marketing_consent",e.target.checked)}/><span>I separately consent to receive property updates, offers or promotional communications. This is optional and is not required to submit an enquiry.</span></label>
        <p className={styles.consentNote}>You can withdraw consent or contact us about your personal data using the details in our Privacy Notice. We do not require marketing consent to handle an enquiry.</p>
      </div>

      {status==="success"&&<div className={styles.success}><CheckCircle2 size={19}/><div><strong>Inquiry submitted successfully.</strong><span>We have received your property request.</span></div></div>}
      {status==="error"&&<div className={styles.error}>{error}</div>}
      <button className={`primary ${styles.submit}`} type="submit" disabled={status==="loading"}>{status==="loading"?<><Loader2 size={17} className={styles.spin}/> Sending...</>:<><Send size={17}/> Send property inquiry</>}</button>
    </form>
  </div>;
}
