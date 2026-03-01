/**
 * API base URL for backend requests.
 * - Uses VITE_API_URL if set (for production/Loveable deployment)
 * - Otherwise uses current hostname + :8000 when on local/network (localhost, 192.168.x.x, 10.x.x.x)
 *   so uploads work when accessing the app from another device on the same network
 */
export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, ""); // remove trailing slash

  const host = typeof window !== "undefined" ? window.location.hostname : "127.0.0.1";
  return `https://quantum-bots.onrender.com:8000`;
};
