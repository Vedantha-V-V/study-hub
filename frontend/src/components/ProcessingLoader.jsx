import './ProcessingLoader.css';

const ProcessingLoader = ({ message = 'Processing your file...' }) => {
  return (
    <div className="processing-overlay">
      <div className="processing-container">
        <div className="spinner"></div>
        <h2>{message}</h2>
        <p>This may take 20-40 seconds</p>
        <div className="progress-steps">
          <div className="step">Reading PDF</div>
          <div className="step">Extracting Text</div>
          <div className="step">Cleaning & Formatting</div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingLoader;