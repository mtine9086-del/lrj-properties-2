"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import styles from "./InquiryForm.module.css";

const API_URL = "https://laksarproperties-api.mtine9086.workers.dev/";
const PRIVACY_VERSION = "2026-08-18-v1";
const PRIVACY_URL = "/lrj-properties-2/privacy/";

const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ .'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BUDGET_ALLOWED = /[^0-9A-Za-z₹,\.\-\s]/g;

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  property_interest: "",
  location: "",
  budget: "",
  message: "",
  consent: false,
  marketing_consent: false,
};

type FormState = typeof EMPTY_FORM;
type Status = "idle" | "loading" | "success" | "error";

export default function InquiryForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleName = (value: string) => {
    const cleaned = value
      .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ .'-]/g, "")
      .replace(/\s{2,}/g, " ")
      .slice(0, 80);
    update("name", cleaned);
  };

  const handlePhone = (value: string) => {
    update("phone", value.replace(/\D/g, "").slice(0, 10));
  };

  const handleEmail = (value: string) => {
    update("email", value.replace(/[\r\n\t]/g, "").slice(0, 254));
  };

  const handleLocation = (value: string) => {
    update("location", value.replace(/[\r\n\t]/g, " ").replace(/\s{2,}/g, " ").slice(0, 120));
  };

  const handleBudget = (value: string) => {
    update("budget", value.replace(BUDGET_ALLOWED, "").replace(/\s{2,}/g, " ").slice(0, 40));
  };

  const handleMessage = (value: string) => {
    update("message", value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, 1000));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("idle");
    setError("");

    const name = form.name.trim().replace(/\s+/g, " ");
    const phone = form.phone.trim();
    const email = form.email.trim();
    const propertyInterest = form.property_interest.trim();
    const location = form.location.trim();
    const budget = form.budget.trim();
    const message = form.message.trim();

    if (!name || !NAME_PATTERN.test(name)) {
      setStatus("error");
      setError("Please enter a valid name using letters only. Spaces, hyphens and apostrophes are allowed.");
      return;
    }

    if (!PHONE_PATTERN.test(phone)) {
      setStatus("error");
      setError("Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.");
      return;
    }

    if (email && !EMAIL_PATTERN.test(email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }

    if (!propertyInterest) {
      setStatus("error");
      setError("Please select the property type you are interested in.");
      return;
    }

    if (!form.consent) {
      setStatus("error");
      setError("Please read the Privacy Notice and give the required consent before submitting your inquiry.");
      return;
    }

    setStatus("loading");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email || null,
          property_interest: propertyInterest,
          location: location || null,
          budget: budget || null,
          message: message || null,
          consent_given: form.consent,
          marketing_consent: form.marketing_consent,
          consent_timestamp: new Date().toISOString(),
          privacy_policy_version: PRIVACY_VERSION,
        }),
        signal: controller.signal,
      });

      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json")
        ? await response.json()
        : { success: false, message: await response.text() };

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to submit your inquiry.");
      }

      setStatus("success");
      setForm({ ...EMPTY_FORM });
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof DOMException && err.name === "AbortError"
          ? "The request took too long. Please check your connection and try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
      );
    } finally {
      window.clearTimeout(timeout);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.intro}>
        <span className="kicker">PROPERTY INQUIRY</span>
        <h2>Tell us what you&apos;re looking for.</h2>
        <p>
          Share only the details needed for us to respond to your property enquiry. Please review our Privacy Notice before submitting.
        </p>
        <div className={styles.trust}>
          <span><CheckCircle2 size={15} /> Local property guidance</span>
          <span><ShieldCheck size={15} /> Secure API path; no Supabase secret in the browser</span>
          <span><CheckCircle2 size={15} /> You control optional marketing consent</span>
        </div>
      </div>

      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.grid}>
          <label>
            Name *
            <input required type="text" inputMode="text" autoCapitalize="words" autoCorrect="off" maxLength={80} value={form.name} onChange={(event) => handleName(event.target.value)} placeholder="Your full name" autoComplete="name" aria-describedby="name-help" />
            <small id="name-help">Letters only; spaces, hyphens and apostrophes are allowed.</small>
          </label>

          <label>
            Phone *
            <input required type="tel" inputMode="numeric" maxLength={10} value={form.phone} onChange={(event) => handlePhone(event.target.value)} placeholder="10-digit mobile number" autoComplete="tel" />
          </label>

          <label>
            Email
            <input type="email" inputMode="email" maxLength={254} value={form.email} onChange={(event) => handleEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" />
          </label>

          <label>
            Property interest *
            <select required value={form.property_interest} onChange={(event) => update("property_interest", event.target.value)}>
              <option value="">Select property type</option>
              <option>Residential Plot</option>
              <option>Independent House</option>
              <option>Flat / Apartment</option>
              <option>Agricultural Land</option>
              <option>Commercial Property</option>
              <option>Rental Property</option>
              <option>Sell / List My Property</option>
            </select>
          </label>

          <label>
            Preferred location
            <input type="text" maxLength={120} value={form.location} onChange={(event) => handleLocation(event.target.value)} placeholder="Laksar, Haridwar, Roorkee..." autoComplete="address-level2" />
          </label>

          <label>
            Budget
            <input type="text" inputMode="decimal" maxLength={40} value={form.budget} onChange={(event) => handleBudget(event.target.value)} placeholder="e.g. ₹25 lakh" />
          </label>

          <label className={styles.full}>
            Message
            <textarea maxLength={1000} value={form.message} onChange={(event) => handleMessage(event.target.value)} placeholder="Tell us what you need, preferred area, size, timeline, etc." rows={5} />
            <small>{form.message.length}/1000</small>
          </label>
        </div>

        <fieldset className={styles.consentBox}>
          <legend>Privacy & consent</legend>

          <div className={styles.consentRow}>
            <input
              id="required-consent"
              name="consent_given"
              type="checkbox"
              checked={form.consent}
              onChange={(event) => update("consent", event.currentTarget.checked)}
              aria-required="true"
              aria-describedby="required-consent-text"
            />
            <label id="required-consent-text" htmlFor="required-consent">
              I have read the <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">Privacy Notice</a> and consent to LRJ Properties collecting and processing the information I provide for the specific purpose of responding to my property enquiry and providing related property assistance. <strong>*</strong>
            </label>
          </div>

          <div className={styles.consentRow}>
            <input
              id="marketing-consent"
              name="marketing_consent"
              type="checkbox"
              checked={form.marketing_consent}
              onChange={(event) => update("marketing_consent", event.currentTarget.checked)}
              aria-describedby="marketing-consent-text"
            />
            <label id="marketing-consent-text" htmlFor="marketing-consent">
              I separately consent to receive property updates, offers or promotional communications. This is optional and is not required to submit an enquiry.
            </label>
          </div>

          <p className={styles.consentNote}>You can withdraw consent or contact us about your personal data using the details in our Privacy Notice. Marketing consent is optional.</p>
        </fieldset>

        {status === "success" && (
          <div className={styles.success} role="status">
            <CheckCircle2 size={19} />
            <div><strong>Inquiry submitted successfully.</strong><span>We have received your property request.</span></div>
          </div>
        )}
        {status === "error" && <div className={styles.error} role="alert">{error}</div>}

        <button className={`primary ${styles.submit}`} type="submit" disabled={status === "loading"}>
          {status === "loading" ? <><Loader2 size={17} className={styles.spin} /> Sending...</> : <><Send size={17} /> Send property inquiry</>}
        </button>
      </form>
    </div>
  );
}
