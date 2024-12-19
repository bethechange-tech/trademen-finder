import Redis from 'ioredis';

const REDIS_URL =
  process.env.REDIS_URL ||
  // 'redis://default:79c93605dad44827b52784b039ce300d@relaxing-newt-46400.upstash.io:46400';
  'redis://localhost:6379'
const ENABLE_CACHE = process.env.ENABLE_CACHE === 'true';

export class CacheService {
  private static instance: Redis | null = null;

  private constructor() { }

  public static getInstance(): Redis | null {
    if (!ENABLE_CACHE) {
      console.log('Cache is disabled by feature flag.');
      return null;
    }

    if (!CacheService.instance) {
      CacheService.instance = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 3,
        reconnectOnError: (err) => {
          if (err.message.includes('READONLY')) {
            // Reconnect only on 'READONLY' errors
            return true;
          }
          return false;
        },
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      CacheService.instance.on('error', (error: Error) => {
        console.error('Redis Error:', error.message);
        CacheService.instance?.quit().catch((err) => console.error('Redis Quit Error:', err));
        CacheService.instance = null;
      });
    }

    return CacheService.instance;
  }

  public static async set(
    key: string | Buffer,
    value: string | Buffer | number,
    expirationInSeconds = 3600
  ): Promise<void> {
    const client = CacheService.getInstance();
    if (!client) return;

    try {
      await client.set(key, value, 'EX', expirationInSeconds);
    } catch (error) {
      console.error('Redis Set Error:', error);
    }
  }

  public static async get(key: string | Buffer): Promise<string | null> {
    const client = CacheService.getInstance();
    if (!client) return null;

    try {
      return await client.get(key);
    } catch (error) {
      console.error('Redis Get Error:', error);
      return null;
    }
  }
}
