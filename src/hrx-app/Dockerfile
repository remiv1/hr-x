FROM node:18 AS builder
WORKDIR /build
COPY package.json ./
COPY scss ./scss
RUN npm install --no-audit --no-fund && npm run build-css

FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# copy app source
COPY . /app
# copy compiled css from builder
COPY --from=builder /build/static/css /app/static/css

EXPOSE 5000
ENV FLASK_ENV=production
CMD ["python", "main.py"]
