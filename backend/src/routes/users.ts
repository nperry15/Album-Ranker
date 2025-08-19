import express from "express";
import { authRequired, adminRequired, User } from "../middleware/auth";

const router = express.Router();

// Temporary in-memory users (replace with DB later)
let users: User[] = [
    { id: 1, email: "alice@example.com", role: "user" },
    { id: 2, email: "bob@example.com", role: "admin" },
    { id: 3, email: "charlie@example.com", role: "user" },
];

// GET /api/users (admin only)
router.get("/", authRequired, adminRequired, (req, res) => {
    res.json(users);
});

// GET /api/users/:id (admin or self)
router.get("/:id", authRequired, (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const requester = (req as any).user as User;

    if (requester.role !== "admin" && requester.id !== userId) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const user = users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
});

// PATCH /api/users/:id/role (admin only)
router.patch("/:id/role", authRequired, adminRequired, (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { role } = req.body;
    if (role !== "user" && role !== "admin") {
        return res.status(400).json({ error: "Invalid role" });
    }

    user.role = role;
    res.json(user);
});


// DELETE /api/users/:id (admin only)
router.delete("/:id", authRequired, adminRequired, (req, res) => {
    const userId = parseInt(req.params.id, 10);
    users = users.filter((u) => u.id !== userId);
    res.status(204).send();
});

export default router;
