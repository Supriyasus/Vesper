from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import cohere
from dotenv import load_dotenv
import os
import google.generativeai as genai
from enum import Enum
from fastapi import File, UploadFile, Form
import fitz  
from typing import List
import re

# Load environment variables
load_dotenv()
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
HF_API_KEY = os.getenv("HF_API_KEY")

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Cohere client
co = cohere.Client(COHERE_API_KEY)

# Pydantic model
class Query(BaseModel):
    query: str


@app.post("/generate_text/")
def generate_text(query: Query):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(query.query)
        return {"response": response.text.strip()}
    except Exception as e:
        print("Gemini Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


class Query(BaseModel):
    query: str

@app.post("/humanize-text/")
def humanize_text(query: Query):
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
        return {"response": response.generations[0].text.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class Mode(str, Enum):
    debug = "debug"
    complete = "complete"
    explain = "explain"

class CodexQuery(BaseModel):
    mode: Mode
    query: str

@app.post("/codex/")
def codex_handler(data: CodexQuery):
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
        return {"response": response.generations[0].text.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def chunk_text(text: str, max_words: int = 350, stride: int = 200) -> List[str]:
    words = text.split()
    return [
        " ".join(words[i:i + max_words])
        for i in range(0, len(words), stride)
        if i + max_words <= len(words) or i == 0
    ]

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

@app.post("/summarize-pdf/")
async def summarize_pdf_advanced(file: UploadFile = File(...), query: str = Form("")):
    try:
        # Step 1: Save and extract text from PDF
        content = await file.read()
        with open("temp.pdf", "wb") as f:
            f.write(content)

        doc = fitz.open("temp.pdf")
        full_text = "\n".join(page.get_text() or "" for page in doc)
        doc.close()

        if not full_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract readable text from the PDF.")

        # Step 2: Extract sections from text
        sections = extract_sections(full_text)
        print(f"Extracted {len(sections)} sections")

        all_summaries = []
        for title, section_text in sections.items():
            # Skip empty or overly long sections
            if not section_text.strip():
                continue
            if len(section_text.split()) > 800:
                section_text = " ".join(section_text.split()[:800])  # truncate

            print(f"Summarizing section: {title} ({len(section_text.split())} words)")

            prompt = f"""
You are an intelligent summarization assistant for academic research papers.

You are given the **section titled**: "{title}"

Your job is to:
- Summarize this **entire section** clearly and concisely.
- Organize it into structured Markdown:
  - Begin with the **Section Title**.
  - Use relevant **subheadings** (e.g., Background, Methods, Findings, Insights).
  - List key points as **bullet points**.
- Maintain a crisp academic style (~150–250 words total).
- Do NOT copy verbatim from the text.
- Incorporate the user query context if applicable.

### User Query:
{query.strip() or 'Summarize this section.'}

### Section Text:
{section_text}

Return only the clean, Markdown-formatted structured summary.
"""

            response = co.generate(
                model="command-light",
                prompt=prompt,
                max_tokens=300,
                temperature=0.6
            )

            if not response.generations or not response.generations[0].text:
                continue

            summary = response.generations[0].text.strip()
            all_summaries.append(summary)

        if not all_summaries:
            raise HTTPException(status_code=422, detail="No content could be summarized.")

        final_output = "\n\n".join(all_summaries)
        return {"response": final_output}

    except Exception as e:
        print("Summarization Error:", str(e))
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")

@app.get("/semantic-search/")
def semantic_search(query: str):
    try:
        url = f"https://api.openalex.org/works?filter=title.search:{query}&per-page=8"
        print("Fetching:", url)
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            papers = []
            for item in data.get("results", []):
                # Handle missing or empty authors
                authorships = item.get("authorships", [])
                authors = [auth.get("author", {}).get("display_name") for auth in authorships if auth.get("author")]
                authors = [a for a in authors if a] or ["Unknown"]

                papers.append({
                    "title": item.get("title"),
                    "authors": authors,
                    "year": item.get("publication_year"),
                    "link": item.get("id")  # OpenAlex link
                })
            return {"papers": papers}
        else:
            raise HTTPException(status_code=response.status_code, detail="OpenAlex API failed.")
    except Exception as e:
        print("Error during OpenAlex search:", str(e))
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
class LiteReviewQuery(BaseModel):
    query: str

@app.post("/auto-lit-review/")
def auto_lit_review(data: LiteReviewQuery):
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

        return {"response": response.generations[0].text.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate literature review: {str(e)}")


@app.get("/")
def root():
    return {"message": "Backend with APIs is active."}
