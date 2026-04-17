"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase, FestivalStand, addPassportPoints } from "@/lib/supabase";

type ScanStatus =
  | "idle"
  | "scanning"
  | "processing"
  | "success"
  | "already_scanned"
  | "no_passport"
  | "error";

function statusTitle(status: ScanStatus, stand?: FestivalStand | null) {
  if (status === "success") return stand?.name ?? "Participation validee";
  if (status === "already_scanned") return "Stand deja valide";
  if (status === "no_passport") return "Cree ton pass d'abord";
  if (status === "error") return "Impossible de valider";
  return "Scanner un stand";
}

function statusCopy(status: ScanStatus, stand?: FestivalStand | null, errorMsg?: string) {
  if (status === "success") {
    return `Joue, participe et continue ton parcours sur ${stand?.sport ?? "le festival"}.`;
  }
  if (status === "already_scanned") {
    return "Tu as deja valide ce stand. Chaque activite ne compte qu'une seule fois.";
  }
  if (status === "no_passport") {
    return "Tu dois creer un Soli'Passeport avant de pouvoir cumuler des points.";
  }
  if (status === "error") {
    return errorMsg || "Le scan n'a pas pu etre finalise. Reessaie ou utilise un autre QR code.";
  }
  return "Scanne le QR code affiche a chaque stand du festival pour valider ta participation et gagner des points.";
}

function ScanContent() {
  const searchParams = useSearchParams();
  const standCode = searchParams.get("stand");

  const [status, setStatus] = useState<ScanStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [scannedStand, setScannedStand] = useState<FestivalStand | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningRef = useRef(false);

  const processCode = useCallback(async (code: string) => {
    setStatus("processing");

    const sessionId = localStorage.getItem("solimouv_session_id");
    if (!sessionId) {
      setStatus("no_passport");
      return;
    }

    const { data: stand } = await supabase
      .from("festival_stands")
      .select("*")
      .eq("qr_code", code)
      .eq("active", true)
      .single();

    if (!stand) {
      setErrorMsg("Stand introuvable. Verifie que tu scannes le bon QR code.");
      setStatus("error");
      return;
    }

    setScannedStand(stand as FestivalStand);

    const { data: existing } = await supabase
      .from("passport_scans")
      .select("id")
      .eq("session_id", sessionId)
      .eq("stand_id", stand.id)
      .maybeSingle();

    if (existing) {
      setStatus("already_scanned");
      return;
    }

    const { error: scanErr } = await supabase.from("passport_scans").insert({
      session_id: sessionId,
      stand_id: stand.id,
      points_earned: stand.points,
    });

    if (scanErr) {
      if (scanErr.code === "23505") {
        setStatus("already_scanned");
        return;
      }
      setErrorMsg("Erreur lors de l'enregistrement. Reessaie.");
      setStatus("error");
      return;
    }

    await addPassportPoints(sessionId, stand.points, 0);

    setPointsEarned(stand.points);
    setStatus("success");
  }, []);

  useEffect(() => {
    if (standCode && status === "idle") {
      const timeoutId = window.setTimeout(() => {
        void processCode(standCode);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [standCode, status, processCode]);

  useEffect(() => {
    return () => {
      scanningRef.current = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function stopCamera() {
    scanningRef.current = false;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStatus("idle");
  }

  async function startCamera() {
    setStatus("scanning");
    setErrorMsg("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      if (!("BarcodeDetector" in window)) {
        setErrorMsg(
          "Ton navigateur ne supporte pas le scan natif. Utilise directement la camera de ton telephone pour scanner le QR code du stand."
        );
        setStatus("error");
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const detector = new (window as any).BarcodeDetector({
        formats: ["qr_code"],
      });

      scanningRef.current = true;

      const tick = async () => {
        if (!scanningRef.current || !videoRef.current) return;

        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes.length > 0) {
            scanningRef.current = false;
            stream.getTracks().forEach((track) => track.stop());
            const raw: string = barcodes[0].rawValue;
            const match = raw.match(/[?&]stand=([^&]+)/);
            void processCode(match ? decodeURIComponent(match[1]) : raw);
            return;
          }
        } catch {
          // Keep looping until a QR code is found.
        }

        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    } catch {
      setErrorMsg("Impossible d'acceder a la camera. Verifie les permissions de ton navigateur.");
      setStatus("error");
    }
  }

  function reset() {
    setScannedStand(null);
    setErrorMsg("");
    setPointsEarned(0);
    setStatus("idle");
  }

  const isResultState =
    status === "success" ||
    status === "already_scanned" ||
    status === "no_passport" ||
    status === "error";

  return (
    <div className="app-page scan-page">
      <div className="app-page__container scan-page__container">
        <section className="scan-shell" aria-label="Scanner de stand">
          <div className="scan-shell__visual" data-reveal>
            <div className="scan-shell__visual-top">
              <Link href="/programme" className="scan-shell__back">
                Retour parcours
              </Link>
            </div>

            <div className={`scan-preview ${status === "scanning" ? "is-live" : ""}`}>
              {status === "scanning" ? (
                <>
                  <video
                    ref={videoRef}
                    className="scan-preview__video"
                    muted
                    playsInline
                    aria-label="Flux camera pour scanner un QR code"
                  />
                  <div className="scan-preview__mask" aria-hidden="true">
                    <div className="scan-preview__focus">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </>
              ) : (
                <div className="scan-preview__passport" aria-hidden="true">
                  <div className="scan-preview__ticket scan-preview__ticket--top" />
                  <div className="scan-preview__ticket scan-preview__ticket--middle" />
                  <div className="scan-preview__ticket scan-preview__ticket--badge" />
                </div>
              )}
            </div>

            {status === "scanning" ? (
              <div className="scan-shell__caption">
                <h2>Scannez et ecoutez</h2>
                <p>Scanne le QR code de l&apos;evenement ou du stand pour valider ta participation.</p>
              </div>
            ) : (
              <div className="scan-shell__mini-card">
                <span className="app-pill">Pass</span>
                <h3>Ton passeport pour valider tes activites</h3>
                <p>Chaque scan debloque des points, des badges et la suite du parcours.</p>
              </div>
            )}
          </div>

          <div className="scan-shell__content" data-reveal>
            {!isResultState ? (
              <div className="scan-intro">
                <p className="scan-intro__eyebrow">Soli&apos;Passeport</p>
                <h1>{statusTitle(status, scannedStand)}</h1>
                <p className="scan-intro__copy">{statusCopy(status, scannedStand, errorMsg)}</p>

                {status === "idle" ? (
                  <div className="scan-intro__actions">
                    <button type="button" onClick={startCamera} className="scan-primary-cta">
                      <span>📷</span>
                      <span>Ouvrir la camera</span>
                    </button>

                    <div className="scan-alt-copy">
                      <span>ou</span>
                      <p>
                        Utilise la camera native de ton telephone pour scanner le QR code du stand.
                        L&apos;application s&apos;ouvrira automatiquement.
                      </p>
                    </div>
                  </div>
                ) : null}

                {status === "scanning" ? (
                  <div className="scan-live-panel">
                    <div className="scan-live-panel__chip">Camera active</div>
                    <p>Pointe ton telephone vers le QR code affiche sur le stand.</p>
                    <button type="button" onClick={stopCamera} className="app-button app-button--secondary">
                      Annuler
                    </button>
                  </div>
                ) : null}

                {status === "processing" ? (
                  <div className="scan-processing" role="status" aria-label="Validation en cours">
                    <div className="scan-processing__spinner" />
                    <p>Enregistrement de ta participation...</p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="scan-result">
                <div className="scan-result__backdrop" aria-hidden="true" />
                <div className="scan-result__card" role="alert" aria-live="assertive">
                  <div className="scan-result__icon">
                    {status === "success" ? "🏵️" : status === "already_scanned" ? "⚡" : status === "no_passport" ? "🎟️" : "✕"}
                  </div>

                  <div className="scan-result__body">
                    <h2>{statusTitle(status, scannedStand)}</h2>
                    <p>{statusCopy(status, scannedStand, errorMsg)}</p>

                    {status === "success" ? (
                      <>
                        <div className="scan-result__meta">
                          <span className="app-pill">{scannedStand?.sport ?? "Activite"}</span>
                          <span className="scan-result__location">{scannedStand?.location}</span>
                        </div>
                        <div className="scan-result__points">+{pointsEarned} points</div>
                      </>
                    ) : null}

                    {status === "already_scanned" ? (
                      <div className="scan-result__meta">
                        <span className="app-pill">{scannedStand?.sport ?? "Stand valide"}</span>
                        <span className="scan-result__location">{scannedStand?.location}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="scan-result__actions">
                    {(status === "success" || status === "already_scanned") && (
                      <Link href="/passeport" className="app-button app-button--primary">
                        Voir mon passeport
                      </Link>
                    )}

                    {status === "no_passport" && (
                      <Link href="/passeport" className="app-button app-button--primary">
                        Creer mon passeport
                      </Link>
                    )}

                    {(status === "success" || status === "already_scanned" || status === "error") && (
                      <button type="button" onClick={reset} className="app-button app-button--secondary">
                        Scanner un autre stand
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="app-page scan-page">
          <div className="app-page__container scan-page__container">
            <div className="scan-loading" role="status" aria-label="Chargement">
              <div className="scan-processing__spinner" />
            </div>
          </div>
        </div>
      }
    >
      <ScanContent />
    </Suspense>
  );
}
