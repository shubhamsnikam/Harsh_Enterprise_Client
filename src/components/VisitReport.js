import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Form,
  Card
} from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VisitFormModal from './VisitFormModal';

const VisitReport = () => {
  const [visits, setVisits] = useState([]);
  const [filter, setFilter] = useState({ startDate: '', endDate: '', customerName: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/visits`);
      const sorted = res.data.sort((a, b) => new Date(b.nextVisitDate) - new Date(a.nextVisitDate));
      setVisits(sorted);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch visits");
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this visit?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/visits/${id}`);
        toast.success('Visit deleted');
        fetchVisits();
      } catch (error) {
        console.error(error);
        toast.error('Delete failed');
      }
    }
  };

  const handleEditVisit = (visit) => {
    setSelectedVisit(visit);
    setShowModal(true);
  };

  const filteredVisits = visits.filter((visit) => {
    const visitDate = new Date(visit.nextVisitDate);
    const start = filter.startDate ? new Date(filter.startDate) : null;
    const end = filter.endDate ? new Date(filter.endDate) : null;

    if (start && visitDate < start) return false;
    if (end && visitDate > end) return false;

    if (filter.customerName) {
      return visit.customerName.toLowerCase().includes(filter.customerName.toLowerCase());
    }

    return true;
  });

  const totalRevenue = filteredVisits.reduce((sum, visit) => {
    return sum + Number(visit.serviceCharges || 0);
  }, 0);

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Body>
          <h3 className="mb-4 text-danger">Visit Report</h3>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={filter.startDate}
                onChange={handleFilterChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={filter.endDate}
                onChange={handleFilterChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search customer..."
                name="customerName"
                value={filter.customerName}
                onChange={handleFilterChange}
              />
            </Col>
          </Row>

          <Table striped bordered hover responsive className="text-center">
            <thead className="table-dark">
              <tr>
                <th>Install Date</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Employee</th>
                <th>Mobile</th>
                <th>Service</th>
                <th>Charges</th>
                <th>Previous Visits</th>
                <th>Upcoming Visit</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisits.length > 0 ? (
                filteredVisits.map((v) => {
                  const previousDates = visits
                    .filter(
                      (pv) =>
                        pv.customerName === v.customerName &&
                        new Date(pv.nextVisitDate) < new Date(v.nextVisitDate)
                    )
                    .map((pv) => new Date(pv.nextVisitDate).toLocaleDateString('en-IN'));

                  return (
                    <tr key={v._id}>

                      <td>
                        {v.installationDate
                          ? new Date(v.installationDate).toLocaleDateString('en-IN')
                          : '-'}
                      </td>
                      <td>{v.customerName}</td>
                      <td>{v.serviceAddress}</td>
                      <td>{v.employeeName}</td>
                      <td>{v.employeeMobile}</td>
                      <td>{v.serviceDescription}</td>
                      <td>₹ {Number(v.serviceCharges).toFixed(2)}</td>
                      <td>{previousDates.length > 0 ? previousDates.join(', ') : '-'}</td>
                      <td>{new Date(v.nextVisitDate).toLocaleDateString('en-IN')}</td>
                      <td>
                        <span
                          className={`badge ${v.paymentStatus === 'Paid' ? 'bg-success' : 'bg-secondary'
                            }`}
                        >
                          {v.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2 mb-2"
                          onClick={() => handleEditVisit(v)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(v._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="11" className="text-muted">
                    No visits found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {filteredVisits.length > 0 && (
            <div className="text-end fw-bold mt-3">
              Total Revenue:&nbsp;
              <span className="text-success">
                ₹ {totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </Card.Body>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />

      <VisitFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        visitToEdit={selectedVisit}
        onSuccess={fetchVisits}
      />
    </Container>
  );
};

export default VisitReport;
