import React, { forwardRef } from 'react';


const InvoicePreview = forwardRef(({ visit = {}, invoiceNo = '' }, ref) => {
  const {
    customerName,
    employeeName,
    employeeMobile,
    serviceDescription,
    serviceCharges,
    serviceAddress,
    nextVisitDate,
    visitTime,
    paymentStatus
  } = visit;

  const currentDate = new Date().toLocaleDateString('en-IN');

  return (
    <div ref={ref} className="p-4 bg-white" style={{ width: '800px', fontFamily: 'Arial', color: '#000' }}>
      <div className="text-center mb-4">
        <h3>Harsh Enterprise</h3>
        <p>123 Service Lane, Industrial Area | +91-9876543210 | harsh@enterprise.com</p>
        <hr />
      </div>

      <div className="d-flex justify-content-between mb-3">
        <div>
          <strong>Customer:</strong> {customerName}<br />
          <strong>Address:</strong> {serviceAddress}
        </div>
        <div>
          <strong>Date:</strong> {currentDate}<br />
          <strong>Invoice No:</strong> {invoiceNo || '-'}
        </div>
      </div>

      <table className="table table-bordered" style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Rate (₹)</th>
            <th>Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{serviceDescription}</td>
            <td>1</td>
            <td>{Number(serviceCharges).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td>{Number(serviceCharges).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-3 text-end">
        <strong>Total: ₹{Number(serviceCharges).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong><br />
        <span>Payment Status: {paymentStatus}</span>
      </div>

     

      <p className="text-center mt-4">Thank you for choosing Harsh Enterprise!</p>
    </div>
  );
});

export default InvoicePreview;
