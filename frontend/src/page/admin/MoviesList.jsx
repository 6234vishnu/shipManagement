import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import "../../assets/css/admin/movieList.css";
import Sidebar from "./sidebar";
import api from "../../services/axiosInstance";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";

function MoviesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addItemModal, setAddItemModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [itemList, setItemList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    available: "",
  });

  const fetchItems = async () => {
    try {
      const response = await api.get("/admin/movies-getItems");
      if (response.data.success) {
        setItemList(response.data.MoviesList);
      } else {
        setErrorMessage(response.data.message);
        setErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Something went wrong.");
      setErrorModal(true);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleItemFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewItem = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/admin/movies-additem", formData);
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setSuccessModal(true);
        setAddItemModal(false);
        setFormData({ name: "", price: "", available: "" });
        return fetchItems();
      } else {
        setErrorMessage(response.data.message);
        return setErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Failed to add item.");
      setErrorModal(true);
    }
  };

  const handleDelete = async (_id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await api.delete(`/admin/movies-deleteitem/${_id}`);
        if (response.data.success) {
          setSuccessMessage("Item deleted successfully");
          setSuccessModal(true);
          fetchItems();
        } else {
          setErrorMessage(response.data.message);
          setErrorModal(true);
        }
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Failed to delete item.");
        setErrorModal(true);
      }
    }
  };

  const settleSelectedId = (id) => {
    const itemToEdit = itemList.find((item) => item._id === id);
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name || "",
        price: itemToEdit.price || "",
        available: itemToEdit.available ? "true" : "false",
      });
    }
    setSelectedId(id);
    setEditModal(true);
  };

  const handleEdit = async () => {
    if (!formData.name.trim() && !formData.price && formData.available === "") {
      setErrorMessage("Please update at least one field.");
      return setErrorModal(true);
    }

    try {
      const response = await api.patch(
        `/admin/movies-edititem?itemId=${selectedId}`,
        formData
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setSuccessModal(true);
        setEditModal(false);
        setFormData({ name: "", price: "", available: "" });
        fetchItems();
      } else {
        setErrorMessage(response.data.message);
        setErrorModal(true);
      }
    } catch (err) {
      setErrorMessage("Something went wrong.");
      setErrorModal(true);
    }
  };

  const filteredItems = itemList.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

 

  return (
    <>
      <Sidebar />
      <div className="moviesContainer">
        <div className="moviesHeader">
          <h1 className="moviesTitle">Movies Center Items Management</h1>
          <button className="moviesAddButton" onClick={()=>setAddItemModal(true)}>
            <Plus size={20} /> Add New Theater
          </button>
        </div>

        <div className="moviesFilters">
          <input
            type="text"
            placeholder="Search by theater name..."
            className="moviesSearchInput"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="moviesTableContainer">
          <table className="moviesTable">
            <thead className="moviesTableHead">
              <tr>
                <th className="moviesTableHeader">Theater Name</th>
                <th className="moviesTableHeader">Status</th>
                <th className="moviesTableHeader">Price</th>
                <th className="moviesTableHeader">Actions</th>
              </tr>
            </thead>
            <tbody className="moviesTableBody">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <tr key={item._id}>
                    <td className="moviesTableCell">{item.name}</td>
                    <td className="moviesTableCell" >{item.available ? "Available" : "Unavailable"}</td>
                    <td className="moviesTableCell">₹{item.price}</td>
                    <td className="moviesTableCell">
                      <button className="moviesEditButton" onClick={() => settleSelectedId(item._id)} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="moviesDeleteButton" onClick={() => handleDelete(item._id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No movie items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="moviesPagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "activePage" : ""}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      
      {addItemModal && (
        <div className="modalBackdrop">
          <div className="modalContent">
            <h2>Add Movie Item</h2>
            <form onSubmit={addNewItem}>
              <input
                name="name"
                placeholder="Theater Name"
                value={formData.name}
                onChange={handleItemFormChange}
              />
              <input
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleItemFormChange}
              />
              <select
                name="available"
                value={formData.available}
                onChange={handleItemFormChange}
              >
                <option value="">Select Availability</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
              <div className="modalActions">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setAddItemModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {editModal && (
        <div className="modalBackdrop">
          <div className="modalContent">
            <h2>Edit Movie Item</h2>
            <input
              name="name"
              placeholder="Theater Name"
              value={formData.name}
              onChange={handleItemFormChange}
            />
            <input
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleItemFormChange}
            />
            <select
              name="available"
              value={formData.available}
              onChange={handleItemFormChange}
            >
              <option value="">Select Availability</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
            <div className="modalActions">
              <button onClick={handleEdit}>Update</button>
              <button onClick={() => setEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {successModal&&(
        <SuccessModal
        visible={successModal}
        message={successMessage}
        onClose={() => setSuccessModal(false)}
      />
      )}
      
      {errorModal&&(
        <ErrorModal
        visible={errorModal}
        message={errorMessage}
        onClose={() => setErrorModal(false)}
      />
      )}
    </>
  );
}

export default MoviesList;
