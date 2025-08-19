import { Router } from "express";
import { prisma } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router = Router();

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

// Helper: sign and set cookie
function setAuthCookie(res: any, payload: object) {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only over https in prod
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}

router.post("/register", async (req, res) => {
    try {
        const email = emailSchema.parse(req.body.email);
        const password = passwordSchema.parse(req.body.password);

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(409).json({ error: "Email already registered" });

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({ data: { email, passwordHash } });

        setAuthCookie(res, { id: user.id, email: user.email, role: user.role });

        res.json({ user: { id: user.id, email: user.email, role: user.role } });
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.issues.map(i => i.message).join(", ") });
        }
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const email = emailSchema.parse(req.body.email);
        const password = passwordSchema.parse(req.body.password);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // use HTTPS in prod
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.json({ user: { id: user.id, email: user.email, role: user.role } });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

router.get("/me", async (req, res) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Missing token" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ id: user.id, email: user.email, role: user.role });
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
});

export default router;
