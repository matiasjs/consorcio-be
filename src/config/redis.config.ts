import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  // Check if REDIS_URL is provided (for production environments like Render)
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    return {
      url: redisUrl,
    };
  }

  // Fallback to individual connection parameters
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  };
});
