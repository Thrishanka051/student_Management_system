import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import Tesseract from 'tesseract.js';
import '../styles/uploadSlip.css';

const PaymentSlipUpload = ({studentId}) => {
  const [formData, setFormData] = useState({
    transactionId: '',
    transactionDate: '',
    payerName: '',
    amount: '',
    paymentSlip: null,
  });
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState('');

  // Handle input field changes (manual editing)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle file upload and extract text using Tesseract.js
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        paymentSlip: file,
      }));

      // Start OCR
      setLoading(true);
      Tesseract.recognize(file, 'eng', {
        logger: (m) => console.log(m),
      })
        .then(({ data: { text } }) => {
          setOcrText(text);
          setLoading(false);

          // Extract fields using regex (modify these patterns based on the format of your slip)
          const transactionId = extractTransactionId(text);
          const amount = extractAmount(text);
          const transactionDate = extractDate(text);
          const payerName = extractPayerName(text);

          // Update form fields with extracted values
          setFormData((prevState) => ({
            ...prevState,
            transactionId: transactionId || '',
            amount: amount || '',
            transactionDate: transactionDate || '',
            payerName: payerName || '',
          }));
        })
        .catch((err) => {
          console.error('OCR error:', err);
          setLoading(false);
        });
    }
  };

  // Example functions to extract details using regex (adjust based on slip format)
  const extractTransactionId = (text) => {
    const regex = /Internet Banking Reference\s+(\d+)/i;
    const match = text.match(regex);
    return match ? match[1] : '';
  };

 // Extract Payment Amount
const extractAmount = (text) => {
  const regex = /Payment Amount\s+([\d,]+\.\d{2})\s+LKR/i;
  const match = text.match(regex);
  return match ? match[1].replace(',', '') : ''; // Remove commas for numerical value
};


 // Extract Transaction Date (For a Calendar Input Field)
const extractDate = (text) => {
  const regex = /Transaction Date and Time\s+(\d{2}-\d{2}-\d{4})/i;
  const match = text.match(regex);
  
  // Convert to a format suitable for HTML date input (YYYY-MM-DD)
  if (match) {
    const [day, month, year] = match[1].split('-');
    return `${year}-${month}-${day}`; // Convert to 'YYYY-MM-DD' format for calendar input
  }
  return '';
};

  const extractPayerName = (text) => {
    const regex = /Customer Name\s+(.+?)\s+Biller/i;
    const match = text.match(regex);
    return match ? match[1] : '';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('req:', formData);
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true // Allows cookies to be sent with the request
    };
    console.log('req:', formData);
    
    try {
      const response = await axiosInstance.post(`student/students/${studentId}/upload-slip`, formData, config);
      console.log('Response2:', response.data);
    } catch (error) {
      console.error('Error submitting payment slip:', error);
    }
  };

  return (
    <div className="custom-payment-form-container">
      <h2>Upload Payment Slip</h2>

      <form onSubmit={handleSubmit}>
        {/* Payer Name */}
        <div className="custom-form-group">
          <label htmlFor="payerName">Payer Name:</label>
          <input
            type="text"
            id="payerName"
            name="payerName"
            className="custom-form-control"
            value={formData.payerName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Transaction ID */}
        <div className="custom-form-group">
          <label htmlFor="transactionId">Transaction ID:</label>
          <input
            type="text"
            id="transactionId"
            name="transactionId"
            className="custom-form-control"
            value={formData.transactionId}
            onChange={handleChange}
            required
          />
        </div>

        {/* Transaction Date */}
        <div className="custom-form-group">
          <label htmlFor="transactionDate">Transaction Date:</label>
          <input
            type="date"
            id="transactionDate"
            name="transactionDate"
            className="custom-form-control"
            value={formData.transactionDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Amount */}
        <div className="custom-form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            className="custom-form-control"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        {/* Upload Slip */}
        <div className="custom-form-group custom-file-upload-container">
          <input
            type="file"
            id="paymentSlip"
            name="paymentSlip"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hide default input button
          />
          <label htmlFor="paymentSlip">
            <p>Click to upload</p>
            <p>or drag and drop files here</p>
          </label>
        </div>

        {/* Display Loading State */}
        {loading && <p>Processing payment slip...</p>}

        {/* Submit Button */}
        <button type="submit" className="custom-submit-btn">Submit</button>
      </form>

      {/* Debugging - Show extracted OCR text */}
      <div className="ocr-result">
        <h3>Extracted Text (Debugging)</h3>
        <pre>{ocrText}</pre>
      </div>
    </div>
  );
};

export default PaymentSlipUpload;

