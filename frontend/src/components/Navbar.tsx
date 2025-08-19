import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/"); // redirect home
    };

    return (
        <nav
            style={{
                padding: "1rem",
                borderBottom: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <div>
                <Button component={Link} to="/">
                    Home
                </Button>

                {user?.role === "admin" && (
                    <Button component={Link} to="/admin">
                        Admin
                    </Button>
                )}
            </div>

            <div>
                {user ? (
                    <>
                        <span style={{ marginRight: "1rem" }}>
                            Logged in as <strong>{user.email}</strong>
                        </span>
                        <Button color="secondary" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <Button component={Link} to="/login" color="primary">
                        Login
                    </Button>
                )}
            </div>
        </nav>
    );
}
