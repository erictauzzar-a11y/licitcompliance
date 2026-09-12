/**
 * In-Memory Sliding Window Rate Limiter com proteção contra Brute-Force
 * Adequado para produção na Vercel e ambientes serverless
 */

interface RateLimitRecord {
  count: number;
  firstRequestTime: number;
  blockedUntil?: number;
}

const store = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  windowMs: number; // Janela de tempo em milissegundos
  maxRequests: number; // Máximo de requisições permitidas na janela
  blockDurationMs?: number; // Duração de bloqueio se estourar o limite
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  blockedUntil?: number;
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const { windowMs, maxRequests, blockDurationMs = 60000 } = options;

  let record = store.get(key);

  // Se o IP/chave estiver bloqueado
  if (record?.blockedUntil && record.blockedUntil > now) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.firstRequestTime + windowMs,
      blockedUntil: record.blockedUntil,
    };
  }

  // Se não existir registro ou a janela expirou
  if (!record || now - record.firstRequestTime > windowMs) {
    record = {
      count: 1,
      firstRequestTime: now,
    };
    store.set(key, record);
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }

  // Incrementa requisição
  record.count += 1;

  if (record.count > maxRequests) {
    record.blockedUntil = now + blockDurationMs;
    store.set(key, record);
    return {
      success: false,
      remaining: 0,
      resetTime: record.firstRequestTime + windowMs,
      blockedUntil: record.blockedUntil,
    };
  }

  store.set(key, record);
  return {
    success: true,
    remaining: maxRequests - record.count,
    resetTime: record.firstRequestTime + windowMs,
  };
}

/**
 * Obtém IP real do cliente através dos headers padrão de reverse proxy / Vercel
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
