/**
 * API base URL for backend requests.
 * - Uses VITE_API_URL if set (REQUIRED for Render deployment - set in Render dashboard!)
 * - Otherwise uses hostname:8000 for local/same-network
 * Note: .env is gitignored - Render builds need VITE_API_URL set in service Environment
 */
const BACKEND_URL = "https://quantum-bots.onrender.com";

export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  // Fallback for deployed frontend when VITE_API_URL wasn't set at build time
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return BACKEND_URL;
  }

  const host = typeof window !== "undefined" ? window.location.hostname : "127.0.0.1";
  return `http://${host}:8000`;
};
