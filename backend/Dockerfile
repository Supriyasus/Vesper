FROM python:3.11-slim
WORKDIR /app

COPY requirements.txt ./
RUN pip install --default-timeout=100 -r requirements.txt

COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EXPOSE 8000
