import express from "express";
import cors from "cors";
import { healthRouter } from "./modules/health/health.routes";
import { skillRoutes } from "./modules/skills/skill.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use("/api", healthRouter);
app.use("/api/skills", skillRoutes);
app.use("/api/auth", authRoutes);
export { app };