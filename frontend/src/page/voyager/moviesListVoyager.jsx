import React, { useState, useEffect } from "react";
import "../../assets/css/voyager/moviesListUser.css";
import api from "../../services/axiosInstance";
import ErrorModal from "../../components/ErrorModal";
import VoyagerSidebar from "./voyagerSideBar";
import SuccessModal from "../../components/SuccessModal";

const MoviesListUser = () => {
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [successMessage,setSuccessMessage]=useState("")
  const [successModal,setSuccessModal]=useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(4);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingModal, setBookingModal] = useState(false);
  const voyagerId=localStorage.getItem("voyagerId")
  const [formData, setFormData] = useState({
    movieName: "",
    totalSeats: "",
    showTime: "",
    showDate: "",
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  if(formData?.totalSeats>movies?.totalSlots){
    setErrorMessage(`available seats are only ${movies?.totalSlots}`)
    return setErrorModal(true)
  }
    try {
      const response = await api.post(`/voyager/add-New-Booking?voyagerId=${voyagerId}`,formData );
      if(response.data.success){
        setSuccessMessage('Movie booked successfully')
       return setSuccessModal(true)
      }
      setErrorMessage(response.data.message)
      return setErrorModal(true)
    } catch (error) {
      console.log(error, "error in ticket booking voyager side ");
      setErrorMessage(error?.response?.data?.message);
      return setErrorModal(true)
    } finally {
      setFormData({
        movieName: "",
        totalSeats: "",
        showTime: "",
        showDate: "",
      });

      setBookingModal(false);
    }
  };

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await api.get("/voyager/get-Movies-List");
        if (response.data.success) {
          console.log(response.data.movies);

          setMovies(response.data.movies);
          return setFilteredMovies(response.data.movies);
        } else {
          setErrorMessage(response.data.message);
          return setErrorModal(true);
        }
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message || "Something went wrong"
        );
        setErrorModal(true);
      }
    };
    getMovies();
  }, []);

  useEffect(() => {
    let filtered = movies;
    if (searchTerm) {
      filtered = movies.filter((movie) =>
        movie.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredMovies(filtered);
    setCurrentPage(1);
  }, [searchTerm, movies]);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 3;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className="moviesListUserPaginationButton moviesListUserPaginationPrev"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ‹
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`moviesListUserPaginationButton ${
            currentPage === i ? "moviesListUserPaginationActive" : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          className="moviesListUserPaginationButton moviesListUserPaginationNext"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          ›
        </button>
      );
    }

    return pages;
  };

  const openBookingModal = (movie) => {
    setFormData((prev) => ({
      ...prev,
      movieName: movie.name,
      totalSeats: "",
    }));
    setBookingModal(true);
  };




  return (
    <>
      <VoyagerSidebar />
      <div className="moviesListUserContainer">
        <div className="moviesListUserHeader">
          <div className="moviesListUserLogo">
            <img
              style={{ width: "98px", height: "98px", borderRadius: "45px" }}
              src="\images\movieroll1.jpg"
              alt="Movie logo"
            />
          </div>
          <div className="moviesListUserHeaderText">
            <h1 className="moviesListUserTitle">Movies Collection</h1>
            <p className="moviesListUserSubtitle">
              Discover amazing movies from our collection
            </p>
          </div>
        </div>

        <div className="moviesListUserFilters">
          <div className="moviesListUserSearchWrapper">
            <input
              type="text"
              className="moviesListUserSearchInput"
              placeholder="Search movies by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="moviesListUserStats">
          Showing {indexOfFirstMovie + 1}-
          {Math.min(indexOfLastMovie, filteredMovies.length)} of{" "}
          {filteredMovies.length} movies
        </div>

        <div className="moviesListUserGrid">
          {currentMovies.map((movie) => (
            <div key={movie._id} className="moviesListUserCard">
              <div className="moviesListUserImageWrapper">
                <img
                  src="\images\movieTickentLogo.png"
                  alt={movie.name}
                  className="moviesListUserImage"
                />
                <div className="moviesListUserOverlay">
                  <button
                    className="moviesListUserWatchButton"
                    onClick={() => openBookingModal(movie)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
              <div className="moviesListUserCardContent">
                <h3 className="moviesListUserCardTitle">{movie.name}</h3>
                <p className="moviesListUserPrice">₹{movie.price}</p>
                <p className="moviesListUserSlots">
                  Available Slots:{" "}
                  {movie.totalSlots - movie.bookedSlots || movie.totalSlots}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="moviesListUserEmpty">
            <h3>No movies found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="moviesListUserPagination">{renderPagination()}</div>
        )}
      </div>

      {errorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorModal(false)}
        />
      )}

      {bookingModal && (
        <div className="movieModalOverlay">
          <div className="movieModalContent">
            <div className="movieModalHeader">
              <img
                src="\images\1000_F_292453112_9QwoJWym05uAhpcULP0VziW5Mw1wDrPD.jpg"
                alt="Logo"
                className="movieModalLogo"
              />
              <h2>Book Your Seat</h2>
            </div>
            <form onSubmit={handleSubmit} className="movieModalForm">
              <div className="movieModalFormGroup">
                <div className="movieModalStaticText">
                  <h2>{formData.movieName}</h2>
                </div>
              </div>

              <div className="movieModalFormGroup">
                <label htmlFor="showDate">Show Date</label>
                <input
                  type="date"
                  name="showDate"
                  value={formData.showDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="movieModalFormGroup">
                <label htmlFor="showTime">Show Time</label>
                <select
                  name="showTime"
                  value={formData.showTime}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a time</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                </select>
              </div>

              <div className="movieModalFormGroup">
              
                <label htmlFor="seatCount">Number of Seats</label>
                <select
                  id="seatCount"
                  className="seatSelectionDropdown"
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={(e) => {
                    handleChange(e);
                    const seatCount = parseInt(e.target.value);
   
                  }}
                >
                  
                  <option value="">Select number of seats</option>
                  {[...Array(10).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i + 1 === 1 ? "seat" : "seats"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="movieModalActions">
                <button
                  type="submit"
                  className="movieModalSubmit"
                  
                >
                  Book Tickets
                </button>
                <button
                  type="button"
                  className="movieModalClose"
                  onClick={() => {
                    setBookingModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {successModal && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessModal(false)}
        />
      )}
    </>
  );
};

export default MoviesListUser;
