# DeepText Insights

A containerized web application that analyzes text using machine learning models like Vectara, Education, and DeepSeek output. Built with FastAPI (backend), Next.js (frontend), MySQL (database), and Docker for easy deployment.

---

## 🚀 Features

- Analyze text for hallucination, toxicity, emotion, gibberish, and education relevance.
- View analysis history with graphs and tables.
- REST API to interact with machine learning models.
- Fully containerized using Docker and orchestrated with Docker Compose.

---

## 🗂️ Project Structure

```graphql
deeptext-insights/
├── backend/              # FastAPI backend
├── frontend/             # Next.js frontend
├── database/             # SQL initialization script
├── docker-compose.yml    # Docker Compose configuration
├── .env                  # Environment variables
└── README.md             # Documentation
```

---

## ⚙️ Prerequisites

- Docker & Docker Compose installed
- Node.js (for local frontend development, optional)
- Python 3.11 (for local backend development, optional)

---

## 🐳 Build and Run with Docker

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-repo/deeptext-insights.git
cd deeptext-insights
```

### 2️⃣ Build and Run Containers

```bash
docker-compose build
docker-compose up -d
```

### 3️⃣ Access the App

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

### 4️⃣ Stopping the App

```bash
docker-compose down
```

---

## 🌐 API Endpoints

### Analyze Text

- **POST** `/api/v1/analyze`
- **Request Body:**

  ```json
  {
    "text": "I like you. I love you"
  }
  ```

- **Response:**

  ```json
  {
    "vectara": 0.816,
    "education": 0.437,
    "deepseek_analysis": {
      "toxicity": 0.000,
      "emotion": { "love": 0.955 },
      "gibberish": { "clean": 0.873 }
    },
    "timestamp": "2025-02-03T12:34:56Z"
  }
  ```

### Get Analysis History

- **GET** `/api/v1/history`
- **Response:**

  ```json
  [
    {
      "id": 1,
      "text": "I like you. I love you",
      "vectara": 0.816,
      "education": 0.437,
      "timestamp": "2025-02-03T12:34:56Z"
    }
  ]
  ```

### Health Check

- **GET** `/api/v1/health`
- **Response:** `{ "status": "healthy" }`

---

## 🛠️ Environment Variables

Create a `.env` file:

```env
# Database
DB_HOST=db
DB_PORT=3306
DB_NAME=text_analysis
DB_USER=user
DB_PASSWORD=userpassword

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📊 Database Initialization

MySQL schema is initialized automatically using `database/init.sql`:

```sql
CREATE DATABASE IF NOT EXISTS text_analysis;

USE text_analysis;

CREATE TABLE IF NOT EXISTS analysis_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text TEXT NOT NULL,
  vectara FLOAT,
  education FLOAT,
  deepseek_analysis JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ✅ Testing

### Check Running Containers:

```bash
docker ps
```

### Logs:

```bash
docker-compose logs -f
```

### API Testing with Curl:

```bash
curl -X POST http://localhost:8000/api/v1/analyze -H "Content-Type: application/json" -d '{"text": "Hello World"}'
```

---

## 📦 Deployment Notes

- The app is cloud-ready and can be deployed to AWS, GCP, Azure, or any container-supported environment.
- Ensure environment variables are configured appropriately for production.

---

## 💡 Future Improvements

- Add user authentication
- Support for more ML models
- Real-time data updates with WebSockets

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Your Name - [GitHub](https://github.com/your-profile) | [LinkedIn](https://linkedin.com/in/your-profile)
