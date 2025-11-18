import { useState } from 'react';
import './Results.css';

const Results = ({ ocrText, cleanedText, onReset }) => {
  const [activeTab, setActiveTab] = useState('cleaned');

  const displayText = activeTab === 'ocr' ? ocrText : cleanedText;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText);
    alert('Text copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([displayText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}_notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="results-container">
      <h2>Processing Complete!</h2>

      <div className="results-tabs">
        <button
          className={`tab ${activeTab === 'ocr' ? 'active' : ''}`}
          onClick={() => setActiveTab('ocr')}
        >
          OCR Output
        </button>
        <button
          className={`tab ${activeTab === 'cleaned' ? 'active' : ''}`}
          onClick={() => setActiveTab('cleaned')}
        >
          Cleaned Text
        </button>
      </div>

      <div className="results-content">
        <pre>{displayText || 'No text available'}</pre>
      </div>

      <div className="actions">
        <button className="action-btn copy-btn" onClick={handleCopy}>
          Copy Text
        </button>
        <button className="action-btn download-btn" onClick={handleDownload}>
          Download
        </button>
        <button className="action-btn new-btn" onClick={onReset}>
          Process New File
        </button>
      </div>
    </div>
  );
};

export default Results;