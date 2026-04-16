"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase, Don, ContactMessage, PassportProfile } from "@/lib/supabase";

// ─── Types locaux ─────────────────────────────────────────────────────────────
type Stats = {
  passeports: number;
  dons_count: number;
  dons_total: number;
  messages: number;
  messages_unread: number;
  scans: number;
};

const MONTHS_FR = [
  "jan", "fév", "mar", "avr", "mai", "jun",
  "jul", "aoû", "sep", "oct", "nov", "déc",
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentDons, setRecentDons] = useState<Don[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [recentProfiles, setRecentProfiles] = useState<PassportProfile[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "dons" | "messages" | "passeports">("overview");

  // ── Auth guard ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/auth?redirect=/admin");
        return;
      }
      setUser(data.session.user);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.replace("/auth?redirect=/admin");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // ── Chargement des données ──
  const loadData = useCallback(async () => {
    setDataLoading(true);

    const [
      { count: passeports },
      { data: dons },
      { count: messages },
      { count: messages_unread },
      { count: scans },
      { data: recentDonsData },
      { data: recentMsgsData },
      { data: recentProfilesData },
    ] = await Promise.all([
      supabase.from("passport_profiles").select("*", { count: "exact", head: true }),
      supabase.from("dons").select("montant"),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("read", false),
      supabase.from("passport_scans").select("*", { count: "exact", head: true }),
      supabase.from("dons").select("*").order("created_at", { ascending: false }).limit(8),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(8),
      supabase.from("passport_profiles").select("*").order("total_points", { ascending: false }).limit(8),
    ]);

    const dons_total = (dons ?? []).reduce((sum, d) => sum + (d.montant ?? 0), 0);

    setStats({
      passeports: passeports ?? 0,
      dons_count: recentDonsData?.length ?? 0,
      dons_total,
      messages: messages ?? 0,
      messages_unread: messages_unread ?? 0,
      scans: scans ?? 0,
    });
    setRecentDons((recentDonsData as Don[]) ?? []);
    setRecentMessages((recentMsgsData as ContactMessage[]) ?? []);
    setRecentProfiles((recentProfilesData as PassportProfile[]) ?? []);
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && user) loadData();
  }, [authLoading, user, loadData]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/auth");
  }

  async function markMessageRead(id: string) {
    await supabase.from("contact_messages").update({ read: true }).eq("id", id);
    setRecentMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  }

  // ── Chargement auth ──
  if (authLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[70vh]"
        role="status"
        aria-label="Vérification de l'accès"
      >
        <div className="animate-spin w-12 h-12 border-4 border-teal border-t-transparent rounded-full mb-4" />
        <p className="text-gray-500 text-sm">Vérification de l&apos;accès...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <header className="flex items-start justify-between mb-8 gap-4">
        <div>
          <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-1">
            Administration
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Tableau de bord
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {user?.email} · Festival Solimouv&apos; 2025
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={loadData}
            disabled={dataLoading}
            className="p-2 rounded-lg border border-teal/20 text-teal hover:bg-teal/10 transition-colors disabled:opacity-50"
            aria-label="Rafraîchir les données"
            title="Rafraîchir"
          >
            <svg
              className={`w-5 h-5 ${dataLoading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-accent/40 text-accent text-sm font-semibold rounded-lg hover:bg-accent/10 transition-colors"
            aria-label="Se déconnecter"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Stats */}
      {stats && (
        <section aria-labelledby="stats-heading" className="mb-8">
          <h2 id="stats-heading" className="sr-only">
            Statistiques générales
          </h2>
          <ul
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
            role="list"
          >
            {[
              { label: "Passeports", value: stats.passeports, icon: "🎟", color: "text-teal" },
              { label: "Scans QR", value: stats.scans, icon: "📷", color: "text-teal" },
              { label: "Dons", value: stats.dons_count, icon: "❤", color: "text-accent" },
              { label: "Total dons", value: `${stats.dons_total} €`, icon: "💶", color: "text-accent" },
              { label: "Messages", value: stats.messages, icon: "✉", color: "text-teal" },
              { label: "Non lus", value: stats.messages_unread, icon: "🔴", color: "text-accent" },
            ].map(({ label, value, icon, color }) => (
              <li
                key={label}
                className="bg-navy-light rounded-xl p-4 border border-teal/10 text-center"
              >
                <span className="text-2xl block mb-1" role="img" aria-label={label}>
                  {icon}
                </span>
                <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                <p className="text-gray-600 text-xs mt-0.5">{label}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tabs */}
      <div
        className="flex gap-1 border-b border-teal/20 mb-6"
        role="tablist"
        aria-label="Sections d'administration"
      >
        {(
          [
            { id: "overview", label: "Vue d'ensemble" },
            { id: "dons", label: `Dons (${recentDons.length})` },
            { id: "messages", label: `Messages (${stats?.messages_unread ?? 0} non lus)` },
            { id: "passeports", label: `Passeports (${recentProfiles.length})` },
          ] as { id: typeof activeTab; label: string }[]
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === id
                ? "bg-teal/20 text-teal border-b-2 border-teal"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Vue d'ensemble ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top passeports */}
          <section aria-labelledby="top-heading">
            <h2 id="top-heading" className="text-lg font-bold text-white mb-3">
              Top Soli&apos;Athlètes
            </h2>
            {recentProfiles.length === 0 ? (
              <p className="text-gray-600 text-sm py-4">Aucun passeport créé.</p>
            ) : (
              <ul className="space-y-2" role="list">
                {recentProfiles.slice(0, 5).map((p, i) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between bg-navy-light rounded-xl px-4 py-3 border border-teal/10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-mono text-sm w-5 text-center">
                        {i + 1}
                      </span>
                      <p className="text-white font-medium text-sm">{p.display_name}</p>
                    </div>
                    <span className="text-teal font-bold text-sm">{p.total_points} pts</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Derniers messages */}
          <section aria-labelledby="msgs-overview-heading">
            <h2 id="msgs-overview-heading" className="text-lg font-bold text-white mb-3">
              Derniers messages
            </h2>
            {recentMessages.length === 0 ? (
              <p className="text-gray-600 text-sm py-4">Aucun message reçu.</p>
            ) : (
              <ul className="space-y-2" role="list">
                {recentMessages.slice(0, 5).map((m) => (
                  <li
                    key={m.id}
                    className={`flex items-start gap-3 bg-navy-light rounded-xl px-4 py-3 border ${
                      m.read ? "border-teal/10" : "border-accent/30"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white font-medium text-sm truncate">
                          {m.name}
                        </p>
                        {!m.read && (
                          <span className="shrink-0 w-2 h-2 rounded-full bg-accent" aria-label="Non lu" />
                        )}
                      </div>
                      <p className="text-gray-500 text-xs truncate">{m.subject || "Sans sujet"}</p>
                    </div>
                    <span className="text-gray-600 text-xs shrink-0">
                      {formatDate(m.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {/* ── Dons ── */}
      {activeTab === "dons" && (
        <section aria-labelledby="dons-heading">
          <h2 id="dons-heading" className="sr-only">
            Liste des dons
          </h2>
          {recentDons.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <span className="text-4xl block mb-3">❤</span>
              <p>Aucun don enregistré.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-teal/10">
              <table className="w-full text-sm" aria-label="Tableau des dons">
                <thead>
                  <tr className="border-b border-teal/10 bg-navy-light">
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Donateur</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Montant</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-medium">Reçu</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDons.map((don) => (
                    <tr
                      key={don.id}
                      className="border-b border-teal/5 hover:bg-navy-light transition-colors"
                    >
                      <td className="px-4 py-3 text-white font-medium">
                        {don.prenom} {don.nom}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{don.email}</td>
                      <td className="px-4 py-3 text-accent font-bold text-right">
                        {don.montant} €
                      </td>
                      <td className="px-4 py-3 text-center">
                        {don.recu_fiscal ? (
                          <span className="text-teal text-xs font-semibold" aria-label="Reçu fiscal demandé">✅</span>
                        ) : (
                          <span className="text-gray-600 text-xs" aria-label="Pas de reçu demandé">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(don.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-navy-light border-t border-teal/20">
                    <td colSpan={2} className="px-4 py-3 text-gray-500 font-medium">
                      Total ({recentDons.length} don{recentDons.length > 1 ? "s" : ""})
                    </td>
                    <td className="px-4 py-3 text-accent font-extrabold text-right">
                      {recentDons.reduce((s, d) => s + d.montant, 0)} €
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ── Messages ── */}
      {activeTab === "messages" && (
        <section aria-labelledby="messages-heading">
          <h2 id="messages-heading" className="sr-only">
            Messages de contact
          </h2>
          {recentMessages.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <span className="text-4xl block mb-3">✉</span>
              <p>Aucun message reçu.</p>
            </div>
          ) : (
            <ul className="space-y-3" role="list">
              {recentMessages.map((m) => (
                <li
                  key={m.id}
                  className={`bg-navy-light rounded-xl p-5 border ${
                    m.read ? "border-teal/10" : "border-accent/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      {!m.read && (
                        <span className="w-2 h-2 rounded-full bg-accent shrink-0" aria-label="Non lu" />
                      )}
                      <div>
                        <p className="text-white font-semibold">{m.name}</p>
                        <a
                          href={`mailto:${m.email}`}
                          className="text-teal text-xs hover:underline"
                        >
                          {m.email}
                        </a>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-gray-500 text-xs">{formatDate(m.created_at)}</p>
                      {m.subject && (
                        <p className="text-gray-400 text-xs mt-0.5">{m.subject}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    {m.message}
                  </p>
                  <div className="flex items-center gap-3">
                    <a
                      href={`mailto:${m.email}?subject=Re: ${m.subject ?? "Votre message"}`}
                      className="text-xs text-teal font-semibold hover:underline"
                    >
                      ↩ Répondre
                    </a>
                    {!m.read && (
                      <button
                        onClick={() => markMessageRead(m.id)}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ── Passeports ── */}
      {activeTab === "passeports" && (
        <section aria-labelledby="passeports-heading">
          <h2 id="passeports-heading" className="sr-only">
            Participants Soli&apos;Passeport
          </h2>
          {recentProfiles.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <span className="text-4xl block mb-3">🎟</span>
              <p>Aucun passeport créé.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-teal/10">
              <table className="w-full text-sm" aria-label="Tableau des participants">
                <thead>
                  <tr className="border-b border-teal/10 bg-navy-light">
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">#</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Pseudo</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Total</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Festival</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Défis</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Inscrit le</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProfiles.map((p, i) => (
                    <tr
                      key={p.id}
                      className="border-b border-teal/5 hover:bg-navy-light transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-600 font-mono">{i + 1}</td>
                      <td className="px-4 py-3 text-white font-medium">{p.display_name}</td>
                      <td className="px-4 py-3 text-gray-400">{p.email ?? "—"}</td>
                      <td className="px-4 py-3 text-teal font-bold text-right">
                        {p.total_points} pts
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-right">
                        {p.festival_points}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-right">
                        {p.challenge_points}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(p.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
