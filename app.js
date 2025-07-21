import express from "express";
import morgan from "morgan";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";
import sessionRouter from "./routes/sessionRoutes.js";
import globalErrorHandler from "./controllers/errorController.js";
import passport from "passport";
import applySecurity from "./utils/applySecurity.js";
import { webhookHandler } from "./controllers/sessionController.js";
const strategyModule = import("./config/passportGoogleStrategy.js");

const app = express();

app.post("/webhook", express.raw({ type: "application/json" }), webhookHandler);

app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));

applySecurity(app);

app.use(passport.initialize());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/doctors", doctorRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/sessions", sessionRouter);

app.use(globalErrorHandler);

export default app;
