"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { sendEmailAction } from "@/app/actions/sendEmail";

interface ContactFormProps {
  onSuccess?: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const t = useTranslations("Contact");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendEmailAction({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      if (result.success) {
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");

        if (result.mailtoUrl) {
          window.location.href = result.mailtoUrl;
        }

        setStatus({ type: "success", text: t("successToast") });
        onSuccess?.();
      } else {
        const errorText = result.error || t("errorToast");
        setStatus({ type: "error", text: errorText });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: t("errorToast") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full font-sans">
      {status && (
        <div
          className={`p-4 rounded border text-size-small transition-all ${
            status.type === "error"
              ? "bg-red-950/30 border-red-900/60 text-red-300"
              : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="text-zinc-600 dark:text-zinc-400 text-size-small">
            {t("nameLabel")} *
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded text-zinc-900 dark:text-zinc-100 text-size-small placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="text-zinc-600 dark:text-zinc-400 text-size-small">
            {t("emailLabel")} *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded text-zinc-900 dark:text-zinc-100 text-size-small placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </div>
      </div>

      {/* Subject */}
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-subject" className="text-zinc-600 dark:text-zinc-400 text-size-small">
          {t("subjectLabel")}
        </label>
        <input
          id="contact-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded text-zinc-900 dark:text-zinc-100 text-size-small placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-zinc-600 dark:text-zinc-400 text-size-small">
          {t("messageLabel")} *
        </label>
        <textarea
          id="contact-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded text-zinc-900 dark:text-zinc-100 text-size-small placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit px-6 py-3 bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-800 text-zinc-900 disabled:text-zinc-500 text-size-small font-normal rounded transition-colors font-sans mt-2 cursor-pointer"
      >
        {isSubmitting ? t("sendingButton") : t("sendButton")}
      </button>
    </form>
  );
}
