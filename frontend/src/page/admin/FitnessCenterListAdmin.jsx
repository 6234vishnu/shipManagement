import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import "../../assets/css/admin/fitnessCenter.css";
import Sidebar from "./sidebar";
import api from "../../services/axiosInstance";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";

const FitnessCenterListAdmin = () => {
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
    totalSlots: "",
    equipment: [],
  });
  const [equipmentInput, setEquipmentInput] = useState("");

  const fetchItems = async () => {
    try {
      const response = await api.get("/admin/fitnessCenter-getItems");
      if (response.data.success) {
        setItemList(response.data.fitnessCenters);
      } else {
        setErrorMessage(response.data.message);
        setErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Something went wrong."
      );
      setErrorModal(true);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddEquipment = () => {
    const trimmed = equipmentInput.trim();
    if (trimmed && !formData.equipment.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        equipment: [...prev.equipment, trimmed],
      }));
      setEquipmentInput("");
    }
  };

  const handleRemoveEquipment = (itemToRemove) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((item) => item !== itemToRemove),
    }));
  };

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
      const response = await api.post("/admin/fitnessCenter-additem", formData);
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setSuccessModal(true);
        setAddItemModal(false);
        setFormData({ name: "", price: "", totalSlots: "" });
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
        const response = await api.delete(
          `/admin/fitnessCenter-deleteitem/${_id}`
        );
        if (response.data.success) {
          setSuccessMessage("Item deleted successfully");
          setSuccessModal(true);
          fetchItems();
        } else {
          setErrorMessage(response.data.message);
          setErrorModal(true);
        }
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message || "Failed to delete item."
        );
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
        totalSlots: itemToEdit.totalSlots || "",
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
        `/admin/fitnessCenter-edititem?itemId=${selectedId}`,
        formData
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setSuccessModal(true);
        setEditModal(false);
        setFormData({ name: "", price: "", available: "", totalSlots: "" });
        setTimeout(() => {
          fetchItems();
        }, 3500);
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
      <div className="fitnessCenterContainer">
        <div className="fitnessCenterHeader">
          <h1 className="fitnessCenterTitle">
            Fitness Center Items Management
          </h1>
          <button
            className="fitnessCenterAddButton"
            onClick={() => setAddItemModal(true)}
          >
            <Plus size={20} />
            Add New Item
          </button>
        </div>

        <div className="fitnessCenterFilters">
          <input
            type="text"
            placeholder="Search by item name..."
            className="fitnessCenterSearchInput"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="fitnessCenterTableContainer">
          <table className="fitnessCenterTable">
            <thead className="fitnessCenterTableHead">
              <tr className="fitnessCenterTableRow">
                <th className="fitnessCenterTableHeader">Center Name</th>
                <th className="fitnessCenterTableHeader">Status</th>
                <th className="fitnessCenterTableHeader">Total Slot</th>
                <th className="fitnessCenterTableHeader">Price</th>
                <th className="fitnessCenterTableHeader">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <tr key={item._id} className="fitnessCenterTableRow">
                    <td className="fitnessCenterTableCell">{item.name}</td>
                    <td className="fitnessCenterTableCell">
                      {item.available ? "Available" : "Unavailable"}
                    </td>
                    <td className="fitnessCenterTableCell">
                      {item.totalSlots}
                    </td>
                    <td className="fitnessCenterTableCell">₹{item.price}</td>

                    <td className="fitnessCenterTableCell">
                      <button
                        onClick={() => settleSelectedId(item._id)}
                        title="Edit"
                        className="fitnessCenterEditButton"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        title="Delete"
                        className="fitnessCenterDeleteButton"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No fitness items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="fitnessCenterPagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="paginationButton"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`paginationButton ${
                  currentPage === pageNum ? "activePage" : ""
                }`}
              >
                {pageNum}
              </button>
            )
          )}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="paginationButton"
          >
            Next
          </button>

          <span style={{ marginLeft: "1rem" }}>
            Showing {paginatedItems.length} of {filteredItems.length} matching
            items
          </span>
        </div>
      </div>

      {addItemModal && (
        <div className="customModal-overlay">
          <div className="customModal-content">
            <button
              className="customModal-close"
              onClick={() => setAddItemModal(false)}
            >
              ×
            </button>
            <h2 className="customModal-title">Add New Item</h2>
            <form onSubmit={addNewItem} className="customModal-form">
              <input
                type="text"
                name="name"
                placeholder="Gym Name"
                value={formData.name}
                onChange={handleItemFormChange}
                className="customModal-input"
              />
              <input
                type="text"
                name="totalSlots"
                placeholder="Total Slots"
                value={formData.totalSlots}
                onChange={handleItemFormChange}
                className="customModal-input"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleItemFormChange}
                className="customModal-input"
              />

              <div className="customModal-equipment">
                <input
                  type="text"
                  placeholder="Add Equipment"
                  value={equipmentInput}
                  onChange={(e) => setEquipmentInput(e.target.value)}
                  className="customModal-input"
                />
                <button
                  type="button"
                  onClick={handleAddEquipment}
                  className="customModal-addEqpBtn"
                >
                  Add Equipment
                </button>

                <ul className="equipment-list">
                  {formData.equipment.map((eqp, index) => (
                    <li
                      key={index}
                      className="equipment-item"
                      style={{ color: "black" }}
                    >
                      {eqp}
                      <button
                        style={{ marginLeft: "5px", marginTop: "5px" }}
                        type="button"
                        onClick={() => handleRemoveEquipment(eqp)}
                        className="equipment-remove-btn"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <button type="submit" className="customModal-submit">
                Submit
              </button>
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
      {errorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorModal(false)}
        />
      )}

      {editModal && (
        <div className="customModal-overlay">
          <div className="customModal-content">
            <button
              className="customModal-close"
              onClick={() => setEditModal(false)}
            >
              ×
            </button>
            <h2 className="customModal-title">Edit Item</h2>
            <form onSubmit={handleEdit} className="customModal-form">
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                value={formData.name}
                onChange={handleItemFormChange}
                className="customModal-input"
              />
              <input
                type="text"
                name="totalSlots"
                placeholder="Total Slots"
                value={formData.totalSlots}
                onChange={handleItemFormChange}
                className="customModal-input"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleItemFormChange}
                className="customModal-input"
              />
              <select
                name="available"
                value={formData.available}
                onChange={handleItemFormChange}
                className="customModal-input"
              >
                <option value="">Select Status</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
              <button type="submit" className="customModal-submit">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FitnessCenterListAdmin;
