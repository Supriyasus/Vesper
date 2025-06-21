# Vesper – AI-Powered Research & Writing Toolkit

## Overview
Vesper is an AI-powered platform designed for researchers, students, and creators to refine, humanize, and interact with content and code. It supports tasks like PDF summarization, code debugging, text generation, and literature review — all via a clean, React-based interface backed by FastAPI.

## Key Features
- Text Generation using Cohere and Google's Generative AI
- PDF Summarization with section-wise analysis
- Semantic Search powered by OpenAlex
- Code Assistance for debugging, explaining, and completing code
- Text Humanization for smoother and more natural phrasing
- Automated Literature Reviews for academic research

## Technologies
- **Backend**: FastAPI, Cohere API, Google Generative AI, PyMuPDF
- **Frontend**: React, Axios, CSS Modules

## How to Run the Project

### Run Locally
#### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Access the website at:
   ```
   http://localhost:3000
   ```

### Run with Docker
1. Ensure Docker is installed and running.
2. Navigate to the project directory:
   ```bash
   cd AI_agent
   ```
3. Build and start the containers:
   ```bash
   docker-compose up -d --build
   ```
4. Access the website:
   - Frontend: `http://localhost:3000`
   - Backend API Docs: `http://localhost:8000/docs`

## Deployment
- **Frontend**: Deploy on platforms like Vercel.
- **Backend**: Deploy on platforms like Render.
- Set `REACT_APP_BACKEND_URL` in the `.env` file to point to your backend URL.

## Contributing
Feel free to contribute to this project by submitting issues or pull requests.

