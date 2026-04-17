"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";

type ZoneAccent = "teal" | "yellow" | "lilac";

type MapZone = {
  id: string;
  name: string;
  label: string;
  description: string;
  placement: CSSProperties;
  accent: ZoneAccent;
  scans: string[];
};

type ScanSpot = {
  id: string;
  name: string;
  code: string;
  area: string;
  detail: string;
  zoneId: string;
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
  const [activeTab, setActiveTab] = useState<"zones" | "scans" | "programme">("zones");

  const selectedZone = zones.find((zone) => zone.id === selectedZoneId) ?? zones[0];

  const selectedScanSpots = useMemo(
    () => scanSpots.filter((spot) => spot.zoneId === selectedZone?.id),
    [scanSpots, selectedZone]
  );

  const selectedActivities = useMemo(
    () => activities.filter((activity) => activity.zoneId === selectedZone?.id),
    [activities, selectedZone]
  );

  const selectedSchedule = useMemo(
    () => schedule.filter((item) => item.location.includes(selectedZone?.name ?? "")),
    [schedule, selectedZone]
  );

  return (
    <section className="app-card map-layout-card" data-reveal aria-label="Carte interactive du festival">
      <div className="app-card__content">
        <div className="section-heading">
          <p className="app-hero__eyebrow">Carte interactive</p>
          <h2 className="section-title">Explore le festival zone par zone</h2>
          <p className="app-hero__description">
            Clique sur une zone pour voir les QR codes, les activites et les temps forts associes.
          </p>
        </div>

        <div className="map-layout map-layout--interactive">
          <div className="festival-map festival-map--interactive" data-reveal>
            <div className="festival-map__stage">Scene principale</div>
            <div className="festival-map__path festival-map__path--one" aria-hidden="true" />
            <div className="festival-map__path festival-map__path--two" aria-hidden="true" />
            {zones.map((zone) => {
              const active = zone.id === selectedZone?.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  className={`map-pin map-pin--${zone.accent} ${active ? "is-active" : ""}`}
                  style={zone.placement}
                  onClick={() => setSelectedZoneId(zone.id)}
                  aria-pressed={active}
                  aria-label={`${zone.name} - ${zone.label}`}
                >
                  <span className="map-pin__id">{zone.id}</span>
                  <span className="map-pin__label">{zone.name}</span>
                </button>
              );
            })}
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
                <span>{selectedScanSpots.length} spots QR</span>
                <span>{selectedActivities.length} activites</span>
              </div>
            </article>

            <div className="map-tabs" role="tablist" aria-label="Details de zone">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "zones"}
                className={activeTab === "zones" ? "is-active" : ""}
                onClick={() => setActiveTab("zones")}
              >
                QR Codes
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "scans"}
                className={activeTab === "scans" ? "is-active" : ""}
                onClick={() => setActiveTab("scans")}
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

            {activeTab === "zones" ? (
              <div className="scan-spot-grid scan-spot-grid--stack">
                {selectedScanSpots.map((spot) => (
                  <article key={spot.id} className="scan-spot-card">
                    <div className="scan-spot-card__top">
                      <span className="scan-spot-card__code">{spot.code}</span>
                      <span className="app-pill">{spot.area}</span>
                    </div>
                    <h3>{spot.name}</h3>
                    <p>{spot.detail}</p>
                    <Link href={`/scan?stand=${encodeURIComponent(spot.code)}`} className="app-button app-button--secondary">
                      Scanner ce spot
                    </Link>
                  </article>
                ))}
              </div>
            ) : null}

            {activeTab === "scans" ? (
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
