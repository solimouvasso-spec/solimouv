"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      subject: (fd.get("subject") as string) || null,
      message: fd.get("message") as string,
    };

    const { error: err } = await supabase
      .from("contact_messages")
      .insert(payload);

    if (err) {
      setError("Une erreur est survenue. Merci de réessayer.");
      setStatus("error");
      return;
    }

    setStatus("success");
    (e.target as HTMLFormElement).reset();
  }

  if (status === "success") {
    return (
      <div
        className="text-center py-12 bg-teal/10 border border-teal/30 rounded-2xl"
        role="alert"
        aria-live="polite"
      >
        <span className="text-5xl block mb-4" role="img" aria-label="Succès">
          ✅
        </span>
        <h3 className="text-white font-bold text-xl mb-2">Message envoyé !</h3>
        <p className="text-gray-400 mb-6">
          Nous vous répondrons dans les meilleurs délais.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-teal text-sm hover:underline"
          aria-label="Envoyer un autre message"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="app-form"
      aria-label="Formulaire de contact"
      noValidate
    >
      <div className="app-form__grid">
        <div className="app-field">
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Nom complet{" "}
            <span aria-hidden="true" className="text-accent">
              *
            </span>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            autoComplete="name"
            aria-required="true"
            className="app-input"
            placeholder="Marie Dupont"
          />
        </div>
        <div className="app-field">
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Email{" "}
            <span aria-hidden="true" className="text-accent">
              *
            </span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            aria-required="true"
            className="app-input"
            placeholder="marie@example.com"
          />
        </div>
      </div>

      <div className="app-field">
        <label
          htmlFor="contact-subject"
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          Sujet
        </label>
        <select
          id="contact-subject"
          name="subject"
          className="app-select"
          aria-label="Sélectionner un sujet"
        >
          <option value="">Choisir un sujet...</option>
          <option value="info">Information générale</option>
          <option value="partnership">Partenariat</option>
          <option value="volunteer">Bénévolat</option>
          <option value="association">Inscription association</option>
          <option value="defi">Proposer un défi mensuel</option>
          <option value="press">Presse</option>
          <option value="other">Autre</option>
        </select>
      </div>

      <div className="app-field">
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          Message{" "}
          <span aria-hidden="true" className="text-accent">
            *
          </span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          aria-required="true"
          className="app-textarea"
          placeholder="Votre message..."
        />
      </div>

      {error && (
        <p role="alert" className="text-accent text-sm">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="app-button app-button--primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Envoyer le formulaire de contact"
      >
        {status === "sending" ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}
