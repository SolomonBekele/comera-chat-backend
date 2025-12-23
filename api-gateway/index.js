import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logger from './src/utils/logger.js';       
import proxy from 'express-http-proxy';
import errorHandler from './src/middleware/errorHandler.js'; 
import { validateToken } from './src/middleware/authMiddleware.js';
import { gatewayRateMiddleware } from './src/middleware/gatewayLimiter.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return next(); // skip express.json()
  }
  return express.json({ limit: '50mb' })(req, res, next);
});


// ======================
// Apply Gateway Limiter
// ======================
// You can optionally pass weightResolver per endpoint
app.use(
  gatewayRateMiddleware({
    weightResolver: (req) => {
      // heavier weight for POST/PUT/DELETE
      return ['POST', 'PUT', 'DELETE'].includes(req.method) ? 5 : 1;
    }
  }));

// ======================
// Logging Middleware
// ======================

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
 
  next();
});

// add proxy optional
const proxyOptions = {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace(/^\/v1/, "/api");
  },
  proxyErrorHandler: (err, res, next) => {
    logger.error(`Proxy error: ${err.message}`);
    res.status(500).json({
      message: `Internal server error`,
      error: err.message,
    });
  },
};



// setting up proxy for user service
app.use(
  "/v1/user",
  proxy(process.env.USER_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
  const contentType = srcReq.headers["content-type"];
  // 🚫 DO NOT set manually for multipart/form-data
  if (contentType?.includes("multipart/form-data")) {
   
    return proxyReqOpts; // keep original header WITH boundary
  }

  // Only set JSON for regular requests
  proxyReqOpts.headers["Content-Type"] = "application/json";
  return proxyReqOpts;
}
,
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from User service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },
  })
);

//setting up proxy for our post service
app.use(
  "/v1/chat",
  validateToken,
  proxy(process.env.CHAT_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["Content-Type"] = "application/json";
      proxyReqOpts.headers["x-user-id"] = srcReq.user.id;

      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from chat service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },
  })
);

//setting up proxy for our media service
app.use(
  "/v1/media",
  validateToken,
  proxy(process.env.MEDIA_SERVICE_URL, {
    ...proxyOptions,
   proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["Content-Type"] = "application/json";
      proxyReqOpts.headers["x-user-id"] = srcReq.user.id;

      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from media service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },
    parseReqBody: false,
  })
);

//setting up proxy for our search service
app.use(
  "/v1/search",
  validateToken,
  proxy(process.env.NOTIFICATION_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["Content-Type"] = "application/json";
      proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;

      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from notification service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },
  })
);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API Gateway is running on port ${PORT}`);
  logger.info(
    `user service is running on port ${process.env.USER_SERVICE_URL}`
  );
  logger.info(
    `chat service is running on port ${process.env.CHAT_SERVICE_URL}`
  );
  // logger.info(
  //   `media service is running on port ${process.env.MEDIA_SERVICE_URL}`
  // );
  // logger.info(
  //   `notification service is running on port ${process.env.NOTIFICATION_SERVICE_URL}`
  // );
  logger.info(`Redis Url ${process.env.REDIS_URI}`);

});