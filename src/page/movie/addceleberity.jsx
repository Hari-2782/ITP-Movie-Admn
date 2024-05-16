import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCelebToMovie = () => {
    const [movieId, setMovieId] = useState('');
    const [celebType, setCelebType] = useState('cast');
    const [celebName, setCelebName] = useState('');
    const [celebRole, setCelebRole] = useState('');
    const [celebImage, setCelebImage] = useState('');
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            fetch(`http://localhost:8000/movie/getall`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.ok) {
                    setMovies(data.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        };

        fetchMovies();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/movie/addcelb', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    movieId,
                    celebType,
                    celebName,
                    celebRole,
                    celebImage
                })
            });
            if (!response.ok) {
                toast.error('Failed to add celebrity');
            }
            toast.success('Celebrity added successfully');
        } catch (error) {
            console.error('Error adding celebrity:', error);
            toast.error('Failed to add celebrity');
        }
    };

    return (
        <Container>
            <h1>Add Celebrity to Movie</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="movieId">
                    <Form.Label>Select Movie</Form.Label>
                    <Form.Control as="select" value={movieId} onChange={(e) => setMovieId(e.target.value)}>
                        <option value="">Select a movie</option>
                        {movies.map((movie) => (
                            <option key={movie._id} value={movie._id}>{movie.title}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="celebType">
                    <Form.Label>Celebrity Type</Form.Label>
                    <Form.Control as="select" value={celebType} onChange={(e) => setCelebType(e.target.value)}>
                        <option value="cast">Cast</option>
                        <option value="crew">Crew</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="celebName">
                    <Form.Label>Celebrity Name</Form.Label>
                    <Form.Control type="text" value={celebName} onChange={(e) => setCelebName(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="celebRole">
                    <Form.Label>Celebrity Role</Form.Label>
                    <Form.Control type="text" value={celebRole} onChange={(e) => setCelebRole(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="celebImage">
                    <Form.Label>Celebrity Image URL</Form.Label>
                    <Form.Control type="text" value={celebImage} onChange={(e) => setCelebImage(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">Add Celebrity</Button>
            </Form>
            <ToastContainer position="top-right" />
        </Container>
         
    );
};

export default AddCelebToMovie;
