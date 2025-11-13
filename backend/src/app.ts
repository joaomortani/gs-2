import express from "express";
import cors from "cors";
import { healthRouter } from "./modules/health/health.routes";
import { skillRoutes } from "./modules/skills/skill.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { challengeRoutes, skillChallengeRoutes } from "./modules/challenges/challenge.routes";
import { progressRoutes } from "./modules/progress/progress.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
import { userRoutes } from "./modules/users/user.routes";
import { assessmentRoutes } from "./modules/assessment/assessment.routes";

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use("/api", healthRouter);
app.use("/api/skills", skillRoutes);
app.use("/api/skills/:skillId/challenges", skillChallengeRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api", progressRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
export { app };