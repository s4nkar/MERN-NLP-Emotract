# 🧠 MERN-NLP-Emotract  
### Emotionally Intelligent Chat Application with Deep Learning, Real-Time Communication, and Scalable Architecture

**MERN-NLP-Emotract** is a full-stack, research-driven chat application that explores the intersection of **emotion detection**, **real-time communication**, and **deep learning**. This project forms part of an academic research paper focused on enhancing online communication using **Natural Language Processing (NLP)** and **affective computing**.

---

## 📰 Research Focus

This system demonstrates how advanced NLP models and classical machine learning algorithms can be integrated into a modern communication platform to detect and track **emotions**, **hate speech**, and **offensive language** in real-time conversations. It explores the design, training, and deployment of emotion-aware AI systems in a scalable, production-grade chat application.

---

## 📊 Datasets Used

This research leverages three high-quality, publicly available datasets:

1. **[Hate Speech and Offensive Language Dataset](https://www.kaggle.com/datasets/mrmorj/hate-speech-and-offensive-language-dataset)**  
   *Andrii Samoshyn, 2020* – Annotated text data for detecting hate speech and offensive content.

2. **[GoEmotions](https://www.kaggle.com/datasets/debarshichanda/goemotions)**  
   *Debarshi Chanda, 2021* – Google’s fine-grained emotion dataset containing 27 emotion labels.

3. **[Emotions Dataset](https://www.kaggle.com/datasets/bhavikjikadara/emotions-dataset)**  
   *Bhavik Jikadara, 2024* – Short text segments labeled with primary emotions.

---

## 🚀 Features

- Real-time chat with **WebSockets (Socket.IO)**
- Emotion-aware messaging powered by **BERT**, **RoBERTa**, and classical ML models
- Scalable backend APIs with **FastAPI** and **Express.js**
- Caching and session handling using **Redis**
- Scheduled background tasks with **node-cron**
- Fully containerized with **Docker**
- Secure authentication with **JWT**
- Responsive frontend built with **React (JS & TS)** and **Tailwind CSS**

---

## 🔧 Technologies Used

### ⚙️ Backend and NLP
- **FastAPI** – High-performance API for model inference
- **Node.js + Express.js** – Backend services and route handling
- **Redis** – In-memory caching and session management
- **Socket.IO** – Real-time, bidirectional communication

### 🤖 NLP & Deep Learning
- **BERT** – Bidirectional language model for emotion classification
- **RoBERTa** – Enhanced BERT variant for improved sentiment analysis
- **Logistic Regression, Random Forest** – Classical ML baselines

### 🌐 Frontend
- **React (JS/TS)** – Dynamic, component-based user interface
- **Tailwind CSS** – Utility-first CSS for clean and responsive UI

### 🐳 Infrastructure & Tools
- **MongoDB** – NoSQL database for user and message data
- **Docker** – Containerized deployment for portability
- **node-cron** – Scheduled background tasks (e.g., message processing)
- **JWT** – Token-based authentication
- **dotenv, Winston** – Configuration and structured logging

---

## ⚡ Key Features

- 🧠 Emotion-aware chat: Classifies user input in real-time
- 🔍 Hate speech & offensive content detection
- 📊 Emotion analytics for user conversations
- 🌐 Fully containerized with **Docker Compose**
- 🔐 Secure login, signup, and session management

---

## 📦 Getting Started

Clone the project and start via Docker:

```bash
git clone https://github.com/s4nkar/MERN-NLP-Emotract
cd mern-nlp-emotract
docker-compose up --build
