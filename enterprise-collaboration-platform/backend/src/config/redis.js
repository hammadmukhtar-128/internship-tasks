/**
 * redis.js — Optional Redis integration
 *
 * Behaviour when Redis is unavailable:
 *  - No crash, no repeated error logs (one warning on first failure).
 *  - `cache` becomes a silent no-op (get → null, set/del → void).
 *  - `pubClient` and `subClient` are null so Socket.IO falls back to its
 *    default in-process adapter (single-process mode).
 *  - `redisAvailable` flag lets callers check Redis status at runtime.
 */

const Redis = require('ioredis');
const env = require('./env');
const logger = require('./logger');

// ─── State ────────────────────────────────────────────────────────────────────

let redisClient = null;
let pubClient = null;
let subClient = null;
let redisAvailable = false;

// ─── No-op cache (used when Redis is down) ────────────────────────────────────

const noopCache = {
  async get() { return null; },
  async set() {},
  async del() {},
};

// ─── Real cache (used when Redis is available) ────────────────────────────────

function buildCache(client) {
  return {
    async get(key) {
      try {
        const val = await client.get(key);
        return val ? JSON.parse(val) : null;
      } catch (err) {
        logger.warn(`[cache] get failed for ${key}: ${err.message}`);
        return null;
      }
    },

    async set(key, value, ttlSeconds = 60) {
      try {
        await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      } catch (err) {
        logger.warn(`[cache] set failed for ${key}: ${err.message}`);
      }
    },

    async del(pattern) {
      try {
        if (pattern.includes('*')) {
          const keys = await client.keys(pattern);
          if (keys.length) await client.del(keys);
        } else {
          await client.del(pattern);
        }
      } catch (err) {
        logger.warn(`[cache] del failed for ${pattern}: ${err.message}`);
      }
    },
  };
}

// ─── Client factory ───────────────────────────────────────────────────────────

/**
 * Creates an ioredis client that:
 *  - Gives up retrying after 5 attempts (retryStrategy → null).
 *  - Uses lazyConnect so the constructor never throws.
 *  - Logs each error at most once (subsequent errors are silently ignored).
 */
function createClient(name) {
  let errorLogged = false;

  const client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,           // do NOT auto-connect on construction
    enableOfflineQueue: false,   // reject queued commands immediately when down
    retryStrategy(times) {
      if (times > 5) return null; // stop retrying — ioredis will emit 'close'
      return Math.min(times * 300, 3000);
    },
  });

  client.on('connect', () => {
    errorLogged = false;
    logger.info(`[redis:${name}] connected`);
  });

  // Suppress the storm of repeated error events — log only the first one.
  client.on('error', (err) => {
    if (!errorLogged) {
      logger.warn(`[redis:${name}] unavailable — ${err.message}. Redis features disabled.`);
      errorLogged = true;
    }
  });

  return client;
}

// ─── Initialisation (called once at startup) ──────────────────────────────────

/**
 * Attempt to connect to Redis.  If the connection fails within ~2 s the
 * promise resolves normally (no throw) and Redis features are disabled.
 *
 * This function is intentionally NOT awaited in module scope so that the
 * module can be required synchronously while the async probe runs in the
 * background.  The exported `cache`, `pubClient`, and `subClient` are
 * updated in-place once the result is known.
 */
async function initRedis() {
  const probe = createClient('probe');
  try {
    // connect() resolves on success, rejects on first failure
    await probe.connect();
    await probe.ping(); // confirm the connection is live
    await probe.quit();

    // ── Redis is available ──────────────────────────────────────────────────
    redisAvailable = true;

    redisClient = createClient('cache');
    pubClient   = createClient('pub');
    subClient   = createClient('sub');

    await redisClient.connect();
    await pubClient.connect();
    await subClient.connect();

    // Replace the exported cache object with the real implementation
    Object.assign(cache, buildCache(redisClient));

    logger.info('[redis] Redis connected — caching and pub/sub enabled.');
  } catch (err) {
    // ── Redis is unavailable — degrade gracefully ───────────────────────────
    redisAvailable = false;
    redisClient = null;
    pubClient   = null;
    subClient   = null;

    logger.warn(
      `[redis] Could not connect to Redis (${err.message}). ` +
      'Running without caching and pub/sub.'
    );

    // Make sure the probe client is fully closed
    probe.disconnect(false);
  }
}

// ─── Exported objects (mutated in-place by initRedis) ────────────────────────

/**
 * `cache` starts as a no-op and is upgraded to the real implementation if
 * Redis becomes available.  All callers import this reference once and it
 * always reflects the current state.
 */
const cache = { ...noopCache };

// Kick off the async Redis probe — errors are handled internally
initRedis().catch(() => {});

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  /** The raw ioredis cache client, or null when Redis is unavailable. */
  get redisClient() { return redisClient; },

  /** The ioredis pub client for Socket.IO adapter, or null. */
  get pubClient() { return pubClient; },

  /** The ioredis sub client for Socket.IO adapter, or null. */
  get subClient() { return subClient; },

  /** True when Redis is connected and features are active. */
  get redisAvailable() { return redisAvailable; },

  /** Cache helper — no-op when Redis is unavailable, real impl otherwise. */
  cache,
};
