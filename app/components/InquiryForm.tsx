"use client";

import {FormEvent, useState} from "react";
import {CheckCircle2, Loader2, Send, ShieldCheck} from "lucide-react";
import styles from "./InquiryForm.module.css";

const API_URL = "https://laksarproperties-api.mtine9086.workers.dev/";
const PRIVACY_VERSION = "2026-08-18-v1";

const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ .'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/;

export default function InquiryForm() {
  const [form, setForm] = useState({name:"",phone:"",email:"",property_interest:"",location:"",budget:"",message:"",consent:false,marketing_consent:false});
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [error, setError] = useState("");

  const update = (key:keyof typeof form,value:string|boolean) => setForm((current)=>({...current,[key]:value}));

  const handleName = (value:string) => {
    // Names may contain letters, spaces, apostrophes and hyphens; numbers/symbols are rejected.
    update("name", value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ .'-]/g, "").replace(/\s{2,}/g, " "));
  };

  const handlePhone = (value:string) => {
    // Keep phone input numeric only and limit it to 10 digits.
    update("phone", value.replace(/\D/g, "").slice(0, 10));
  };

  const submit = async (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setStatus("idle"); setError("");

    const name = form.name.trim().replace(/\s+/g, " ");
    const phone = form.phone.trim();
    const email = form.email.trim();
    const location = form.location.trim();
    const budget = form.budget.trim();
    const message = form.message.trim();

    if(!name || !NAME_PATTERN.test(name)) {
      setStatus("error"); setError("Please enter a valid name using letters only (spaces, hyphens and apostrophes are allowed)."); return;
    }
    if(!PHONE_PATTERN.test(phone)) {
      setStatus("error"); setError("Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9."); return;
    }
    if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setStatus("error"); setError("Please enter a valid email address."); return;
    }
    if(!form.property_interest) {
      setStatus("error"); setError("Please select the property type you are interested in."); return;
    }
    if(!form.consent){ setStatus("error"); setError("Please read the Privacy Notice and give the required consent before submitting your inquiry."); return; }

    setStatus("loading");
    try {
      const response=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        name, phone, email:email || null, property_interest:form.property_interest,
        location:location || null, budget:budget || null, message:message || null,
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
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.grid}>
        <label>Name *<input required type="text" inputMode="text" autoCapitalize="words" autoCorrect="off" maxLength={80} pattern="[A-Za-zÀ-ÖØ-öø-ÿ .'-]+" value={form.name} onChange={e=>handleName(e.target.value)} placeholder="Your full name" autoComplete="name" aria-describedby="name-help"/><small id="name-help">Letters only; spaces, hyphens and apostrophes are allowed.</small></label>
        <label>Phone *<input required type="tel" inputMode="numeric" maxLength={10} pattern="[6-9][0-9]{9}" value={form.phone} onChange={e=>handlePhone(e.target.value)} placeholder="10-digit mobile number" autoComplete="tel"/></label>
        <label>Email<input type="email" inputMode="email" maxLength={254} value={form.email} onChange={e=>update("email",e.target.value)} placeholder="you@example.com" autoComplete="email"/></label>
        <label>Property interest *<select required value={form.property_interest} onChange={e=>update("property_interest",e.target.value)}><option value="">Select property type</option><option>Residential Plot</option><option>Independent House</option><option>Flat / Apartment</option><option>Agricultural Land</option><option>Commercial Property</option><option>Rental Property</option><option>Sell / List My Property</option></select></label>
        <label>Preferred location<input type="text" maxLength={120} value={form.location} onChange={e=>update("location",e.target.value)} placeholder="Laksar, Haridwar, Roorkee..." autoComplete="address-level2"/></label>
        <label>Budget<input type="text" inputMode="decimal" maxLength={40} value={form.budget} onChange={e=>update("budget",e.target.value)} placeholder="e.g. ₹25 lakh"/></label>
        <label className={styles.full}>Message<textarea maxLength={1000} value={form.message} onChange={e=>update("message",e.target.value)} placeholder="Tell us what you need, preferred area, size, timeline, etc." rows={5}/></label>
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
