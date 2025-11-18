from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv, dotenv_values 
import requests
import base64
import os

app = Flask(__name__)
CORS(app)

# Configuration
OCR_URL = os.getenv("OCR_URL")
LANGFLOW_URL = os.getenv("LANGFLOW_URL")

OCR_API_KEY = os.getenv("OCR_API_KEY") 

@app.route('/ocr', methods=['POST'])
def ocr_pdf():
    file = request.files['file']
    pdf_content = base64.b64encode(file.read()).decode()
    
    payload = {
        'apikey': OCR_API_KEY,
        'base64Image': f'data:application/pdf;base64,{pdf_content}',
        'language': 'eng',
        'OCREngine': 2
    }
    
    response = requests.post('https://api.ocr.space/parse/image', data=payload, timeout=60)
    result = response.json()
    
    text = ""
    for page in result.get('ParsedResults', []):
        text += page.get('ParsedText', '') + "\n"
    
    return jsonify({'text': text.strip()})

@app.route('/upload-handwritten', methods=['POST'])
def upload_handwritten():
    """Handle handwritten notes upload via webhook"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    try:
        # Step 1: Send to OCR service
        print("Sending to OCR service...")
        files = {'file': ('file.pdf', file.read(), 'application/pdf')}
        ocr_response = requests.post(OCR_URL, files=files, timeout=90)
        ocr_data = ocr_response.json()
        messy_text = ocr_data.get('text', '')
        
        print(f"✅ OCR extracted {len(messy_text)} characters")
        print(f"Preview: {messy_text[:100]}...")
        
        # Step 2: Send to Langflow webhook for cleaning
        print("🔄 Sending to Langflow webhook...")
        
        webhook_payload = {
            "text": messy_text  # This matches the {text} variable in your prompt
        }
        
        langflow_response = requests.post(
            LANGFLOW_URL,
            json=webhook_payload,
            timeout=90
        )
        
        print(f"📥 Langflow status: {langflow_response.status_code}")
        
        # Parse webhook response
        langflow_data = langflow_response.json()
        print(f"Langflow response: {langflow_data}")
        
        # Extract cleaned text from webhook response
        cleaned_text = messy_text  # fallback
        
        # Webhook responses are usually simpler
        if isinstance(langflow_data, dict):
            # Try different response structures
            cleaned_text = (
                langflow_data.get('output') or 
                langflow_data.get('result') or 
                langflow_data.get('text') or 
                langflow_data.get('message') or
                messy_text
            )
            
            # If it's nested
            if isinstance(cleaned_text, dict):
                cleaned_text = cleaned_text.get('text', messy_text)
        
        elif isinstance(langflow_data, str):
            cleaned_text = langflow_data
        
        print(f"✅ Returning {len(cleaned_text)} characters")
        
        return jsonify({
            'success': True,
            'text': cleaned_text,
            'raw_ocr': messy_text
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/upload-textbook', methods=['POST'])
def upload_textbook():
    """Handle textbook/PYQ upload (same process)"""
    return upload_handwritten()


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'ocr_service': OCR_URL,
        'langflow_webhook': LANGFLOW_URL
    })


if __name__ == '__main__':
    print("Starting Langflow Bridge on port 8000...")
    print(f"OCR Service: {OCR_URL}")
    print(f"Langflow Webhook: {LANGFLOW_URL}")
    app.run(host='0.0.0.0', port=8000, debug=True)