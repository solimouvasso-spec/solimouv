"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type AuthMode = "magic" | "password";
type AuthStep = "form" | "sent";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/admin";
  const urlError = searchParams.get("error");
  const modeParam = searchParams.get("mode");

  const [mode, setMode] = useState<AuthMode>(modeParam === "password" ? "password" : "magic");
  const [step, setStep] = useState<AuthStep>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    urlError === "callback" ? "Lien invalide ou expire. Reessaie." : null
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (redirectTo.startsWith("/passeport")) {
      router.replace("/passeport");
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(redirectTo);
    });
  }, [redirectTo, router]);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (err) {
      setError(err.message);
      setSubmitting(false);
      return;
    }

    setStep("sent");
    setSubmitting(false);
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) {
      setError(
        err.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : err.message
      );
      setSubmitting(false);
      return;
    }

    router.replace(redirectTo);
    setSubmitting(false);
  }

  if (step === "sent") {
    return (
      <div className="text-center py-10">
        <span className="text-6xl block mb-5" role="img" aria-label="Email envoye">
          📬
        </span>
        <h2 className="text-2xl font-extrabold text-white mb-3">Lien envoye !</h2>
        <p className="text-gray-400 max-w-xs mx-auto mb-6 leading-relaxed">
          {`Un lien de connexion a ete envoye a ${email}. Clique dessus pour acceder a l'administration.`}
        </p>
        <p className="text-gray-600 text-xs mb-6">
          Verifie aussi tes spams. Le lien expire dans 1 heure.
        </p>
        <button
          onClick={() => {
            setStep("form");
            setError(null);
          }}
          className="text-teal text-sm hover:underline"
        >
          ← Renvoyer un lien
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-bold text-2xl text-white mb-6 block"
          aria-label="Retour a l'accueil Solimouv"
        >
          <span className="text-teal" aria-hidden="true">
            ◆
          </span>
          Soli<span className="text-accent">mouv</span>
          <span className="text-teal">&apos;</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-white mb-2">Connexion administration</h1>
        <p className="text-gray-400 text-sm">Espace administration — Up Sport! Paris</p>
      </div>

      <div
        className="flex rounded-xl overflow-hidden border border-teal/20 mb-6"
        role="tablist"
        aria-label="Mode de connexion"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "magic"}
          onClick={() => {
            setMode("magic");
            setError(null);
          }}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            mode === "magic"
              ? "bg-teal text-navy"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Lien magique
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "password"}
          onClick={() => {
            setMode("password");
            setError(null);
          }}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            mode === "password"
              ? "bg-teal text-navy"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Mot de passe
        </button>
      </div>

      {mode === "magic" ? (
        <form onSubmit={handleMagicLink} className="space-y-4" noValidate>
          <div>
            <label htmlFor="auth-email-magic" className="block text-sm font-medium text-gray-300 mb-1.5">
              Adresse email
            </label>
            <input
              id="auth-email-magic"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@upsport-paris.fr"
              className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
            />
          </div>

          {error ? (
            <p role="alert" className="text-accent text-sm">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting || !email}
            className="w-full py-3.5 bg-teal text-navy font-bold rounded-full hover:bg-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Envoi..." : "Recevoir un lien de connexion"}
          </button>

          <p className="text-gray-600 text-xs text-center leading-relaxed">
            Cette page sert uniquement a l&apos;administration. Le parcours utilisateur reste dans le passeport.
          </p>
        </form>
      ) : (
        <form onSubmit={handlePassword} className="space-y-4" noValidate>
          <div>
            <label htmlFor="auth-email-pw" className="block text-sm font-medium text-gray-300 mb-1.5">
              Adresse email
            </label>
            <input
              id="auth-email-pw"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@upsport-paris.fr"
              className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-gray-300 mb-1.5">
              Mot de passe
            </label>
            <input
              id="auth-password"
              type="password"
              required
              autoComplete="current-password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
            />
          </div>

          {error ? (
            <p role="alert" className="text-accent text-sm">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting || !email || !password}
            className="w-full py-3.5 bg-teal text-navy font-bold rounded-full hover:bg-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Chargement..." : "Se connecter"}
          </button>
        </form>
      )}

      <div className="mt-8 text-center border-t border-teal/10 pt-6">
        <Link href="/" className="text-gray-600 text-xs hover:text-gray-400 transition-colors">
          ← Retour au site public
        </Link>
      </div>
    </>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-navy-light rounded-2xl p-8 border border-teal/20 shadow-2xl">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20" role="status" aria-label="Chargement">
              <div className="animate-spin w-10 h-10 border-4 border-teal border-t-transparent rounded-full" />
            </div>
          }
        >
          <AuthContent />
        </Suspense>
      </div>
    </div>
  );
}
