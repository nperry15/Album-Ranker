import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Alert,
} from "@mui/material";
import { useAuthContext } from "../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuthContext(); // grab login() from context
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("http://localhost:4000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // send/receive cookies
                body: JSON.stringify({ email, password }), // <--- send login info
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                return;
            }

            // ✅ use AuthContext's login()
            login(data.user, data.token);

            navigate("/admin");
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Login
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        required
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        required
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Box>
        </Container>
    );
}
