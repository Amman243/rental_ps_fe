import { create } from "zustand";
import { api, setupApiInterceptors } from "../lib/api";

const STORAGE_KEY = "rentalps-auth-session";
const defaultSession = {
  user: null,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  hasAccess: false,
};

const defaultState = {
  ...defaultSession,
  status: "idle",
  error: null,
  initialized: false,
};

export const useAuthStore = create((set, get) => ({
  ...defaultState,

  hydrate: () => {
    if (get().initialized) return;
    const stored = readSessionFromStorage();
    if (stored) {
      set((state) => ({
        ...state,
        ...stored,
        status: "success",
        initialized: true,
      }));
    } else {
      set((state) => ({ ...state, initialized: true }));
    }
  },

  setSession: (session) => {
    const nextSession = {
      ...pickSessionSlice(get()),
      ...session,
      hasAccess: true,
    };
    set((state) => ({
      ...state,
      ...nextSession,
      status: "success",
      error: null,
      initialized: true,
    }));
    persistSession(nextSession);
  },

  clearSession: () => {
    clearPersistedSession();
    set((state) => ({
      ...state,
      ...defaultSession,
      status: "idle",
      error: null,
      initialized: true,
    }));
  },

  login: async (credentials) => {
    set((state) => ({ ...state, status: "loading", error: null }));
    try {
      const { data } = await api.post("/auth/login", credentials);
      const session = normalizeSession(data?.session);
      if (!session) {
        throw new Error("Session tidak tersedia");
      }
      console.log("session", session)
      get().setSession(session);
      return session;
    } catch (error) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Login gagal";
      set((state) => ({ ...state, status: "error", error: message }));
      throw error;
    }
  },

  refreshSession: async () => {
    try {
      const { data } = await api.post("/auth/refresh");
      const session = normalizeSession(data?.session, get().user);
      if (!session) {
        throw new Error("Session baru tidak tersedia");
      }
      get().setSession(session);
      return session;
    } catch (error) {
      console.error("Refresh token gagal", error);
      set((state) => ({ ...state, hasAccess: false }));
      get().clearSession();
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Logout gagal di server", error);
    } finally {
      set((state) => ({ ...state, hasAccess: false }));
      get().clearSession();
    }
  },
}));

setupApiInterceptors({
  onUnauthorized: async () => {
    const { hasAccess, refreshSession, clearSession } = useAuthStore.getState();
    if (!hasAccess) {
      clearSession();
      throw new Error("Tidak memiliki akses");
    }
    await refreshSession();
  },
});

function pickSessionSlice(state) {
  return {
    user: state.user,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    expiresAt: state.expiresAt,
    hasAccess: state.hasAccess,
  };
}

function readSessionFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Gagal membaca sesi dari storage", error);
    return null;
  }
}

function persistSession(session) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.warn("Gagal menyimpan sesi", error);
  }
}

function clearPersistedSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

function normalizeSession(session, fallbackUser = null) {
  if (!session) return null;
  return {
    ...session,
    user: session.user ?? fallbackUser ?? null,
    hasAccess: true,
  };
}
