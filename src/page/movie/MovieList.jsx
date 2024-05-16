import React, { useState } from "react";

const MovieList = ({ movies, onEdit, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedMovie, setEditedMovie] = useState({});

  const handleEdit = (movie) => {
    setEditMode(true);
    setEditedMovie(movie);
  };

  const handleSave = () => {
    onEdit(editedMovie);
    setEditMode(false);
    setEditedMovie({});
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedMovie({});
  };

  return (
    <div>
      <h2>Movie List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie._id}>
              <td>{movie.title}</td>
              <td>{movie.description}</td>
              <td>
                {editMode && editedMovie._id === movie._id ? (
                  <>
                    <button className="btn btn-primary me-2" onClick={handleSave}>
                      Edit
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-info me-2" onClick={() => handleEdit(movie)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => onDelete(movie._id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovieList;
