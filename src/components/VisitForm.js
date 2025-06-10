import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Select from 'react-select';
import { useReactToPrint } from 'react-to-print';
import InvoicePreview from '../components/InvoicePreview'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const VisitForm = ({ visitToEdit, onSave }) => {
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [formData, setFormData] = useState({
    customerName: '',
    employeeName: '',
    employeeMobile: '',
    serviceDescription: '',
    serviceCharges: '',
    serviceAddress: '',
    nextVisitDate: '',
    visitTime: '',
    paymentStatus: 'Pending',
  });
  const [message, setMessage] = useState(null);

  const invoiceRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  useEffect(() => {
    fetchCustomers();
    if (visitToEdit) {
      setFormData({
        customerName: visitToEdit.customerName,
        employeeName: visitToEdit.employeeName,
        employeeMobile: visitToEdit.employeeMobile,
        serviceDescription: visitToEdit.serviceDescription,
        serviceCharges: visitToEdit.serviceCharges,
        serviceAddress: visitToEdit.serviceAddress,
        nextVisitDate: visitToEdit.nextVisitDate.slice(0, 10),
        visitTime: visitToEdit.visitTime || '',
        paymentStatus: visitToEdit.paymentStatus || 'Pending',
      });
    }
  }, [visitToEdit]);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/customers`);
      const options = res.data.map(c => ({ value: c.name, label: c.name }));
      setCustomers(options);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleCustomerChange = (selected) => {
    setFormData({ ...formData, customerName: selected ? selected.value : '' });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (visitToEdit) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/visits/${visitToEdit._id}`, formData);
       toast.success('Visit updated successfully!');
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/visits`, formData);
        toast.success('Visit created successfully!');
      }
      if (onSave) onSave();
      setFormData({
        customerName: '',
        employeeName: '',
        employeeMobile: '',
        serviceDescription: '',
        serviceCharges: '',
        serviceAddress: '',
        nextVisitDate: '',
        visitTime: '',
        paymentStatus: 'Pending',
      });
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Error saving visit' });
    }
  };

  return (
    <>
    <Container className="p-4 mt-4 shadow rounded bg-white">
      <h3 className="mb-4 text-primary text-center">{visitToEdit ? 'Edit Visit' : 'Add New Visit'}</h3>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="customerName">
              <Form.Label>Customer Name</Form.Label>
              {loadingCustomers ? (
                <div className="d-flex align-items-center">
                  <Spinner animation="border" size="sm" className="me-2" />
                  <span>Loading customers...</span>
                </div>
              ) : (
                <Select
                  options={customers}
                  onChange={handleCustomerChange}
                  value={customers.find(c => c.value === formData.customerName) || null}
                  isClearable
                  placeholder="Select customer"
                  required
                />
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="employeeName">
              <Form.Label>Employee Name</Form.Label>
              <Form.Control
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                required
                placeholder="Employee name"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="employeeMobile">
              <Form.Label>Employee Mobile</Form.Label>
              <Form.Control
                type="text"
                name="employeeMobile"
                value={formData.employeeMobile}
                onChange={handleChange}
                required
                placeholder="Employee mobile number"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="serviceDescription">
              <Form.Label>Service Description</Form.Label>
              <Form.Control
                type="text"
                name="serviceDescription"
                value={formData.serviceDescription}
                onChange={handleChange}
                required
                placeholder="Service description"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="serviceCharges">
              <Form.Label>Service Charges</Form.Label>
              <Form.Control
                type="number"
                name="serviceCharges"
                value={formData.serviceCharges}
                onChange={handleChange}
                required
                placeholder="Charges"
                min="0"
              />
            </Form.Group>
          </Col>
          <Col md={8}>
            <Form.Group className="mb-3" controlId="serviceAddress">
              <Form.Label>Service Address</Form.Label>
              <Form.Control
                type="text"
                name="serviceAddress"
                value={formData.serviceAddress}
                onChange={handleChange}
                required
                placeholder="Service address"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="nextVisitDate">
              <Form.Label>Next Visit Date</Form.Label>
              <Form.Control
                type="date"
                name="nextVisitDate"
                value={formData.nextVisitDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="visitTime">
              <Form.Label>Next Visit Time</Form.Label>
              <Form.Control
                type="time"
                name="visitTime"
                value={formData.visitTime}
                onChange={handleChange}
                placeholder="HH:mm"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="paymentStatus">
              <Form.Label>Payment Status</Form.Label>
              <Form.Select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Paid</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center">
          <Button type="submit" variant="success" className="mt-3 px-4">
            {visitToEdit ? 'Update Visit' : 'Add Visit'}
          </Button>

          <Button
            variant="secondary"
            className="mt-3 ms-2"
            onClick={handlePrint}
            disabled={!formData.customerName || !formData.serviceCharges}
          >
            Print Bill
          </Button>
        </div>
      </Form>

      {/* Hidden printable invoice */}
      <h4 className="mt-5 text-center text-primary">Invoice Preview</h4>
      <div className="d-flex justify-content-center">
        <div style={{ width: '850px', border: '1px solid #ccc', padding: '20px', backgroundColor: '#fff' }}>
          <InvoicePreview ref={invoiceRef} visit={formData} invoiceNo={`INV-${new Date().getTime()}`} />
        </div>
      </div>

    </Container>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
};

export default VisitForm;
