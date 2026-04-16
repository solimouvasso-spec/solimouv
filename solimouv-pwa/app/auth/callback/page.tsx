"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get("code");

      if (code) {
        // PKCE flow : échange du code contre une session
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          router.replace("/auth?error=callback");
          return;
        }
        router.replace("/admin");
        return;
      }

      // Vérifier si une session a été établie via le hash (implicit flow)
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/admin");
      } else {
        router.replace("/auth?error=callback");
      }
    }

    handleCallback();
  }, [router, searchParams]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
      role="status"
      aria-label="Connexion en cours"
    >
      <div className="animate-spin w-12 h-12 border-4 border-teal border-t-transparent rounded-full mb-6" />
      <h1 className="text-white text-xl font-semibold mb-2">Connexion en cours...</h1>
      <p className="text-gray-500 text-sm">Tu vas être redirigé automatiquement.</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center min-h-[60vh]"
          role="status"
        >
          <div className="animate-spin w-12 h-12 border-4 border-teal border-t-transparent rounded-full" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
