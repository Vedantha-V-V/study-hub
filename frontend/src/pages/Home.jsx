import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ProcessingLoader from '../components/ProcessingLoader';
import Results from '../components/Results';
import { uploadHandwrittenNotes, uploadTextbook } from '../services/api';
import './Home.css';

const Home = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [processingMessage, setProcessingMessage] = useState('Processing your file...');

  const handleUpload = async (file, type) => {
    setIsProcessing(true);
    setError(null);
    setResults(null);

    try {
      // Upload to Langflow (which handles OCR + LLM cleaning)
      setProcessingMessage('Processing through Langflow...');
      
      let response;
      if (type === 'handwritten') {
        response = await uploadHandwrittenNotes(file);
      } else {
        response = await uploadTextbook(file);
      }

      const processedText = response.text || '';

      // Set results
      setResults({
        ocrText: processedText, // Raw from Langflow
        cleanedText: processedText, // Already cleaned by Langflow
      });

    } catch (err) {
      console.error('Error processing file:', err);
      setError(err.response?.data?.error || err.message || 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="home-page">
      <header className="header">
        <h1>Study Notes Processor</h1>
        <p>Transform handwritten notes and textbooks into clean, organized text</p>
      </header>

      {error && (
        <div className="error-banner">
          <p>Error: {error}</p>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {!results && !isProcessing && (
        <div className="upload-section">
          <FileUpload
            type="handwritten"
            onUpload={handleUpload}
            isProcessing={isProcessing}
          />
          <FileUpload
            type="textbook"
            onUpload={handleUpload}
            isProcessing={isProcessing}
          />
        </div>
      )}

      {isProcessing && <ProcessingLoader message={processingMessage} />}

      {results && !isProcessing && (
        <Results
          ocrText={results.ocrText}
          cleanedText={results.cleanedText}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default Home;