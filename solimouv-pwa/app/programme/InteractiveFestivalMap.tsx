"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ZoneAccent = "teal" | "yellow" | "lilac";

type MapZone = {
  id: string;
  name: string;
  label: string;
  description: string;
  accent: ZoneAccent;
  mapQuery: string;
  scans: string[];
};

type ScanSpot = {
  id: string;
  name: string;
  code: string;
  area: string;
  detail: string;
  zoneId: string;
  mapQuery: string;
};

type FestivalActivity = {
  title: string;
  copy: string;
  zone: string;
  accent: ZoneAccent;
  zoneId: string;
};

type ScheduleItem = {
  time: string;
  title: string;
  description: string;
  location: string;
  tag: string;
  color: ZoneAccent;
};

function buildGoogleEmbedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
}

function buildGoogleOpenUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default function InteractiveFestivalMap({
  zones,
  scanSpots,
  activities,
  schedule,
}: {
  zones: MapZone[];
  scanSpots: ScanSpot[];
  activities: FestivalActivity[];
  schedule: ScheduleItem[];
}) {
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0]?.id ?? "");
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"spots" | "activities" | "programme">("spots");

  const selectedZone = zones.find((zone) => zone.id === selectedZoneId) ?? zones[0];

  const selectedZoneSpots = useMemo(
    () => scanSpots.filter((spot) => spot.zoneId === selectedZone?.id),
    [scanSpots, selectedZone]
  );

  const selectedSpot =
    selectedZoneSpots.find((spot) => spot.id === selectedSpotId) ?? selectedZoneSpots[0] ?? null;

  const selectedActivities = useMemo(
    () => activities.filter((activity) => activity.zoneId === selectedZone?.id),
    [activities, selectedZone]
  );

  const selectedSchedule = useMemo(
    () =>
      schedule.filter(
        (item) =>
          item.location.toLowerCase().includes((selectedZone?.name ?? "").toLowerCase()) ||
          item.location.toLowerCase().includes((selectedZone?.label ?? "").toLowerCase())
      ),
    [schedule, selectedZone]
  );

  const activeMapQuery = selectedSpot?.mapQuery ?? selectedZone?.mapQuery ?? "Parc de la Villette Paris";

  return (
    <section className="app-card map-layout-card" data-reveal aria-label="Carte interactive du festival">
      <div className="app-card__content">
        <div className="section-heading">
          <p className="app-hero__eyebrow">Carte interactive</p>
          <h2 className="section-title">Une vraie carte interactive type Google Maps</h2>
          <p className="app-hero__description">
            Choisis une zone ou un spot a scanner, la carte se recentre dessus et le panneau te montre
            quoi faire juste apres.
          </p>
        </div>

        <div className="real-map-layout">
          <div className="real-map-card" data-reveal>
            <div className="real-map-card__toolbar">
              <div>
                <p className="app-hero__eyebrow">Lieu d&apos;exemple</p>
                <h3 className="real-map-card__title">Parc de la Villette, Paris</h3>
              </div>
              <div className="real-map-card__actions">
                <button
                  type="button"
                  className="app-button app-button--secondary"
                  onClick={() => {
                    setSelectedZoneId(zones[0]?.id ?? "");
                    setSelectedSpotId(null);
                  }}
                >
                  Recentrer
                </button>
                <a
                  href={buildGoogleOpenUrl(activeMapQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="app-button app-button--secondary"
                >
                  Ouvrir la carte
                </a>
              </div>
            </div>

            <div className="real-map-frame-wrap">
              <iframe
                title="Carte interactive du festival"
                src={buildGoogleEmbedUrl(activeMapQuery)}
                className="real-map-frame"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="real-map-overlay">
                <span className={`map-chip map-chip--${selectedZone?.accent ?? "teal"}`}>
                  {selectedZone?.name}
                </span>
                {selectedSpot ? (
                  <span className="real-map-overlay__spot">{selectedSpot.name}</span>
                ) : null}
              </div>
            </div>

            <div className="real-map-hint">
              <span className="app-pill">Demo interactive</span>
              <p>
                Clique une zone puis un spot QR pour simuler l&apos;orientation d&apos;un visiteur dans le
                festival.
              </p>
            </div>

            <div className="real-map-zones">
              {zones.map((zone) => {
                const active = zone.id === selectedZone?.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    className={`real-map-zone-pill real-map-zone-pill--${zone.accent} ${
                      active ? "is-active" : ""
                    }`}
                    onClick={() => {
                      setSelectedZoneId(zone.id);
                      setSelectedSpotId(null);
                      setActiveTab("spots");
                    }}
                  >
                    <span>{zone.id}</span>
                    <span>{zone.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="map-sidepanel map-sidepanel--interactive">
            <article className={`map-focus-card map-focus-card--${selectedZone?.accent ?? "teal"}`}>
              <div className="map-focus-card__header">
                <span className="map-zone-card__badge">{selectedZone?.id}</span>
                <div>
                  <h3>{selectedZone?.label}</h3>
                  <p>{selectedZone?.name}</p>
                </div>
              </div>
              <p className="map-focus-card__copy">{selectedZone?.description}</p>
              <div className="map-focus-card__meta">
                <span>{selectedZoneSpots.length} spots QR</span>
                <span>{selectedActivities.length} activites</span>
              </div>
            </article>

            <div className="map-tabs" role="tablist" aria-label="Details de zone">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "spots"}
                className={activeTab === "spots" ? "is-active" : ""}
                onClick={() => setActiveTab("spots")}
              >
                QR Codes
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "activities"}
                className={activeTab === "activities" ? "is-active" : ""}
                onClick={() => setActiveTab("activities")}
              >
                Activites
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "programme"}
                className={activeTab === "programme" ? "is-active" : ""}
                onClick={() => setActiveTab("programme")}
              >
                Programme
              </button>
            </div>

            {activeTab === "spots" ? (
              <div className="scan-spot-grid scan-spot-grid--stack">
                {selectedZoneSpots.map((spot) => (
                  <article
                    key={spot.id}
                    className={`scan-spot-card ${selectedSpot?.id === spot.id ? "is-active" : ""}`}
                  >
                    <div className="scan-spot-card__top">
                      <span className="scan-spot-card__code">{spot.code}</span>
                      <span className="app-pill">{spot.area}</span>
                    </div>
                    <h3>{spot.name}</h3>
                    <p>{spot.detail}</p>
                    <div className="scan-spot-card__actions">
                      <button
                        type="button"
                        className="app-button app-button--secondary"
                        onClick={() => setSelectedSpotId(spot.id)}
                      >
                        Voir sur la carte
                      </button>
                      <a
                        href={buildGoogleOpenUrl(spot.mapQuery)}
                        target="_blank"
                        rel="noreferrer"
                        className="app-button app-button--ghost"
                      >
                        Itineraire
                      </a>
                      <Link
                        href={`/scan?stand=${encodeURIComponent(spot.code)}`}
                        className="app-button app-button--primary"
                      >
                        Scanner
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}

            {activeTab === "activities" ? (
              <div className="festival-activity-grid festival-activity-grid--stack">
                {selectedActivities.map((activity) => (
                  <article
                    key={activity.title}
                    className={`festival-activity-card festival-activity-card--${activity.accent}`}
                  >
                    <span className="app-pill">{activity.zone}</span>
                    <h3>{activity.title}</h3>
                    <p>{activity.copy}</p>
                  </article>
                ))}
              </div>
            ) : null}

            {activeTab === "programme" ? (
              <div className="map-programme-list">
                {(selectedSchedule.length > 0 ? selectedSchedule : schedule.slice(0, 4)).map((item) => (
                  <article key={item.time + item.title} className="map-programme-item">
                    <time dateTime={`2025-06-14T${item.time}`}>{item.time}</time>
                    <div>
                      <span className={`map-chip map-chip--${item.color}`}>{item.tag}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
