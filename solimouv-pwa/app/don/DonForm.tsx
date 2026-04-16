"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Status = "idle" | "sending" | "success" | "error";

const TIERS = [
  { amount: 10,  label: "Solidaire",  description: "Finance une heure d'atelier pour un enfant",     color: "border-gray-600" },
  { amount: 30,  label: "Engagé",     description: "Contribue à l'achat d'un équipement adapté",     color: "border-teal",   featured: true },
  { amount: 60,  label: "Champion",   description: "Sponsor une journée d'initiation pour un groupe", color: "border-accent" },
  { amount: 150, label: "Partenaire", description: "Permet d'animer un atelier lors du festival",     color: "border-gray-600" },
];

export default function DonForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const montant = parseInt(fd.get("montant") as string, 10);

    if (!montant || montant < 1) {
      setError("Le montant doit être d'au moins 1€.");
      setStatus("error");
      return;
    }

    const { error: err } = await supabase.from("dons").insert({
      prenom: fd.get("prenom") as string,
      nom: fd.get("nom") as string,
      email: fd.get("email") as string,
      montant,
      recu_fiscal: fd.get("recu_fiscal") === "on",
    });

    if (err) {
      setError("Une erreur est survenue. Merci de réessayer.");
      setStatus("error");
      return;
    }

    setStatus("success");
  }

  if (status === "success") {
    return (
      <div
        className="text-center py-12 bg-accent/10 border border-accent/30 rounded-2xl"
        role="alert"
        aria-live="polite"
      >
        <span className="text-5xl block mb-4" role="img" aria-label="Merci">
          ❤
        </span>
        <h3 className="text-white font-bold text-2xl mb-2">Merci pour votre don !</h3>
        <p className="text-gray-400 max-w-sm mx-auto">
          Votre générosité contribue directement à rendre le sport accessible à
          tous. Un reçu vous sera envoyé par email si demandé.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Sélection rapide du montant */}
      <section aria-labelledby="tiers-heading" className="mb-8">
        <h2 id="tiers-heading" className="text-2xl font-bold text-white mb-6 text-center">
          Votre impact
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list">
          {TIERS.map(({ amount, label, description, color, featured }) => (
            <li key={amount}>
              <button
                type="button"
                onClick={() => setSelectedAmount(amount)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all focus-visible:ring-2 focus-visible:ring-teal ${color} ${
                  featured ? "bg-teal/10 ring-1 ring-teal/30" : "bg-navy-light"
                } ${
                  selectedAmount === amount
                    ? "ring-2 ring-teal scale-[1.02]"
                    : "hover:opacity-90"
                }`}
                aria-label={`Sélectionner ${amount}€ — ${label} — ${description}`}
                aria-pressed={selectedAmount === amount}
              >
                {featured && (
                  <span className="text-xs font-semibold text-teal uppercase tracking-widest block mb-2">
                    Populaire
                  </span>
                )}
                <p className="text-3xl font-extrabold text-white mb-1">{amount}€</p>
                <p className="text-teal font-semibold text-sm mb-2">{label}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Formulaire */}
      <section
        aria-labelledby="don-form-heading"
        className="bg-navy-light rounded-2xl p-6 sm:p-8 border border-teal/20"
      >
        <h2 id="don-form-heading" className="text-2xl font-bold text-white mb-6">
          Personnaliser votre don
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-label="Formulaire de don"
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="don-prenom"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Prénom{" "}
                <span aria-hidden="true" className="text-accent">
                  *
                </span>
              </label>
              <input
                id="don-prenom"
                type="text"
                name="prenom"
                required
                autoComplete="given-name"
                aria-required="true"
                className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                placeholder="Marie"
              />
            </div>
            <div>
              <label
                htmlFor="don-nom"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Nom{" "}
                <span aria-hidden="true" className="text-accent">
                  *
                </span>
              </label>
              <input
                id="don-nom"
                type="text"
                name="nom"
                required
                autoComplete="family-name"
                aria-required="true"
                className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                placeholder="Dupont"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="don-email"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Email{" "}
              <span aria-hidden="true" className="text-accent">
                *
              </span>
            </label>
            <input
              id="don-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              aria-required="true"
              className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
              placeholder="marie@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="don-montant"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Montant (€){" "}
              <span aria-hidden="true" className="text-accent">
                *
              </span>
            </label>
            <input
              id="don-montant"
              type="number"
              name="montant"
              required
              min={1}
              step={1}
              value={selectedAmount ?? ""}
              onChange={(e) => setSelectedAmount(parseInt(e.target.value) || null)}
              aria-required="true"
              aria-describedby="don-montant-hint"
              className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
              placeholder="30"
            />
            <p id="don-montant-hint" className="text-gray-500 text-xs mt-1">
              Minimum 1€ — Cliquez sur un montant ci-dessus pour le sélectionner
            </p>
          </div>

          <div className="flex items-start gap-3">
            <input
              id="don-recu"
              type="checkbox"
              name="recu_fiscal"
              className="mt-0.5 accent-teal rounded w-5 h-5 shrink-0"
            />
            <label
              htmlFor="don-recu"
              className="text-gray-300 text-sm cursor-pointer"
            >
              Je souhaite recevoir un reçu fiscal (déduction d&apos;impôts — 66%
              de réduction)
            </label>
          </div>

          {error && (
            <p role="alert" className="text-accent text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-4 bg-accent text-white font-bold text-lg rounded-full hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Finaliser mon don"
          >
            {status === "sending" ? "Envoi en cours..." : "Faire mon don ❤"}
          </button>
        </form>
      </section>
    </>
  );
}
