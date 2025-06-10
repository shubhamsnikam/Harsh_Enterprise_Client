import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form, Card } from 'react-bootstrap';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VisitReport = () => {
  const [visits, setVisits] = useState([]);

  const [filter, setFilter] = useState({ startDate: '', endDate: '', customerName: '' });
  const [allCustomers, setAllCustomers] = useState([]); 

  useEffect(() => {
    fetchVisits();
    fetchCustomers(); 
  }, []);

  const fetchVisits = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/visits`);
      setVisits(res.data);
      toast.success('Visit data loaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to load visit data');
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/customers`);
      setAllCustomers(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load customers');
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredVisits = visits.filter((visit) => {
    const visitDate = new Date(visit.nextVisitDate);
    const start = filter.startDate ? new Date(filter.startDate) : null;
    const end = filter.endDate ? new Date(filter.endDate) : null;

    // Filter by date range
    if (start && visitDate < start) return false;
    if (end && visitDate > end) return false;

    // Filter by customer name (case-insensitive partial match)
    if (filter.customerName) {
      const customerNameLower = visit.customerName.toLowerCase();
      const filterCustomerNameLower = filter.customerName.toLowerCase();
      if (!customerNameLower.includes(filterCustomerNameLower)) {
        return false;
      }
    }
    return true;
  });

  const totalRevenue = filteredVisits.reduce((sum, visit) => {
    return sum + Number(visit.serviceCharges || 0);
  }, 0);

  const generatePDF = () => {
    const doc = new jsPDF();

    const title = 'Harsh Enterprise - Visit Report';
    const currentDate = new Date().toLocaleDateString('en-IN');
    const fileName = `Visit_Report_${currentDate.replace(/\//g, '-')}.pdf`;

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(title, 14, 15);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${currentDate}`, 14, 22);

    const tableColumn = [
      'Customer Name',
      'Employee Name',
      'Employee Mobile',
      'Service Description',
      'Charges (₹)',
      'Service Address',
      'Next Visit Date',
      'Visit Time',
      'Payment Status',
      'Visit Status',
    ];

    const tableRows = filteredVisits.map((visit) => {
      const today = new Date();
      const visitDate = new Date(visit.nextVisitDate);
      const isDone = visitDate < today;

      const charge = Number(visit.serviceCharges || 0);

      return [
        visit.customerName,
        visit.employeeName,
        visit.employeeMobile,
        visit.serviceDescription,
        charge.toLocaleString('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
        }),
        visit.serviceAddress,
        visitDate.toLocaleDateString('en-IN'),
        visit.visitTime || '',
        visit.paymentStatus,
        isDone ? 'Done' : 'Pending',
      ];
    });

    // Add summary row
    tableRows.push([
      '', '', '', 'Total Revenue:',
      totalRevenue.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
      }),
      '', '', '', '', ''
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [220, 53, 69] },
      margin: { top: 30 },
      didDrawPage: (data) => {
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height || pageSize.getHeight();
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageSize.width - 20, pageHeight - 10);
      },
    });

    doc.save(fileName);
    toast.success('PDF exported successfully');
  };

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Body>
          <h3 className="mb-4 text-danger">Visit Report</h3>
          <Row className="mb-3">
            <Col md={3}>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={filter.startDate}
                onChange={handleFilterChange}
              />
            </Col>
            <Col md={3}>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={filter.endDate}
                onChange={handleFilterChange}
              />
            </Col>
            <Col md={3}>
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text" // Changed to text input for search bar
                placeholder="Search customer name..." // Added a placeholder
                name="customerName"
                value={filter.customerName}
                onChange={handleFilterChange}
              />
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button variant="danger" onClick={generatePDF} className="w-100">
                Export PDF
              </Button>
            </Col>
          </Row>

          <Table striped bordered hover responsive className="text-center">
            <thead className="table-dark">
              <tr>
                <th>Customer Name</th>
                <th>Employee Name</th>
                <th>Employee Mobile</th>
                <th>Service Description</th>
                <th>Charges</th>
                <th>Service Address</th>
                <th>Next Visit Date</th>
                <th>Visit Time</th>
                <th>Visit Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisits.length > 0 ? (
                filteredVisits.map((visit) => {
                  const isDone = new Date(visit.nextVisitDate) < new Date();
                  return (
                    <tr key={visit._id}>
                      <td>{visit.customerName}</td>
                      <td>{visit.employeeName}</td>
                      <td>{visit.employeeMobile}</td>
                      <td>{visit.serviceDescription}</td>
                      <td>
                        ₹{' '}
                        {visit.serviceCharges.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td>{visit.serviceAddress}</td>
                      <td>{new Date(visit.nextVisitDate).toLocaleDateString('en-IN')}</td>
                      <td>{visit.visitTime}</td>
                      <td>
                        <span
                          className={`badge ${isDone ? 'bg-success' : 'bg-warning text-dark'}`}
                        >
                          {isDone ? 'Done' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="text-muted">
                    No visits found for selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* UI Total Revenue Display */}
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

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </Container>
  );
};

export default VisitReport;
