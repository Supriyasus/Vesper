# AI Agent Project

## Overview
This project is an AI-powered application with a backend built using FastAPI and a frontend developed with React. It leverages advanced AI models and APIs to provide functionalities such as text generation, semantic search, and PDF summarization.

## Features
- **Text Generation**: Generate text using Cohere and Google's generative AI models.
- **Semantic Search**: Perform semantic searches using integrated APIs.
- **PDF Summarization**: Extract and summarize content from PDF files.
- **Code Assistance**: Offers advanced AI functionalities for code-related tasks.
- **Text Enhancement**: Enhances text by making it more human-like and readable.
- **Automated Literature Review**: Automates the process of generating literature reviews based on user input.
- **Interactive Frontend**: A user-friendly React-based interface.

## Technologies Used
### Backend
- **FastAPI**: For building the API.
- **Cohere API**: For text generation.
- **Google Generative AI**: For advanced AI capabilities.
- **PyMuPDF**: For PDF processing.
- **Pydantic**: For data validation.
- **Requests**: For HTTP requests.
- **dotenv**: For environment variable management.

### Frontend
- **React**: For building the user interface.
- **CSS**: For styling.

## Installation
### Backend
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/Vesper.git
   cd AI_agent/backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the backend server:
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Usage
1. Open the frontend in your browser at `http://localhost:3000`.
2. Interact with the application to generate text, perform semantic searches, or summarize PDFs.

## Tabs Overview

### Home
- Provides an introduction to the application and its features.

### Generate
- Allows users to generate text using AI models like Cohere and Google's generative AI.

### AutoLitReview
- Automates the process of generating literature reviews based on user input.

### PdfSummarizer
- Extracts and summarizes content from uploaded PDF files.

### Codex
- Offers advanced AI functionalities for code-related tasks.

### Humanizer
- Enhances text by making it more human-like and readable.

### About
- Displays information about the application and its purpose.

## Contributing
Feel free to contribute to this project by submitting issues or pull requests.

## License
This project is licensed under the MIT License.

