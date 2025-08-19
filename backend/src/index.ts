import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import usersRouter from "./routes/users";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ allow frontend to send cookies
app.use(
    cors({
        origin: "http://localhost:5173", // your Vite frontend
        credentials: true, // 🔑 very important
    })
);

// Routes
app.use("/api", authRoutes);
app.use("/api/users", usersRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
