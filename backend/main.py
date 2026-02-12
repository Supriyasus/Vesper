from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import requests
import cohere
import os
import google.generativeai as genai
from enum import Enum
import fitz
from typing import List
import re
import tempfile
import logging
from dotenv import load_dotenv

# --------------------------------------------------
# ENV
# --------------------------------------------------
if os.getenv("RENDER") is None:
    load_dotenv()

COHERE_API_KEY = os.getenv("COHERE_API_KEY")
HF_API_KEY = os.getenv("HF_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

co = cohere.Client(COHERE_API_KEY) if COHERE_API_KEY else None

# --------------------------------------------------
# APP
# --------------------------------------------------
app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    frontend_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(dict.fromkeys(allowed_origins)),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

logging.basicConfig(level=logging.INFO)

# --------------------------------------------------
# MODELS
# --------------------------------------------------
class Query(BaseModel):
    query: str


class Mode(str, Enum):
    debug = "debug"
    complete = "complete"
    explain = "explain"


class CodexQuery(BaseModel):
    mode: Mode
    query: str


class LiteReviewQuery(BaseModel):
    query: str


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok"}


# --------------------------------------------------
# GENERATE TEXT
# --------------------------------------------------
@app.post("/generate_text/")
def generate_text(query: Query):
    try:
        if not GOOGLE_API_KEY:
            raise HTTPException(500, "Google API key missing")

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(query.query)
        return JSONResponse({"response": response.text.strip()})

    except Exception:
        logging.exception("Gemini Error")
        raise HTTPException(status_code=500, detail="Generation failed")


# --------------------------------------------------
# HUMANIZER
# --------------------------------------------------
@app.post("/humanize-text/")
def humanize_text(query: Query):

    if not co:
        raise HTTPException(500, "Cohere API key not configured")

    try:
        prompt = f"""
Rewrite the following text so it reads like it was written by a human. Keep the original meaning and all technical information intact, but make the tone smoother, more natural, and more engaging. Avoid robotic phrasing. The rewritten version should sound professional, authentic, and easy to read — as if written by a skilled human writer.

Original Text:
{query.query}

Humanized Version:
"""

        response = co.generate(
            model="command-light",
            prompt=prompt,
            max_tokens=250,
            temperature=0.6,
            k=0,
            p=0.9,
            stop_sequences=["--"]
        )

        return JSONResponse({"response": response.generations[0].text.strip()})

    except Exception:
        logging.exception("Humanizer failed")
        raise HTTPException(status_code=500, detail="Humanization failed")


# --------------------------------------------------
# CODEX
# --------------------------------------------------
@app.post("/codex/")
def codex_handler(data: CodexQuery):

    if not co:
        raise HTTPException(500, "Cohere API key not configured")

    try:
        mode = data.mode
        prompt_map = {
            "debug": f"Debug this code and explain the issue:\n{data.query}",
            "complete": f"Complete the following code:\n{data.query}",
            "explain": f"Explain what this code does in simple terms:\n{data.query}"
        }

        prompt = prompt_map[mode]

        response = co.generate(
            model="command-light",
            prompt=prompt,
            max_tokens=400
        )

        return JSONResponse({"response": response.generations[0].text.strip()})

    except Exception:
        logging.exception("Codex failed")
        raise HTTPException(status_code=500, detail="Codex processing failed")


# --------------------------------------------------
# PDF HELPERS
# --------------------------------------------------
def extract_sections(text: str) -> dict:
    sections = {}
    current_section = "Abstract"
    sections[current_section] = []

    for line in text.splitlines():
        if re.match(r"^\d+(\.\d+)*\s+[A-Z][A-Za-z\s]*$", line.strip()):
            current_section = line.strip()
            sections[current_section] = []
        else:
            sections[current_section].append(line.strip())

    return {k: " ".join(v).strip() for k, v in sections.items() if v}


# --------------------------------------------------
# PDF SUMMARIZER
# --------------------------------------------------
@app.post("/summarize-pdf/")
async def summarize_pdf_advanced(file: UploadFile = File(...), query: str = Form("")):

    if not co:
        raise HTTPException(500, "Cohere API key not configured")

    try:
        content = await file.read()

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(content)
            temp_path = tmp.name

        doc = fitz.open(temp_path)
        full_text = "\n".join(page.get_text() or "" for page in doc)
        doc.close()

        if not full_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract readable text from the PDF.")

        sections = extract_sections(full_text)

        all_summaries = []

        for title, section_text in sections.items():

            if not section_text.strip():
                continue

            if len(section_text.split()) > 1200:
                section_text = " ".join(section_text.split()[:1200])

            prompt = f"""
You are an intelligent summarization assistant for academic research papers.

You are given the **section titled**: "{title}"

Your job is to:
- Summarize this **entire section** clearly and concisely.
- Organize it into structured Markdown:
  - Begin with the **Section Title**.
  - Use relevant **subheadings** (e.g., Background, Methods, Findings, Insights).
  - List key points as **bullet points** or in short paragraphs.
- Expand on key ideas. Be detailed, but focused.
- Aim for a total length of **300–400 words**.
- Do NOT copy verbatim from the text.

### User Query:
{query.strip() or 'Summarize this section.'}

### Section Text:
{section_text}

Return only the clean, Markdown-formatted structured summary.
"""

            response = co.generate(
                model="command-light",
                prompt=prompt,
                max_tokens=600,
                temperature=0.6
            )

            if response.generations:
                summary = response.generations[0].text.strip()
                all_summaries.append(summary)

        if not all_summaries:
            raise HTTPException(status_code=422, detail="No content could be summarized.")

        final_output = "\n\n".join(all_summaries)

        return JSONResponse({"response": final_output})

    except Exception:
        logging.exception("Summarization Error")
        raise HTTPException(status_code=500, detail="Summarization failed")


# --------------------------------------------------
# SEMANTIC SEARCH
# --------------------------------------------------
@app.get("/semantic-search/")
def semantic_search(query: str):

    try:
        url = f"https://api.openalex.org/works?filter=title.search:{query}&per-page=8"
        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="OpenAlex API failed.")

        data = response.json()
        papers = []

        for item in data.get("results", []):
            authorships = item.get("authorships", [])
            authors = [auth.get("author", {}).get("display_name") for auth in authorships if auth.get("author")]
            authors = [a for a in authors if a] or ["Unknown"]

            papers.append({
                "title": item.get("title"),
                "authors": authors,
                "year": item.get("publication_year"),
                "link": item.get("id")
            })

        return JSONResponse({"papers": papers})

    except Exception:
        logging.exception("OpenAlex search failed")
        raise HTTPException(status_code=500, detail="Internal server error")


# --------------------------------------------------
# AUTO LIT REVIEW
# --------------------------------------------------
@app.post("/auto-lit-review/")
def auto_lit_review(data: LiteReviewQuery):

    if not co:
        raise HTTPException(500, "Cohere API key not configured")

    try:
        prompt = f"""
You are a literature review expert. Given the research query below, generate a concise, well-structured, and academic-style literature review by synthesizing insights from the top 3–5 most relevant papers.

### Instructions:
- Begin with a **short summary paragraph** that directly answers the query.
- Structure the literature review using the following **general thematic sections**:

  1. **Overview**
  2. **Methodologies and Approaches**
  3. **Key Findings and Contributions**
  4. **Datasets and Evaluation**
  5. **Comparative Analysis**
  6. **Challenges and Limitations**
  7. **Future Directions**

- For each section:
  - Summarize relevant insights across multiple papers.
  - Include citations in APA format (e.g., Ma et al., 2024).
  - Use bullet points where appropriate.
  - Keep the tone academic but readable.

- List each referenced paper under the appropriate section (if relevant) using:
  - Title or short topic
  - Year
  - One-sentence key contribution

### Formatting Guidelines:
- Use **Markdown syntax** (## for section titles, ** for emphasis, - for bullets).
- Keep paragraphs concise and organized.
- Do not copy from real papers — simulate a realistic, human-like synthesis.

### Research Query:
"{data.query}"

Respond only with clean, formatted Markdown. Do not include extra commentary.
"""

        response = co.generate(
            model="command-light",
            prompt=prompt.strip(),
            max_tokens=700
        )

        return JSONResponse({"response": response.generations[0].text.strip()})

    except Exception:
        logging.exception("Lit review failed")
        raise HTTPException(status_code=500, detail="Failed to generate literature review")


# --------------------------------------------------
# ROOT
# --------------------------------------------------
@app.get("/")
def root():
    return {"message": "Backend with APIs is active."}
