import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ProcessingLoader from '../components/ProcessingLoader';
import { uploadHandwrittenNotes, uploadTextbook } from '../services/api';
import './Home.css';

const Home = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [processingMessage, setProcessingMessage] = useState('Processing your file...');
  const [showChat, setShowChat] = useState(false);

  const handleUpload = async (file, type) => {
    setIsProcessing(true);
    setError(null);
    setSuccessMessage('');

    try {
      setProcessingMessage('Processing through Langflow...');
      
      let response;
      if (type === 'handwritten') {
        response = await uploadHandwrittenNotes(file);
      } else {
        response = await uploadTextbook(file);
      }

      const processedText = response.text || '';
      console.log(processedText)

      setSuccessMessage('Notes processing successful!');
      
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (err) {
      console.error('Error processing file:', err);
      setError(err.response?.data?.error || err.message || 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSuccessMessage('');
    setError(null);
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <button 
            className="chat-toggle-btn"
            onClick={() => setShowChat(!showChat)}>
              <span className="status-dot"></span>
            Chat
          </button>
        </div>
        
        <div className="nav-center">
          <h1 className="nav-title">StudyHub</h1>
        </div>
        
        <div className="nav-right">
          <a 
            href="https://github.com/Vedantha-V-V/study-hub" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-section">
          <div className="badge">AI-Powered Learning</div>
          <p className="subtitle">Transform handwritten notes and textbooks into clean, organized text</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="status-message error-message">
            <span>❌ {error}</span>
            <button onClick={() => setError(null)} className="close-btn">✕</button>
          </div>
        )}

        {successMessage && (
          <div className="status-message success-message">
            <span>{successMessage}</span>
            <button onClick={handleReset} className="close-btn">✕</button>
          </div>
        )}

        {/* Upload Section */}
        {!isProcessing && (
          <div className="upload-container">
            <FileUpload
              setError={setError}
              type="handwritten"
              onUpload={handleUpload}
              isProcessing={isProcessing}
            />
            <FileUpload
              setError={setError}
              type="textbook"
              onUpload={handleUpload}
              isProcessing={isProcessing}
            />
          </div>
        )}

        {isProcessing && <ProcessingLoader message={processingMessage} />}
      </main>

      {/* Chat Sidebar */}
      <div className={`chat-sidebar ${showChat ? 'show' : ''}`}>
        {/* <div className="chat-header">
          <h3>Chat</h3>
          <button onClick={() => setShowChat(false)} className="close-chat">✕</button>
        </div> */}
        <div className="chat-content">
            <langflow-chat
              window_title="Study Bot"
              flow_id="3862397f-0c3d-47e1-a409-9fd32afa4f2a"
              host_url="http://localhost:7860">
            </langflow-chat>
        </div>
      </div>

      {showChat && <div className="chat-overlay" onClick={() => setShowChat(false)} />}
    </div>
  );
};

export default Home;