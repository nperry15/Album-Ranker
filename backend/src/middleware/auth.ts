import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface User {
    id: number;
    email: string;
    role: "user" | "admin";
}

export function authRequired(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token; // read from HttpOnly cookie
    if (!token) return res.status(401).json({ error: "Missing token" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as User;
        (req as any).user = payload;
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}


export function adminRequired(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user as User | undefined;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (user.role !== "admin") return res.status(403).json({ error: "Admin only" });
    next();
}
