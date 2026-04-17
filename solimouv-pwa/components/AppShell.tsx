"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";

export default function AppShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (elements.length === 0) {
      return;
    }

    const isMobileLanding =
      pathname === "/" && window.matchMedia("(max-width: 768px)").matches;
    const isPassportRoute = pathname === "/passeport";

    if (isMobileLanding || isPassportRoute || !("IntersectionObserver" in window)) {
      const frame = window.requestAnimationFrame(() => {
        elements.forEach((element) => element.classList.add("is-revealed"));
      });

      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <div key={pathname} className="page-transition min-h-screen pb-24 md:pb-0">
        {children}
      </div>
      <BottomNav />
    </>
  );
}
