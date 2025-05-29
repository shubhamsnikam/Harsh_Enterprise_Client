import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Dashboard from './components/Dashboard/Dashboard';
// import CustomerForm from './components/Customer/AddCustomer';
import CustomerForm from './components/Customer/CustomerForm'
import CustomerList from './components/Customer/CustomerList';
import VisitForm from './components/VisitForm';
import VisitReport from './components/VisitReport';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Help from './components/Help';
import './App.css';


const App = () => {
  const [todayVisits, setTodayVisits] = useState([]);

  useEffect(() => {
    const fetchTodayVisits = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const res = await axios.get(`/api/visits/today/${today}`);
        setTodayVisits(res.data);
      } catch (error) {
        console.error("Error fetching today's visits:", error);
      }
    };

    fetchTodayVisits();
  }, []);

 

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">Harsh Enterprise</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/customers" className="nav-hover">Customers</Nav.Link>
              <Nav.Link as={Link} to="/add-visit" className="nav-hover">Add Visit</Nav.Link>
              <Nav.Link as={Link} to="/visits" className="nav-hover">Visit Report</Nav.Link>
              <Nav.Link as={Link} to="/help" className="nav-hover">Help</Nav.Link>
            </Nav>
            <Nav>
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip>
                    {todayVisits.length > 0
                      ? `You have ${todayVisits.length} visits today.`
                      : 'No visits today'}
                  </Tooltip>
                }
              >
                <Nav.Link as={Link} to="/visits" className="nav-hover" style={{ position: 'relative' }}>
                  🔔
                  {todayVisits.length > 0 && (
                    <Badge bg="danger" pill style={{ position: 'absolute', top: '0', right: '0' }}>
                      {todayVisits.length}
                    </Badge>
                  )}
                </Nav.Link>
              </OverlayTrigger>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>


      <Container>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/add-customer" element={<CustomerForm />} />
          <Route path="/edit-customer/:id" element={<CustomerForm />} />
          <Route path="/add-visit" element={<VisitForm />} />
          <Route path="/edit-visit/:id" element={<VisitForm />} />
          <Route path="/visits" element={<VisitReport />} />
          <Route path="/help" element={<Help />} />

        </Routes>
      </Container>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;
