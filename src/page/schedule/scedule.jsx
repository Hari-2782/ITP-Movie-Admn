import React, { useEffect, useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Schedule = () => {
    const [movies, setMovies] = useState([]);
    const [screens, setScreens] = useState([]);
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [loadingScreens, setLoadingScreens] = useState(true);
    const [screenType, setScreenType] = useState("");
    const [formData, setFormData] = useState({
      screenId: "",
      movieId: "",
      showTime: "",
      showDate: "",
    });
  
    useEffect(() => {
      fetchMovies();
      fetchScreens();
    }, []);
  
    const fetchMovies = async () => {
        try {
          const response = await fetch("http://localhost:8000/movie/getall");
          const data = await response.json();
          if (data.ok) {
            setMovies(data.data);
          }
        } catch (error) {
          console.error("Error fetching movies:", error);
        } finally {
          setLoadingMovies(false);
        }
      };
      
   const fetchScreens = async (type = "") => {
  try {
    const response = await fetch("http://localhost:8000/screen/getall");
    const data = await response.json();
    console.log(data); // Log the data received from the API
    if (data.ok) {
      let filteredScreens = data.screens;
      if (type) {
        filteredScreens = filteredScreens.filter(screen => screen.screenType === type);
        setScreens(filteredScreens);
      }
      
    }
  } catch (error) {
    console.error("Error fetching screens:", error);
  } finally {
    setLoadingScreens(false);
  }
};

      
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (name === "screenType") {
        setScreenType(value);
        fetchScreens(value);
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch("http://localhost:8000/screen/addschedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log("Schedule added successfully:", data);
        toast.success("Schedule added successfully");
        // Reset form data here if needed
      } catch (error) {
        console.error("Error adding schedule:", error);
        toast.error("Error adding schedule");
      }
    };

  return (
        <div >
              <h1>Schedule Management</h1>
      <ToastContainer />
      <hr />
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="screenType">
          <Form.Label>Search Screen Type</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter screen type"
            name="screenType"
            value={screenType}
            onChange={handleInputChange}
          />
        </Form.Group>
        {!loadingScreens && screenType && (
          <div className="screen-cards">
            {screens.map((screen) => (
              <Card
                key={screen._id}
                className="screen-card"  
                style={{
                    backgroundColor: screen._id === formData.screenId ? 'lightgreen' : 'white',
                    marginBottom: '2px',marginTop: '3px'
                }}
                onClick={() => setFormData({ ...formData, screenId: screen._id })}
              >
                <Card.Body>
                  <Card.Title>{screen.name}</Card.Title>
                  <Card.Text>
                    Type: {screen.screenType}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
        <Form.Group controlId="movieId">
          <Form.Label>Select Movie</Form.Label>
          <Form.Control
            as="select"
            name="movieId"
            value={formData.movieId}
            onChange={handleInputChange}
          >
            <option value="">Select a movie</option>
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.title}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="showTime">
          <Form.Label>Show Time</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter show time"
            name="showTime"
            value={formData.showTime}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="showDate">
          <Form.Label>Show Date</Form.Label>
          <Form.Control
            type="date"
            name="showDate"
            value={formData.showDate}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add Schedule
        </Button>
       
      </Form>
    </div>
  );
};

export default Schedule;
