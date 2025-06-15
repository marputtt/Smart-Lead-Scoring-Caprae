import React, { useState, useRef } from 'react';
import './CSVUploader.css';

const CSVUploader = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [fullParsedData, setFullParsedData] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = async (file) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const text = await file.text();
      const parsedData = parseCSV(text);
      
      if (parsedData.length === 0) {
        setError('CSV file appears to be empty');
        setIsProcessing(false);
        return;
      }

      setFullParsedData(parsedData); // Store the full parsed data
      setPreviewData(parsedData.slice(0, 5)); // Show first 5 rows for preview
      setIsProcessing(false);
    } catch (err) {
      setError('Error reading CSV file: ' + err.message);
      setIsProcessing(false);
    }
  };

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length > 0) {
        const row = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index] ? values[index].trim() : '';
        });
        data.push(row);
      }
    }

    return data;
  };

  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };

  const handleConfirmUpload = () => {
    if (fullParsedData) {
      onUpload(fullParsedData);
      setPreviewData(null);
      setFullParsedData(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancelUpload = () => {
    setPreviewData(null);
    setFullParsedData(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (previewData) {
    return (
      <div className="csv-preview">
        <h3>Preview CSV Data</h3>
        <p>Found {fullParsedData.length} rows. Here's a preview of the first 5:</p>
        
        <div className="scroll-hint">
          <span>💡 Scroll horizontally to see all columns →</span>
        </div>
        
        <div className="preview-table-container">
          <table className="preview-table">
            <thead>
              <tr>
                {Object.keys(previewData[0]).map(header => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, cellIndex) => (
                    <td key={cellIndex}>{value || '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="preview-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleConfirmUpload}
          >
            Upload & Score Leads ({fullParsedData.length} rows)
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleCancelUpload}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="csv-uploader">
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {isProcessing ? (
          <div className="processing">
            <div className="spinner"></div>
            <p>Processing CSV file...</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📊</div>
            <h3>Upload CSV File</h3>
            <p>Drag and drop your CSV file here, or click to browse</p>
            <p className="upload-hint">
              Supported columns: Company, Website, Industry, Product/Service Category, Business Type (B2B, B2B2C), Employees Count, Revenue, Year Founded, BBB Rating, Street, City, State, Company Phone, Company LinkedIn, Owner's First Name, Owner's Last Name, Owner's Title, Owner's LinkedIn, Owner's Phone Number, Owner's Email, Source
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default CSVUploader; 