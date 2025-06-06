# Multi-stage build for production optimization
FROM python:3.11-slim as backend

WORKDIR /app/backend

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Expose port
EXPOSE 8001

# Start command
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]