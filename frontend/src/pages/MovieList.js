import React, { useState, useEffect } from "react";
import axios from "axios";
import Movie from "../components/Movie"; // Update this path if necessary
import DeleteModal from "../components/DeleteModal";
import { useAuth } from "../contexts/AuthContext";
import { Link } from 'react-router-dom';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { isAuthenticated } = useAuth();
  const fetchData = () => {
    axios
      .get("http://localhost:8081/api/movies")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setMovies(res.data);
        } else {
          console.error("Data received is not an array:", res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to mimic componentDidMount

  const openDeleteModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const deleteMovie = (movieId) => {
    const token = localStorage.getItem("token");

    // Configure headers with the retrieved token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    console.log("Request config:", config);
    // Implement the delete functionality here
    axios
      .delete(`http://localhost:8081/api/movies/${movieId}`, config)
      .then(() => {
        closeDeleteModal();
        fetchData(); // Refresh the list after deletion
      })
      .catch((err) => console.error("Error deleting movie:", err));
  };

const renderMovieList = () => {
  return (
    <div className="grid">
      {movies.map((movie, i) => (
        <Movie
          movie={movie}
          key={i}
          isAuthenticated={isAuthenticated}
          openDeleteModal={() => openDeleteModal(movie)}
        />
      ))}
    </div>
  );
};

  return (
    <>
    <h1 className="text-center">Movie Database</h1>
      {/* Button to add movie */}
      <div style={{textAlign: "center", margin: "auto"}}>
        <Link to="/add">
        <button type="button" className="btn btn-primary btn-lg">Add A Movie</button>
        </Link>
      </div>
      <br/>

      <section>
      {renderMovieList()}
      </section>
      
      {/* Delete modal */}
      {isModalOpen && selectedMovie !== null && (
        <DeleteModal
          movie={selectedMovie}
          onClose={closeDeleteModal}
          onDelete={() => deleteMovie(selectedMovie._id)}
        />
      )}

    </>
  );

};

export default MovieList;