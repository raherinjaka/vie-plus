// lib/rate-limit.ts
import { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 3;           // 3 envois max par IP / fenêtre

// ⚠️ Stockage en mémoire : fonctionne tant que l'instance serverless reste
// "chaude". Sur Vercel, une instance peut être recyclée à tout moment et
// le compteur repart alors à zéro pour cette IP. Ce n'est donc pas une
// garantie absolue, juste un frein contre les boucles de spam rapides.
// Pour une garantie fiable, il faudrait un store partagé (Upstash Redis).
const requestCounts = new Map<string, RateLimitEntry>();

function cleanup(now: number) {
  for (const [ip, entry] of requestCounts.entries()) {
    if (now - entry.windowStart > WINDOW_MS) {
      requestCounts.delete(ip);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    requestCounts.set(ip, { count: 1, windowStart: now });
    // Nettoyage occasionnel pour éviter que la Map ne grossisse indéfiniment
    if (requestCounts.size > 500) cleanup(now);
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000),
    };
  }

  entry.count += 1;
  return { allowed: true };
}

export function getClientIp(req: NextRequest): string {
  // Vercel injecte x-forwarded-for avec l'IP réelle du client en premier
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}