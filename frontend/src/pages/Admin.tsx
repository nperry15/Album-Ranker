import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Select,
    MenuItem,
    CircularProgress,
    Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Navbar from "../components/Navbar";

interface User {
    id: string;
    username: string;
    email: string;
    role: "user" | "admin";
}

export default function Admin() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("http://localhost:4000/api/users", { withCredentials: true })
            .then(res => {
                console.log("Users:", res.data);
                setUsers(res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleRoleChange = (userId: string, newRole: "user" | "admin") => {
        axios
            .patch(
                `/api/users/${userId}/role`,
                { role: newRole },
                { withCredentials: true } // include cookie for auth
            )
            .then(() => {
                setUsers((prev) =>
                    prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
                );
            })
            .catch((err) => {
                console.error("Failed to update role", err);
            });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Navbar></Navbar>
            <Container>
                <Typography variant="h4" gutterBottom>
                    Admin Dashboard
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Select
                                        value={user.role}
                                        onChange={(e) =>
                                            handleRoleChange(user.id, e.target.value as "user" | "admin")
                                        }
                                    >
                                        <MenuItem value="user">User</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <IconButton>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Container>
        </>
    );
}
