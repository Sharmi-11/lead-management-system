import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";

const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    source: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: "", message: "" });
    setLoading(true);

    if (!formData.name || !formData.email) {
      setNotification({ type: "danger", message: "Name and Email are required" });
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/leads", formData);
      setNotification({ type: "success", message: "Lead submitted successfully!" });
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        source: "",
      });

      setTimeout(() => {
        navigate("/leads"); 
      }, 1500);

    } catch (err) {
      console.error(err);
      setNotification({ type: "danger", message: "Failed to submit lead" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ type: "", message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const sourceOptions = [
    { value: "Website", label: "Website" },
    { value: "Instagram", label: "Instagram" },
    { value: "Referral", label: "Referral" },
    { value: "Other", label: "Other" },
  ];

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
      <div className="row">
        <div className="col-12">
          <h2 className="mb-3">Lead Creation</h2>
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
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6 mb-3">
            <label className="form-label">Name <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Email <span className="text-danger">*</span></label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Company</label>
              <input
                type="text"
                className="form-control"
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Source</label>
              <Select
                options={sourceOptions}
                value={sourceOptions.find(option => option.value === formData.source) || null}
                onChange={(selectedOption) =>
                  setFormData({ ...formData, source: selectedOption.value })
                }
                isSearchable={true}
                placeholder="Select Source..."
                menuPlacement="auto"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                name="message"
                rows="3"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
        </div>
        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
