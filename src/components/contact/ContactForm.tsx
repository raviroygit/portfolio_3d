"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/seo";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full rounded-lg border border-border bg-bg-2/60 px-4 py-3 font-sans text-sm text-fg placeholder:text-fg-subtle transition-colors focus:border-signal focus:outline-none";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus("error");
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          to_name: siteConfig.name,
          from_email: form.email,
          to_email: siteConfig.email,
          message: form.message,
        },
        publicKey,
      );
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="font-mono text-xs uppercase tracking-[0.15em] text-fg-subtle">
          Your name
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Jane Founder"
          className={`mt-2 ${inputClass}`}
        />
      </div>

      <div>
        <label htmlFor="email" className="font-mono text-xs uppercase tracking-[0.15em] text-fg-subtle">
          Your email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="jane@company.com"
          className={`mt-2 ${inputClass}`}
        />
      </div>

      <div>
        <label htmlFor="message" className="font-mono text-xs uppercase tracking-[0.15em] text-fg-subtle">
          What are you building?
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={6}
          placeholder="A few lines about the platform, product, or system you have in mind…"
          className={`mt-2 resize-none ${inputClass}`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message →"}
        </Button>
        {status === "sent" ? (
          <span className="font-mono text-xs text-signal">
            Thanks — I&apos;ll get back to you shortly.
          </span>
        ) : null}
        {status === "error" ? (
          <span className="font-mono text-xs text-danger">
            Something went wrong. Email me directly instead.
          </span>
        ) : null}
      </div>
    </form>
  );
}
