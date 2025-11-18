import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

export const uploadHandwrittenNotes = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post('/upload-handwritten', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading handwritten notes:', error);
    throw error;
  }
};

export const uploadTextbook = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post('/upload-textbook', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading textbook:', error);
    throw error;
  }
};

export const triggerLangflow = async (flowId, inputValue, tweaks = {}) => {
  try {
    const response = await api.post('/trigger-langflow', {
      flow_id: flowId,
      input_value: inputValue,
      tweaks: tweaks
    });
    
    return response.data;
  } catch (error) {
    console.error('Error triggering Langflow:', error);
    throw error;
  }
};

export default api;