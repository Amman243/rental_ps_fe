import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export function useAuthSession() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const initialized = useAuthStore((state) => state.initialized);
  const hasAccess = useAuthStore((state) => state.hasAccess);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const refreshSession = useAuthStore((state) => state.refreshSession);

  useEffect(() => {
    if (!initialized) {
      hydrate();
    }
  }, [initialized, hydrate]);

  useEffect(() => {
    if (!initialized || !hasAccess || !expiresAt) return;

    let timeoutId;
    const scheduleRefresh = () => {
      const expirationTime = new Date(expiresAt).getTime();
      const now = Date.now();
      const buffer = 5000; // refresh 5 detik sebelum kadaluarsa
      const delay = Math.max(0, expirationTime - now - buffer);

      timeoutId = window.setTimeout(() => {
        refreshSession().catch((error) => {
          console.warn("Auto refresh gagal", error);
        });
      }, delay || 0);
    };

    scheduleRefresh();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [initialized, hasAccess, expiresAt, refreshSession]);

  return { initialized };
}
