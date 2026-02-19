import React, { useEffect, useState } from "react";
import { Row, Col, Dropdown, Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import LeadAnalytics from "../components/LeadAnalytics";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { Settings, Eye, Edit, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const API_URL = "http://localhost:5000";

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { darkMode, toggleTheme } = useTheme();
  const [notification, setNotification] = useState({ type: "", message: "" });

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    source: "",
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/leads`);
      setLeads(res.data || []);
    } catch (err) {
      setNotification({
        type: "error",
        message: "Failed to fetch leads",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `${API_URL}/leads/${selectedLead?.id}`,
        editFormData
      );

      setNotification({
        type: "success",
        message: "Lead updated successfully",
      });

      setShowEdit(false);
      fetchLeads();
    } catch (err) {
      setNotification({
        type: "error",
        message: "Failed to update lead",
      });
    }
  };

  
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/leads/${selectedLead?.id}`);

      setNotification({
        type: "success",
        message: "Lead deleted successfully",
      });

      setShowDelete(false);
      fetchLeads();
    } catch (err) {
      setNotification({
        type: "error",
        message: "Failed to delete lead",
      });
    }
  };

  const openEditModal = (lead) => {
    setSelectedLead(lead);
    setEditFormData({ ...lead });
    setShowEdit(true);
  };

  const openViewModal = (lead) => {
    setSelectedLead(lead);
    setShowView(true);
  };

  const openDeleteModal = (lead) => {
    setSelectedLead(lead);
    setShowDelete(true);
  };

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: "", message: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const filteredLeads = leads.filter((lead) =>
    [lead.name, lead.email, lead.source]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );


  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container-fluid mt-4">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3">
        <div className="container">
          <Link className="navbar-brand" to="/">Lead Capture</Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav ms-auto">
              <Link className="nav-link" to="/">Create</Link>
              <Link className="nav-link" to="/leads">Lists</Link>
            </div>
          </div>
        </div>
      </nav>     
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <h2 className="mb-0">Lead Lists</h2>
        </div>

        <div className="col-md-6 d-flex justify-content-md-end align-items-center mt-2 mt-md-0">
          <div style={{ maxWidth: "300px", width: "100%" }}>
            <Form.Control
              type="text"
              placeholder="Search by name, email, or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-sm btn-outline-light ms-2"
            onClick={toggleTheme}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} className="text-dark"/>}
          </button>
        </div>
      </div>
      {notification.message && (
        <div
          className={`alert ${
            notification.type === "success" ? "alert-success" : "alert-danger"
          }`}
          role="alert"
        >
          {notification.message}
        </div>
      )}
      <div className="mb-4">
        <LeadAnalytics leads={leads} />
      </div>
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Source</th>
              <th>Created At</th>
              <th width="120">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No leads found
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.source}</td>
                  <td>
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td align="center">
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        variant="light"                  
                        size="sm"                         
                        id={`action-dropdown-${lead.id}`} 
                        className="btn btn-dark btn-xs dropdown d-flex align-items-center justify-content-center"
                      >
                        <Settings size={14} />           
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => openViewModal(lead)}
                        >
                          <Eye className="me-2" size={16} />
                          View
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => openEditModal(lead)}
                        >
                          <Edit className="me-2" size={16} />
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => openDeleteModal(lead)}
                          className="text-danger"
                        >
                          <Trash2 className="me-2" size={16} />
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Modal show={showView} onHide={() => setShowView(false)} centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-light p-3">
          <Modal.Title>View Lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLead && (
            <>
              <p><strong>Name:</strong> {selectedLead.name}</p>
              <p><strong>Email:</strong> {selectedLead.email}</p>
              <p><strong>Phone:</strong> {selectedLead.phone}</p>
              <p><strong>Company:</strong> {selectedLead.company}</p>
              <p><strong>Source:</strong> {selectedLead.source}</p>
              <p><strong>Message:</strong> {selectedLead.message}</p>
            </>
          )}
        </Modal.Body>
      </Modal>
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-light p-3">
          <Modal.Title>Edit Lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {["name", "email", "phone", "company", "source"].map((field) => (
              <Form.Group className="mb-2" key={field}>
                <Form.Label>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Form.Label>
                <Form.Control
                  type="text"
                  name={field}
                  value={editFormData[field] || ""}
                  onChange={handleEditChange}
                />
              </Form.Group>
            ))}

            <Form.Group className="mb-2">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                value={editFormData.message || ""}
                onChange={handleEditChange}
              />
            </Form.Group>
          </Form>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button
              variant="danger"
              onClick={() => setShowEdit(false)}
            >
              Close
            </Button>

            <Button variant="success" onClick={handleEditSave}>
              Update
            </Button>
          </div>
        </Modal.Body>
        
      </Modal>
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-light p-3">
          <Modal.Title>Delete Lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{selectedLead?.name}</strong>?
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button
              variant="secondary"
              onClick={() => setShowDelete(false)}
            >
              Cancel
            </Button>

            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LeadList;
