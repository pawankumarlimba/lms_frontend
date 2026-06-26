/**
 * TokenStore centralises where the JWT lives on the client. Using a class
 * (instead of scattering localStorage calls) means the storage mechanism
 * can change later (e.g. to an in-memory store) without touching callers.
 *
 * Why not rely solely on the httpOnly cookie? Cross-domain deployments
 * (frontend and backend on two different *.vercel.app subdomains) make the
 * cookie third-party from the browser's perspective, which Chrome/Safari
 * increasingly block or restrict by default. The Authorization header has
 * no such restriction, so it's used as the primary auth channel; the
 * backend still also supports the cookie for same-origin/proxied setups.
 */
export class TokenStore {
  private static readonly STORAGE_KEY = "lms_access_token";

  public static get(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TokenStore.STORAGE_KEY);
  }

  public static set(token: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TokenStore.STORAGE_KEY, token);
  }

  public static clear(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TokenStore.STORAGE_KEY);
  }
}
