import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UpMovieList from "./uplist";

const CreateupMoviePage = ({ theme }) => {
  const [movie, setMovie] = useState({
    title: "",
    description: "",
    portraitImgUrl: "",
    portraitImg:File| null,
  });

  const [movies, setMovies] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMovieId, setEditMovieId] = useState(null);
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    fetch(`http://localhost:8000/up/getall`, {
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
  

  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMovie({ ...movie, [name]: value });
  };
  const uploadImage = async (image) => {
    try {
      const formData = new FormData();
        formData.append("myimage", image);

      const response = await fetch("http://localhost:8000/image/uploadimage", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Image uploaded successfully:", data);
        return data.imageUrl;
      } else {
        console.error("Failed to upload the image.");
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleCreateMovie = async (event) => {
    event.preventDefault();
    try {
      if (
        movie.title === "" ||
        movie.description === "" 
     
      ) {
        toast.error("Please fill all the fields");
        return;
      }

      let portraitImgUrl = movie.portraitImgUrl;
    

      if (movie.portraitImg) {
        portraitImgUrl = await uploadImage(movie.portraitImg);
        if (!portraitImgUrl) {
          toast.error("Portrait Image upload failed");
          return;
        }
      }
     

      const newMovie = { ...movie, portraitImgUrl };

      let url = "http://localhost:8000/up/create";
      if (isEditing) {
        url = `http://localhost:8000/up/update/${editMovieId}`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovie),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Movie operation successful", data);

        toast.success(isEditing ? "Movie Edited Successfully" : "Movie Created Successfully");
        setMovie({
          title: "",
          description: "",
          portraitImgUrl: "",
          portraitImg: null
         
        });
        fetchMovies();
        setShowCreateForm(false);
        setIsEditing(false);
        setEditMovieId(null);
      } else {
        console.error("Movie operation failed", response.statusText);
        toast.error("Movie Operation Failed");
      }
    } catch (error) {
      console.error("An error occurred during movie operation", error);
      toast.error("An error occurred, please try again later");
    }
  };

  const handleEditMovie = (editedMovie) => {
    setIsEditing(true);
    setEditMovieId(editedMovie._id);
    setMovie(editedMovie);
    setShowCreateForm(true);
  };

  
  const handleDeleteMovie = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/up/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
  
      if (response.ok) {
        console.log("Movie deleted successfully");
        toast.success("Movie Deleted Successfully");
  
        // Update the movies list after deletion
        fetchMovies();
      } else {
        console.error("Movie deletion failed", response.statusText);
        toast.error("Movie Deletion Failed");
      }
    } catch (error) {
      console.error("An error occurred during movie deletion", error);
      toast.error("An error occurred, please try again later");
    }
  };
  

  return (
    <div className={`container${theme}`}>
      <div className={`formpage ${theme}`}>
        <h1>Movie Management</h1>
        <button className="btn btn-primary mb-3" onClick={() => setShowCreateForm(true)} style={{
    // position: "absolute",
    // top:180,
    // left: 250,
    // transform: "translate(-50%, -50%)",
    // zIndex: 1
  }}>
          Create Movie
        </button>
        {showCreateForm && (
          <form onSubmit={handleCreateMovie}>
           <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            placeholder="Title"
            value={movie.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            placeholder="Description"
            value={movie.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="portraitImg" className="form-label">
            Portrait Image
          </label>
          <input
            type="file"
            id="portraitImg"
            accept="image/*"
            className="form-control"
            onChange={(event) => {
              if (event.target.files && event.target.files.length > 0) {
                setMovie({ ...movie, portraitImg: event.target.files[0] });
              }
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary">
              {isEditing ? "Save Changes" : "Add Movie"}
            </button>
          </form>
        )}
         <hr />
        <UpMovieList movies={movies} onEdit={handleEditMovie} onDelete={handleDeleteMovie} />
              </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default CreateupMoviePage;
