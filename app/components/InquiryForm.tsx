"use client";

import {FormEvent, ClipboardEvent, FormEventHandler, useState} from "react";
import {CheckCircle2, Loader2, Send, ShieldCheck} from "lucide-react";
import styles from "./InquiryForm.module.css";

const API_URL = "https://laksarproperties-api.mtine9086.workers.dev/";
const PRIVACY_VERSION = "2026-08-18-v1";

const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ .'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function InquiryForm() {
  const [form, setForm] = useState({name:"",phone:"",email:"",property_interest:"",location:"",budget