declare global {
  namespace App {
    interface Platform {
      env?: {
        UPSTASH_REDIS_REST_URL?: string;
        UPSTASH_REDIS_REST_TOKEN?: string;
      };
      context?: {
        waitUntil(promise: Promise<unknown>): void;
      };
      caches?: CacheStorage & { default: Cache };
    }
  }
}

export {};
