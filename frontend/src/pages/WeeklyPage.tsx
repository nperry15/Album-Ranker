import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Box,
    Card,
    CardMedia,
    CardContent,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import { Navigate } from "react-router-dom";

interface Song {
    id: string;
    title: string;
}

interface Album {
    id: string;
    title: string;
    coverUrl: string;
    songs: Song[];
}

export default function WeeklyPage() {
    const { user } = useAuthContext();
    const [album, setAlbum] = useState<Album | null>(null);

    if (!user) return <Navigate to="/login" />;

    useEffect(() => {
        axios
            .get("/api/albums/weekly", { withCredentials: true })
            .then((res) => setAlbum(res.data))
            .catch((err) => console.error("Failed to load weekly album:", err));
    }, []);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination || !album) return;

        const reorderedSongs = Array.from(album.songs);
        const [moved] = reorderedSongs.splice(result.source.index, 1);
        reorderedSongs.splice(result.destination.index, 0, moved);

        setAlbum({ ...album, songs: reorderedSongs });

        // optionally send new order to backend
        // axios.post("/api/albums/weekly/reorder", { songs: reorderedSongs }, { withCredentials: true });
    };

    if (!album) return <Typography>Loading this week’s album...</Typography>;

    return (
        <Container>
            <Card sx={{ display: "flex", mb: 3 }}>
                <CardMedia
                    component="img"
                    sx={{ width: 200 }}
                    image={album.coverUrl}
                    alt={album.title}
                />
                <CardContent>
                    <Typography variant="h4">{album.title}</Typography>
                </CardContent>
            </Card>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="songs">
                    {(provided) => (
                        <List
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
                        >
                            {album.songs.map((song, index) => (
                                <Draggable key={song.id} draggableId={song.id} index={index}>
                                    {(provided, snapshot) => (
                                        <ListItem
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            sx={{
                                                bgcolor: snapshot.isDragging ? "#e0f7fa" : "white",
                                                mb: 1,
                                                borderRadius: 1,
                                            }}
                                        >
                                            <ListItemText primary={song.title} />
                                        </ListItem>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </List>
                    )}
                </Droppable>
            </DragDropContext>
        </Container>
    );
}
