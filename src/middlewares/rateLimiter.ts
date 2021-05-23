/**
 * Basic rate limit. Other options to consider
 * - express-limiter (Works with redis)
 * - express-brute
 * - ate-limiter-flexible
*/

import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
});
