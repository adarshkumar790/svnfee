import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './PaymentReceipt.css';

const baseURL = 'https://svnfeebackend.onrender.com';

function PaymentReceipt() {
  const { paymentId } = useParams();
  const location = useLocation();
  const [payment, setPayment] = useState(location.state?.payment || null);
  const [name, setName] = useState(location.state?.name || '');
  const [rollNo, setRollNo] = useState(location.state?.rollNo || '');
  const [students, setStudents] = useState([]); // Store all students
  const [filteredStudents, setFilteredStudents] = useState([]); // Store filtered students
  const [selectedStandard, setSelectedStandard] = useState(''); // Store selected class

  // Fetch payment details on mount
  useEffect(() => {
    if (!payment) {
      const fetchPayment = async () => {
        try {
          const response = await axios.get(`${baseURL}/api/payments/${paymentId}`);
          setPayment(response.data);
        } catch (error) {
          console.error(error);
          alert('Failed to fetch payment details.');
        }
      };
      fetchPayment();
    }
  }, [payment, paymentId]);

  // Fetch all student details from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/students`); // Update with correct endpoint
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };
    fetchStudents();
  }, []);

  // Filter students based on selected standard
  useEffect(() => {
    if (selectedStandard) {
      const filtered = students.filter(student => student.standard == selectedStandard);
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [selectedStandard, students]);

  // Update name and roll number when filtered students change
  useEffect(() => {
    if (filteredStudents.length > 0) {
      setName(filteredStudents[0].name);
      setRollNo(filteredStudents[0].rollNo);
    } else {
      setName('');
      setRollNo('');
    }
  }, [filteredStudents]);

  if (!payment) {
    return <p>Loading...</p>;
  }

  // Function to handle standard (class) selection
  const handleStandardChange = (event) => {
    setSelectedStandard(event.target.value);
  };

  // Generate random receipt number
  const generateReceiptNumber = () => {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 10000);
    return `NNG-${randomPart}`;
  };

  const paymentDetails = payment.paymentDetails || [];

  const staticFees = [
    { id: 'admission', description: 'Admission & Registration Fee', amount: 0 },
    { id: 'fund', description: 'Development Fund', amount: 0 },
    { id: 'institute', description: 'Tuition Fee', amount: payment.amount },
    { id: 'library', description: 'Library Fee', amount: 0 },
    { id: 'laboratory', description: 'Laboratory Fee', amount: 0 },
    { id: 'lab', description: 'Computer Laboratory Fee', amount: 0 },
    { id: 'game', description: 'Game Fee', amount: 0 },
    { id: 'cultural', description: 'Cultural Fee', amount: 0 },
    { id: 'prospectus', description: 'Prospectus Fee & Admission Form', amount: 0 },
  ];

  const mergedFees = [...staticFees, { id: '--', description: 'Total', amount: staticFees.reduce((acc, fee) => acc + fee.amount, 0) }];

  return (
    <div className="payment-receipt-container">
      <div className="filter-section">
        <label htmlFor="standard">Filter by Standard (Class): </label>
        <select id="standard" value={selectedStandard} onChange={handleStandardChange}>
          <option value="">All Standards</option>
          <option value="1">Class 1</option>
          <option value="2">Class 2</option>
          <option value="3">Class 3</option>
          <option value="4">Class 4</option>
          <option value="5">Class 5</option>
          <option value="6">Class 6</option>
          <option value="7">Class 7</option>
          <option value="8">Class 8</option>
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
        </select>
      </div>

      {/* Display filtered student list */}
      {filteredStudents.length > 0 ? (
        <table className="student-details-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Standard</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.rollNo}</td>
                <td>{student.name}</td>
                <td>{student.standard}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students found for this standard.</p>
      )}

      {/* Always render the receipts for each filtered student */}
      <div className="receipts">
        {filteredStudents.map((student, index) => (
          <div className="receipt" key={index}>
            <div className="receipt-heading">
              <h3>MONEY RECEIPT</h3>
              <h4><strong>N.N.GHOSH SANATAN TEACHERS TRAINING COLLEGE</strong></h4>
              <p>JAMUARY, KANKE, RANCHI-834006(JHARKHAND)</p>
              <p>Phone No: 06512913165</p>
            </div>

            <div className="receipt-header">
              <div className="header-row">
                <div className="left">
                  <h5><strong>Receipt No:</strong> {generateReceiptNumber()}</h5>
                </div>
                <div className="right">
                  <h5><strong>Date:</strong> {new Date(payment.date).toLocaleDateString()}</h5>
                </div>
              </div>

              <div className="header-row">
                <div className="left">
                  <h5><strong>Name:</strong> {student.name}</h5>
                </div>
              </div>

              <div className="header-row">
                <div className="left">
                  <h5><strong>Roll No:</strong> {student.rollNo}</h5>
                </div>
                <div className="right">
                  <h5><strong>Course:</strong> B.Ed</h5>
                </div>
              </div>
            </div>

            <div className="receipt-body">
              <table className="payment-details-table">
                <thead>
                  <tr>
                    <th>SI No</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {mergedFees.map((fee, feeIndex) => (
                    <tr key={fee.id}>
                      <td>{feeIndex + 1}</td>
                      <td>{fee.description}</td>
                      <td>{fee.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h4>Received Rupees (in words): {/* Conversion logic here */}</h4>
            </div>

            <div className="receipt-footer">
              <p><strong>Thank You</strong></p>
              <p><strong>Authorized Signature</strong></p>
            </div>
          </div>
        ))}
      </div>

      <div className="print-button-container">
        <button onClick={() => window.print()} className="print-button">Print Receipt</button>
      </div>
    </div>
  );
}

export default PaymentReceipt;
