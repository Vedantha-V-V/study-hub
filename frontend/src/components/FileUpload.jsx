import { useState } from 'react';
import './FileUpload.css';

const FileUpload = ({ setError, type, onUpload, isProcessing }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const isHandwritten = type === 'handwritten';
  const title = isHandwritten ? 'Handwritten Notes' : 'Textbooks & PYQs';
  const description = isHandwritten 
    ? 'Upload handwritten notes (Max 1MB)' 
    : 'Upload textbooks or previous year questions';

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Check if multiple files
      if (e.dataTransfer.files.length > 1) {
        setError('Please upload only one file at a time');
        return;
      }

      const file = e.dataTransfer.files[0];
      
      // Check file type
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file only');
        return;
      }

      // Check file size for handwritten notes (1MB limit)
      if (isHandwritten) {
        const fileSizeMB = file.size / 1024 / 1024;
        if (fileSizeMB > 1) {
          setError(`File size is ${fileSizeMB.toFixed(2)}MB. Handwritten notes must be under 1MB.`);
          return;
        }
      }

      setSelectedFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Check if multiple files
      if (e.target.files.length > 1) {
        setError('Please upload only one file at a time');
        e.target.value = '';
        return;
      }

      const file = e.target.files[0];
      
      // Check file type
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file only');
        e.target.value = '';
        return;
      }

      // Check file size for handwritten notes (1MB limit)
      if (isHandwritten) {
        const fileSizeMB = file.size / 1024 / 1024;
        if (fileSizeMB > 1) {
          setError(`File size is ${fileSizeMB.toFixed(2)}MB.\nHandwritten notes must be under 1MB.`);
          e.target.value = '';
          return;
        }
      }

      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile, type);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
  };

  return (
    <div className="file-upload-container">
      <h2>{title}</h2>
      <p className="upload-description">{description}</p>

      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && document.getElementById(`file-input-${type}`).click()}
      >
        {!selectedFile ? (
          <>
            <div className="upload-icon">📄</div>
            <p>Drag & drop your PDF here</p>
            <p className="upload-or">or</p>
            <button className="browse-btn" type="button">
              Browse Files
            </button>
          </>
        ) : (
          <div className="file-info">
            <div className="file-icon">✅</div>
            <div className="file-details">
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button 
              className="remove-btn" 
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              type="button"
            >
              ✕
            </button>
          </div>
        )}

        <input
          id={`file-input-${type}`}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          multiple={false}
        />
      </div>

      {selectedFile && (
        <button
          className="process-btn"
          onClick={handleSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Upload'}
        </button>
      )}
    </div>
  );
};

export default FileUpload;