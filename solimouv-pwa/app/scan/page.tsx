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

// ─── Logique scan ─────────────────────────────────────────────────────────────
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

    // Trouver le stand
    const { data: stand } = await supabase
      .from("festival_stands")
      .select("*")
      .eq("qr_code", code)
      .eq("active", true)
      .single();

    if (!stand) {
      setErrorMsg("Stand introuvable. Vérifie que tu scanned le bon QR code.");
      setStatus("error");
      return;
    }

    setScannedStand(stand as FestivalStand);

    // Vérifier doublon
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

    // Enregistrer le scan
    const { error: scanErr } = await supabase.from("passport_scans").insert({
      session_id: sessionId,
      stand_id: stand.id,
      points_earned: stand.points,
    });

    if (scanErr) {
      // Contrainte unique = déjà scanné (race condition)
      if (scanErr.code === "23505") {
        setStatus("already_scanned");
        return;
      }
      setErrorMsg("Erreur lors de l'enregistrement. Réessaie.");
      setStatus("error");
      return;
    }

    // Mettre à jour les points
    await addPassportPoints(sessionId, stand.points, 0);

    setPointsEarned(stand.points);
    setStatus("success");
  }, []);

  // Si QR code dans l'URL (lien direct depuis un QR code physique)
  useEffect(() => {
    if (standCode && status === "idle") {
      processCode(standCode);
    }
  }, [standCode, status, processCode]);

  // Nettoyage caméra au démontage
  useEffect(() => {
    return () => {
      scanningRef.current = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function stopCamera() {
    scanningRef.current = false;
    streamRef.current?.getTracks().forEach((t) => t.stop());
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

      // BarcodeDetector (Chrome Android + Safari iOS 17+)
      if (!("BarcodeDetector" in window)) {
        setErrorMsg(
          "Ton navigateur ne supporte pas le scan natif. Utilise directement la caméra de ton téléphone pour scanner le QR code du stand — il s'ouvrira automatiquement."
        );
        setStatus("error");
        stream.getTracks().forEach((t) => t.stop());
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
            stream.getTracks().forEach((t) => t.stop());
            const raw: string = barcodes[0].rawValue;
            // Extraire le paramètre ?stand= si c'est une URL complète
            const match = raw.match(/[?&]stand=([^&]+)/);
            processCode(match ? decodeURIComponent(match[1]) : raw);
          } else {
            requestAnimationFrame(tick);
          }
        } catch {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    } catch {
      setErrorMsg(
        "Impossible d'accéder à la caméra. Vérifie les permissions de ton navigateur."
      );
      setStatus("error");
    }
  }

  function reset() {
    setScannedStand(null);
    setErrorMsg("");
    setPointsEarned(0);
    setStatus("idle");
  }

  // ── Rendu ──
  return (
    <div className="max-w-lg mx-auto px-4 py-12 sm:py-20 text-center">
      <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">
        Soli&apos;Passeport
      </p>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
        Scanner un stand
      </h1>
      <p className="text-gray-400 mb-8">
        Scanne le QR code affiché à chaque stand du festival pour valider ta
        participation et gagner des points.
      </p>

      {/* IDLE */}
      {status === "idle" && (
        <div className="space-y-4">
          <button
            onClick={startCamera}
            className="w-full py-5 bg-teal text-navy font-bold text-lg rounded-2xl hover:bg-teal/90 transition-colors focus-visible:ring-2 focus-visible:ring-teal"
            aria-label="Ouvrir la caméra pour scanner"
          >
            📷 Ouvrir la caméra
          </button>
          <div className="text-gray-600 text-sm space-y-1">
            <p>— ou —</p>
            <p>
              Utilise la caméra native de ton téléphone pour scanner le QR code
              du stand. L&apos;application s&apos;ouvrira automatiquement.
            </p>
          </div>
        </div>
      )}

      {/* SCANNING */}
      {status === "scanning" && (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-navy-dark aspect-square border border-teal/20">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
              aria-label="Flux caméra pour le scan QR"
            />
            {/* Viseur */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <div className="relative w-52 h-52">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-teal rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-teal rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-teal rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-teal rounded-br-lg" />
              </div>
            </div>
          </div>
          <p className="text-teal text-sm animate-pulse" aria-live="polite">
            Pointe la caméra vers le QR code du stand...
          </p>
          <button
            onClick={stopCamera}
            className="text-gray-500 text-sm hover:text-gray-300 transition-colors underline"
            aria-label="Arrêter le scan"
          >
            Annuler
          </button>
        </div>
      )}

      {/* PROCESSING */}
      {status === "processing" && (
        <div className="py-16">
          <div
            className="animate-spin w-16 h-16 border-4 border-teal border-t-transparent rounded-full mx-auto mb-4"
            role="status"
            aria-label="Enregistrement en cours"
          />
          <p className="text-gray-400">Enregistrement de ta participation...</p>
        </div>
      )}

      {/* SUCCESS */}
      {status === "success" && (
        <div className="py-6 space-y-6" role="alert" aria-live="assertive">
          <span className="text-7xl block" role="img" aria-label="Succès">
            ✅
          </span>
          <div>
            <h2 className="text-2xl font-extrabold text-white mb-2">
              {scannedStand?.name} validé !
            </h2>
            <div className="inline-flex items-center gap-2 bg-teal/20 border border-teal rounded-full px-6 py-2 mb-3">
              <span
                className="text-teal font-extrabold text-2xl"
                aria-label={`${pointsEarned} points gagnés`}
              >
                +{pointsEarned} pts
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              {scannedStand?.sport} · {scannedStand?.location}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/passeport"
              className="flex-1 py-3 bg-teal text-navy font-bold rounded-full hover:bg-teal/90 transition-colors"
              aria-label="Voir mon passeport mis à jour"
            >
              Mon passeport
            </Link>
            <button
              onClick={reset}
              className="flex-1 py-3 border border-teal text-teal font-bold rounded-full hover:bg-teal/10 transition-colors"
              aria-label="Scanner un autre stand"
            >
              Scanner un autre
            </button>
          </div>
        </div>
      )}

      {/* ALREADY SCANNED */}
      {status === "already_scanned" && (
        <div className="py-6 space-y-4" role="alert">
          <span className="text-6xl block" role="img" aria-label="Déjà scanné">
            ⚡
          </span>
          <h2 className="text-xl font-bold text-white">Déjà scanné !</h2>
          <p className="text-gray-400">
            Tu as déjà validé le stand{" "}
            <strong className="text-white">{scannedStand?.name}</strong>.
            Chaque stand ne compte qu&apos;une fois.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/passeport"
              className="px-6 py-3 bg-teal text-navy font-bold rounded-full hover:bg-teal/90 transition-colors text-sm"
            >
              Mon passeport
            </Link>
            <button
              onClick={reset}
              className="px-6 py-3 border border-gray-600 text-gray-400 font-bold rounded-full hover:bg-white/5 transition-colors text-sm"
            >
              Scanner un autre stand
            </button>
          </div>
        </div>
      )}

      {/* NO PASSPORT */}
      {status === "no_passport" && (
        <div className="py-6 space-y-4" role="alert">
          <span className="text-6xl block" role="img" aria-label="Passeport requis">
            🎟
          </span>
          <h2 className="text-xl font-bold text-white">
            Crée ton Soli&apos;Passeport d&apos;abord !
          </h2>
          <p className="text-gray-400">
            Tu dois créer un passeport pour collecter des points.
          </p>
          <Link
            href="/passeport"
            className="inline-block px-8 py-3 bg-teal text-navy font-bold rounded-full hover:bg-teal/90 transition-colors"
          >
            Créer mon passeport
          </Link>
        </div>
      )}

      {/* ERROR */}
      {status === "error" && (
        <div className="py-6 space-y-4" role="alert">
          <span className="text-6xl block" role="img" aria-label="Erreur">
            ❌
          </span>
          <p className="text-white font-semibold">{errorMsg}</p>
          <button
            onClick={reset}
            className="px-6 py-3 border border-teal text-teal font-bold rounded-full hover:bg-teal/10 transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Export avec Suspense (requis pour useSearchParams) ───────────────────────
export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center min-h-[60vh]"
          role="status"
          aria-label="Chargement"
        >
          <div className="animate-spin w-12 h-12 border-4 border-teal border-t-transparent rounded-full" />
        </div>
      }
    >
      <ScanContent />
    </Suspense>
  );
}
