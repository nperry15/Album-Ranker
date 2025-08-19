import { useEffect, useState } from "react";

export interface User {
    id: number;
    email: string;
    role: "user" | "admin";
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Fetch current user from backend using the cookie
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/me", {
                    credentials: "include", // send HttpOnly cookie
                });
                if (!res.ok) {
                    setUser(null);
                    return;
                }
                const data: User = await res.json();
                setUser(data);
            } catch (err) {
                console.error(err);
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch("http://localhost:4000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // store HttpOnly cookie automatically
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Login failed");
            }
            const data: { user: User } = await res.json();
            setUser(data.user);
            return data.user;
        } catch (err) {
            throw err;
        }
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:4000/api/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error(err);
        } finally {
            setUser(null);
        }
    };

    return { user, login, logout };
}
