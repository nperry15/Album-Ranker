import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import spotifyRoutes from "./routes/spotify.ts";
import sequelize from "./models/index";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN?.split(",") || true,
    credentials: true,
}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use('/api/albums', spotifyRoutes);

// --- Sync database before starting ---
(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("✅ Database synced");
    } catch (err) {
        console.error("❌ Failed to sync database", err);
        process.exit(1);
    }
})();

export default app;