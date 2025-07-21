import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";

export default function applySecurity(app) {
  app.use(helmet());

  app.use(hpp());

  app.use(mongoSanitize());

  app.use(xss());

  app.use(
    rateLimit({
      limit: 100,
      windowMs: 15 * 60 * 1000,
      message: "Too many requests from this IP, try again later",
      legacyHeaders: false,
      standardHeaders: true,
    }),
  );
}
