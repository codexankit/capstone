import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import CustomStepper from "./CustomStepper";
import Navbar from "./Navbar";
import { useUser } from "../contexts/UserContext";

export default function CustomerDetails() {
  const [customerStatus, setCustomerStatus] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isNew = true, customerData: initialCustomerData } = location.state || {};
  const { user, isAuthenticated} = useUser();

 

  const empty = {
    fullName: "",
    dob: "",
    email: "",
    contact: "",
    customerType: "salaried",
    aadhar: "",
    pan: "",
    income: "",
    addr1: "",
    addr2: "",
    addr3: "",
    addr4: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  };


  
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(empty);
  const [serverCustomerId, setServerCustomerId] = useState(null);

  useEffect(()=>
{
   
    if(!isAuthenticated){
        console.log(user)
        navigate('/')
    }
},[])

  useEffect(() => {
    if (initialCustomerData) {
      setFormData({
        fullName: initialCustomerData.fullName || "",
        dob: initialCustomerData.dob || "",
        email: initialCustomerData.email || "",
        contact: initialCustomerData.contact || "",
        customerType: initialCustomerData.customerType || "salaried",
        aadhar: initialCustomerData.aadhar || "",
        pan: initialCustomerData.pan || "",
        income: initialCustomerData.income || "",
        addr1: initialCustomerData.addr1 || "",
        addr2: initialCustomerData.addr2 || "",
        addr3: initialCustomerData.addr3 || "",
        addr4: initialCustomerData.addr4 || "",
        city: initialCustomerData.city || "",
        state: initialCustomerData.state || "",
        pincode: initialCustomerData.pincode || "",
        country: initialCustomerData.country || "",
       });
      setCustomerStatus("existing");
      setServerCustomerId(initialCustomerData.customerId || null);
    }
  }, [initialCustomerData]);

  // const dummyCustomer = {
  //   fullName: "John Doe",
  //   dob: "1990-04-20",
  //   email: "john@example.com",
  //   contact: "9876543210",
  //   customerType: "salaried",
  //   aadhar: "123456789012",
  //   pan: "ABCDE1234F",
  //   income: "50000",
  //   addr1: "Flat No 23, A Wing, Keshav Kunj III",
  //   addr2: "Plot 3, Sector 15",
  //   addr3: " Sanpada Road, Off Palm Beach Road",
  //   addr4: "Navi Mumbai",
  //   city: "Navi Mumbai",
  //   state: "Maharashtra",
  //   pincode: "400705",
  //   country: "India",
  // };

  // client side validation
  function validateAll() {
    const newErrors = {};
    if (!formData.fullName || formData.fullName.length > 60)
      newErrors.fullName = "Full name is required (max 60 chars)";
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }
    else{
      const dob = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const mon = today.getMonth() - dob.getMonth();

      if(mon <0 || (mon==0 && today.getDate() < dob.getDate())){
        age--;
      }

      if(age < 18){
        newErrors.dob = "Age must be atleast 18 years";
      }
    }
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!/^[6-9]\d{9}$/.test(formData.contact))
      newErrors.contact = "Contact must be 10 digits starting with 6-9";
    if (!formData.addr1 || !formData.city || !formData.state || !formData.pincode || !formData.country)
      newErrors.address = "Complete address required";
    if (!/^\d{12}$/.test(formData.aadhar))
      newErrors.aadhar = "Aadhar must be 12 digits";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan))
      newErrors.pan = "PAN must follow ABCDE1234F format";
    if (
      formData.customerType !== "salaried" &&
      formData.customerType !== "self-employed"
    )
      newErrors.customerType = "Select a valid customer type";
    if (!formData.income || Number(formData.income) <= 0)
      newErrors.income = "Monthly income must be greater than 0";
    return newErrors;
  }

  const handleTypeChange = (e) => {
    setCustomerStatus(e.target.value);
    setCustomerId("");
    setError("");
    setFormData(empty);
    setErrors({});
    setServerCustomerId(null);
  };

  const handleFetchExisting = async () => {
    if (!customerId || customerId.trim() === "") {
      setError("Please enter Customer Id");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Need to add to const API links 
      const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api";
      const res = await fetch(`${API_BASE}/customers/${customerId}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          fullName: data.fullName || "",
          dob: data.dob || "",
          email: data.email || "",
          contact: data.contact || "",
          customerType: data.customerType || "salaried",
          aadhar: data.aadhar || "",
          pan: data.pan || "",
          addr1: data.addr1 || "",
          addr2: data.addr2 || "",
          addr3: data.addr3 || "",
          addr4: data.addr4 || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          country: data.country || "",
        });
        setServerCustomerId(data.customerId);
        setErrors({});
        setCustomerStatus("existing");
      } else if (res.status === 404) {
        setError("No customer found with this ID");
      } else {
        setError("Failed to fetch details");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleReset = () => {
    setFormData(empty);
    setCustomerStatus("");
    setCustomerId("");
    setError("");
    setErrors({});
    setServerCustomerId(null);
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    function generateCustomerId(){
      const min = 10000; // Smallest 5-digit number
      const max = 99999; // Largest 5-digit number
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    setLoading(true);
    try {
      let response;
      if (isNew) {
        const payload ={...formData, customerId: formData.customerId || generateCustomerId(), 
          creationDate: new Date().toISOString()};
        response = await fetch("http://localhost:8080/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`http://localhost:8080/api/customers/${serverCustomerId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
  
      if (response.ok) {
        const data = await response.json();
        console.log("Saved successfully:", data);
  
        // navigate only after successful save
        navigate("/CreditOfferPage", { state: { customerData: data } });
      } else {
        console.error("Failed to save customer, status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="container-fluid mt-4" style={{maxWidth: "100%"}}>
      <div className="card shadow p-4">
        <h3 className="mb-4">Customer Application Details</h3>

        {/*  Added Stepper */}
        <Container maxW="5xl" pt={2} pb={4}>
          <CustomStepper currentStep={0} /> {/* Step 1 indicator */}
        </Container>
        {/* Added Stepper */}
    
        {/* Existing/New Customer selection */}
        <div className="mb-3">
          <label className="form-label fw-bold">
            Existing/New Customer <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={customerStatus}
            onChange={handleTypeChange}
          >
            <option value="">Select Customer Type</option>
            <option value="new">New Customer</option>
            <option value="existing">Existing Customer</option>
          </select>
        </div>

        {customerStatus === "existing" && (
          <div className="mb-3">
            <label className="form-label fw-bold">Customer ID</label>
            <input
              type="text"
              className={`form-control ${error ? "is-invalid" : ""}`}
              value={customerId}
              onChange={(e) => {
                setCustomerId(e.target.value);
                setError("");
              }}
              placeholder="Enter Customer ID"
              disabled={loading}
            />
            {error && <div className="invalid-feedback d-block">{error}</div>}
            <button
              className="btn btn-primary mt-2"
              onClick={handleFetchExisting}
              disabled={loading || !customerId.trim()}
            >
              {loading ? "Loading..." : "Fetch Details"}
            </button>
          </div>
        )}

        {(customerStatus === "new" || customerStatus === "existing") && (
          <form onSubmit={handleSubmit}>
            {/* Personal Details */}
            <h5 className="mt-5 mb-3 fw-bold">Personal Details</h5>
            <div className="row g-3">
              {/* Full Name */}
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter Full Name"
                />
                {errors.fullName && <div className="text-danger">{errors.fullName}</div>}
              </div>

              {/*Date of Birth */}
              <div className="col-md-6">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
                {errors.dob && <div className="text-danger">{errors.dob}</div>}
              </div>
            </div>

            {/* Contact Information */}
            <h5 className="mt-5 mb-3 fw-bold">Contact Information</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && <div className="text-danger">{errors.email}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Contact</label>
                <input
                  type="text"
                  className="form-control"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter 10-digit contact number"
                />
                {errors.contact && <div className="text-danger">{errors.contact}</div>}
              </div>
            </div>

            {/* Address */}
            <h5 className="mt-5 mb-3 fw-bold">Address</h5>
            <div className="row g-3">
                {/* Address Line -1 */}
                <div className="col-md-6">
                  <label className="form-label">Address Line 1</label>
                  <input
                    type="text"
                    className="form-control"
                    name="addr1"
                    value={formData.addr1}
                    onChange={handleChange}
                  />
                  {errors.address && <div className="text-danger">{errors.address}</div>}
                </div>

                 {/* Address Line -2 */}
                 <div className="col-md-6">
                  <label className="form-label">Address Line 2</label>
                  <input
                    type="text"
                    className="form-control"
                    name="addr2"
                    value={formData.addr2}
                    onChange={handleChange}
                  />
                </div>

                 {/* Address Line -3 */}
                 <div className="col-md-6">
                  <label className="form-label">Address Line 3</label>
                  <input
                    type="text"
                    className="form-control"
                    name="addr3"
                    value={formData.addr3}
                    onChange={handleChange}
                  />
                </div>

                 {/* Address Line -4 */}
                 <div className="col-md-6">
                  <label className="form-label">Address Line 4</label>
                  <input
                    type="text"
                    className="form-control"
                    name="addr4"
                    value={formData.addr4}
                    onChange={handleChange}
                  />
                </div>
              
              <div className="col-md-4">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                {errors.address && <div className="text-danger">{errors.address}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
                {errors.address && <div className="text-danger">{errors.address}</div>}
              </div>
              <div className="col-md-2">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-control"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
                {errors.address && <div className="text-danger">{errors.address}</div>}
              </div>
              <div className="col-md-2">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
                {errors.address && <div className="text-danger">{errors.address}</div>}
              </div>
            </div>

            {/* Identity & Income */}
            <h5 className="mt-5 mb-3 fw-bold">Identity & Income Details</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Customer Type</label>
                <select
                  className="form-select"
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleChange}
                >
                  <option value="salaried">Salaried</option>
                  <option value="self-employed">Self-Employed (Businessman)</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Aadhar</label>
                <input
                  type="text"
                  className="form-control"
                  name="aadhar"
                  value={formData.aadhar}
                  onChange={handleChange}
                  placeholder="Enter valid aadhar. Eg: 123456787890"
                />
                {errors.aadhar && <div className="text-danger">{errors.aadhar}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">PAN</label>
                <input
                  type="text"
                  className="form-control"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="Enter valid PAN. Eg: ABCDE1234F"
                />
                {errors.pan && <div className="text-danger">{errors.pan}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">Monthly Income</label>
                <input
                  type="text"
                  className="form-control"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                />
                {errors.income && <div className="text-danger">{errors.income}</div>}
              </div>
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <div>
                <button type="button" className="btn btn-primary ms-4" onClick={handleReset}> <i className="bi bi-arrow-clockwise"></i> Reset</button>
              </div>
              <div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving..." : "Save & Next"} <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
    </>
  );
}
