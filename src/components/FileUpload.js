import React, { useState, useEffect } from 'react';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [fileData, setFileData] = useState(null);
  const [formData, setFormData] = useState({
    fileType: '',
    characterEncoding: '',
    delimiter: '',
    hasHeader: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    setSelectedColumns([]);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type === 'application/json') {
      readJSONFile(file);
    } else {
      alert('Please upload a JSON file.');
      e.target.value = null;
    }
  };

  const getFilteredData = () => {
    if (fileData && selectedColumns.length > 0) {
      return Object.keys(fileData).map((productId) =>
        selectedColumns.reduce((filteredData, column) => {
          filteredData[column] = fileData[productId][column];
          return filteredData;
        }, {})
      );
    }
    return [];
  };

  const readJSONFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);

        if (jsonData.products && typeof jsonData.products === 'object') {
          const columns = Object.keys(jsonData.products[Object.keys(jsonData.products)[0]]);
          setAvailableColumns(columns);
          setFileData(jsonData.products);
          setSelectedColumns(columns);
        } else {
          console.error('Invalid JSON file format.');
        }
      } catch (error) {
        console.error('Error parsing JSON file:', error.message);
      }
    };

    reader.readAsText(file);
  };

  const handleCheckboxChange = (column) => {
    setSelectedColumns((prevSelectedColumns) =>
      prevSelectedColumns.includes(column)
        ? prevSelectedColumns.filter((col) => col !== column)
        : [...prevSelectedColumns, column]
    );
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // You can add validation logic here if needed

    // After form submission, display columns as checkboxes
    setAvailableColumns(selectedColumns);
    setFormSubmitted(true);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>File Type:</label>
          <select name="fileType" value={formData.fileType} onChange={handleFormChange}>
            <option value="JSON">JSON</option>
            <option value="CSV">CSV</option>
          </select>
        </div>
        <div>
          <label>Character Encoding:</label>
          <input
            type="text"
            name="characterEncoding"
            value={formData.characterEncoding}
            onChange={handleFormChange}
          />
        </div>
        <div>
          <label>Delimiter:</label>
          <input
            type="text"
            name="delimiter"
            value={formData.delimiter}
            onChange={handleFormChange}
          />
        </div>
        <div>
          <label>
            Has Header:
            <input
              type="checkbox"
              name="hasHeader"
              checked={formData.hasHeader}
              onChange={handleFormChange}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      {formSubmitted && availableColumns.length > 0 && (
        <div>
          <h3>Select Columns to Display:</h3>
          {availableColumns.map((column) => (
            <div key={column}>
              <input
                type="checkbox"
                checked={selectedColumns.includes(column)}
                onChange={() => handleCheckboxChange(column)}
              />
              <label>{column}</label>
            </div>
          ))}
        </div>
      )}
      {formSubmitted && availableColumns.length > 0 && (
        <div>
          <h3>Data for Selected Columns:</h3>
          <table>
            <thead>
              <tr>
                {selectedColumns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getFilteredData().map((row, index) => (
                <tr key={index}>
                  {selectedColumns.map((column) => (
                    <td key={column}>{row[column]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
