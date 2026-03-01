/**
 * API base URL for backend requests.
 * - Uses VITE_API_URL if set (for production/Render deployment)
 * - Otherwise uses current hostname + :8000 when on local/network
 * Note: Render/cloud hosts use HTTPS on port 443 - do NOT add :8000 to production URLs
 */
export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  const host = typeof window !== "undefined" ? window.location.hostname : "127.0.0.1";
  return `http://${host}:8000`;
};
