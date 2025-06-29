import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import "../../assets/css/admin/partyHallList.css";
import Sidebar from "./sidebar";
import api from "../../services/axiosInstance";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";

function PartyHallList() {
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
  });

  const fetchItems = async () => {
    try {
      const response = await api.get("/admin/partyHall-getItems");
      if (response.data.success) {
        setItemList(response.data.PartyHallList);
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
      const response = await api.post("/admin/partyHall-additem", formData);
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
        const response = await api.delete(`/admin/partyHall-deleteitem/${_id}`);
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
    if (
      !formData.name.trim() &&
      !formData.price &&
      !formData.totalSlots &&
      formData.available === ""
    ) {
      setErrorMessage("Please update at least one field.");
      return setErrorModal(true);
    }

    try {
      const response = await api.patch(
        `/admin/partyHall-edititem?itemId=${selectedId}`,
        formData
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setSuccessModal(true);
        setEditModal(false);
        setFormData({ name: "", price: "", available: "", totalSlots: "" });
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

  const filteredItems = Array.isArray(itemList)
    ? itemList.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
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
      <div className="partyHallListContainer">
        <div className="partyHallListHeader">
          <h1 className="partyHallListTitle">Party Hall Items Management</h1>
          <button
            className="partyHallListAddButton"
            onClick={() => setAddItemModal(true)}
          >
            <Plus size={20} /> Add New Party Hall
          </button>
        </div>

        <div className="partyHallListFilters">
          <input
            type="text"
            placeholder="Search by party hall name..."
            className="partyHallListSearchInput"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="partyHallListTableContainer">
          <table className="partyHallListTable">
            <thead className="partyHallListTableHead">
              <tr>
                <th className="partyHallListTableHeader">Party Hall Name</th>
                <th className="partyHallListTableHeader">Status</th>
                <th className="partyHallListTableHeader">Total Slots</th>
                <th className="partyHallListTableHeader">Price</th>
                <th className="partyHallListTableHeader">Actions</th>
              </tr>
            </thead>
            <tbody className="partyHallListTableBody">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <tr key={item._id}>
                    <td className="partyHallListTableCell">{item.name}</td>
                    <td className="partyHallListTableCell">
                      {item.available ? "Available" : "Unavailable"}
                    </td>
                    <td className="partyHallListTableCell">
                      {item.totalSlots}
                    </td>
                    <td className="partyHallListTableCell">₹{item.price}</td>
                    <td className="partyHallListTableCell">
                      <button
                        className="partyHallListEditButton"
                        onClick={() => settleSelectedId(item._id)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="partyHallListDeleteButton"
                        onClick={() => handleDelete(item._id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No party hall items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="partyHallListPagination">
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {addItemModal && (
        <div className="modalBackdrop">
          <div className="modalContent">
            <h2>Add Party Hall Item</h2>
            <form onSubmit={addNewItem}>
              <input
                name="name"
                placeholder="Party Hall Name"
                value={formData.name}
                onChange={handleItemFormChange}
              />
              <input
                name="totalSlots"
                placeholder="Total Slots"
                value={formData.totalSlots}
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
                <button type="button" onClick={() => setAddItemModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModal && (
        <div className="modalBackdrop">
          <div className="modalContent">
            <h2>Edit Party Hall Item</h2>
            <input
              name="name"
              placeholder="Party Hall Name"
              value={formData.name}
              onChange={handleItemFormChange}
            />
            <input
              name="totalSlots"
              placeholder="Total Slots"
              value={formData.totalSlots}
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

      {successModal && (
        <SuccessModal
          visible={successModal}
          message={successMessage}
          onClose={() => setSuccessModal(false)}
        />
      )}

      {errorModal && (
        <ErrorModal
          visible={errorModal}
          message={errorMessage}
          onClose={() => setErrorModal(false)}
        />
      )}
    </>
  );
}

export default PartyHallList;
