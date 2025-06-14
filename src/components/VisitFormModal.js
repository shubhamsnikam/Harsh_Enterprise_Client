import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const VisitFormModal = ({ show, onHide, visitToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    employeeName: '',
    employeeMobile: '',
    serviceDescription: '',
    serviceCharges: '',
    serviceAddress: '',
    visitDate: '',
    nextVisitDate: '',
    installationDate: '',
    visitTime: '',
    paymentStatus: 'Pending',
    outStatus: '',
    outDate: '',
    visitStatus: 'Pending',
  });

  const [allVisits, setAllVisits] = useState([]);

  useEffect(() => {
    fetchAllVisits();
  }, []);

  useEffect(() => {
    if (visitToEdit) {
      setFormData({ ...visitToEdit });
    } else {
      setFormData({
        customerName: '',
        employeeName: '',
        employeeMobile: '',
        serviceDescription: '',
        serviceCharges: '',
        serviceAddress: '',
        visitDate: '',
        nextVisitDate: '',
        installationDate: '',
        visitTime: '',
        paymentStatus: 'Pending',
        outStatus: '',
        outDate: '',
        visitStatus: 'Pending',
      });
    }
  }, [visitToEdit]);

  const fetchAllVisits = async () => {
    try {
      const res = await axios.get('/api/visits');
      setAllVisits(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load visits');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'visitDate') {
      const selectedDate = new Date(value);
      const nextDate = new Date(selectedDate);
      nextDate.setMonth(nextDate.getMonth() + 3);
      const formattedNext = nextDate.toISOString().slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        visitDate: value,
        nextVisitDate: formattedNext,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (visitToEdit) {
        await axios.put(`/api/visits/${visitToEdit._id}`, formData);
      } else {
        await axios.post('/api/visits', formData);
      }

      onHide();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit visit');
    }
  };

  const getPreviousVisitDates = () => {
    const currentCustomer = formData.customerName;
    const currentVisitDate = formData.visitDate ? new Date(formData.visitDate) : null;

    if (!currentCustomer || !currentVisitDate) return [];

    return allVisits
      .filter(
        (v) =>
          v.customerName === currentCustomer &&
          new Date(v.visitDate) < currentVisitDate
      )
      .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))
      .map((v) => new Date(v.visitDate).toLocaleDateString('en-IN'));
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{visitToEdit ? 'Edit Visit' : 'Add Visit'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Employee Name</Form.Label>
                <Form.Control
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Employee Mobile</Form.Label>
                <Form.Control
                  type="text"
                  name="employeeMobile"
                  value={formData.employeeMobile}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Service Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Service Charges</Form.Label>
                <Form.Control
                  type="number"
                  name="serviceCharges"
                  value={formData.serviceCharges}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Service Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="serviceAddress"
                  value={formData.serviceAddress}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Visit Date</Form.Label>
                <Form.Control
                  type="date"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Next Visit Date</Form.Label>
                <Form.Control
                  type="date"
                  name="nextVisitDate"
                  value={formData.nextVisitDate}
                  onChange={handleChange}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Installation Date</Form.Label>
                <Form.Control
                  type="date"
                  name="installationDate"
                  value={formData.installationDate}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Payment Status</Form.Label>
                <Form.Select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Previous Visits Section */}
          {formData.customerName && formData.visitDate && (
            <Row className="mt-3">
              <Col>
                <h6 className="text-muted">Previous Visits for {formData.customerName}:</h6>
                <ListGroup>
                  {getPreviousVisitDates().length > 0 ? (
                    getPreviousVisitDates().map((date, idx) => (
                      <ListGroup.Item key={idx}>{date}</ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item className="text-muted">No previous visits found</ListGroup.Item>
                  )}
                </ListGroup>
              </Col>
            </Row>
          )}

          <div className="text-end mt-4">
            <Button variant="primary" type="submit">
              {visitToEdit ? 'Update' : 'Add'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default VisitFormModal;
