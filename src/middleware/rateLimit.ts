import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 500, // 0.5 s
  max: 1, // limit 1 request on 0.5s
  message: 'Too many connection',
});
