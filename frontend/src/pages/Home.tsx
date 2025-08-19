// src/pages/Home.tsx
import { Box, Container, Typography, Button } from "@mui/material";
import { useAuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Home() {
    const { user } = useAuthContext();

    return (
        <>
            <Navbar></Navbar>
            <Container maxWidth="md">
                <Box
                    sx={{
                        mt: 6,
                        textAlign: "center",
                        p: 4,
                        borderRadius: 3,
                        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
                        boxShadow: 3,
                    }}
                >
                    <Typography variant="h3" gutterBottom>
                        Welcome {user ? user.email : "Guest"}!
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        {user
                            ? "You are logged in. Explore the features below."
                            : "Please log in to access more features."}
                    </Typography>

                    {!user && (
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ mt: 3 }}
                            href="/login"
                        >
                            Login
                        </Button>
                    )}

                    {user?.role === "admin" && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="large"
                            sx={{ mt: 3, ml: 2 }}
                            href="/admin"
                        >
                            Go to Admin Dashboard
                        </Button>
                    )}
                </Box>
            </Container>
        </>
    );
}
