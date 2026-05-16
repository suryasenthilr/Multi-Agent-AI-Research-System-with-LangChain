# Multi-Agent Research System

A full-stack multi-agent AI research system that autonomously performs web searches, webpage scraping, and detailed report generation, complete with real-time feedback via a modern React frontend.

Built using **LangChain**, **Mistral AI**, **Tavily Search**, **FastAPI** on the backend, and **React + Vite** on the frontend.

---

## 🌟 Features

* **Multi-agent research pipeline**: Specialized agents for searching, reading, synthesizing, and critiquing.
* **Real-time Streaming**: See the research progress in real-time on the frontend using Server-Sent Events (SSE).
* **Tavily-powered web search**: Find recent and highly relevant information.
* **Modern Web UI**: A sleek, premium dark-mode interface built with React and Vite.
* **Automated report generation**: Synthesizes collected data into a structured Markdown report.
* **AI critique system**: Automatically reviews generated reports to ensure quality.

---

## 🏗️ System Architecture

The application is split into a robust FastAPI backend and a fast React frontend.

### The Agent Pipeline

```text
User Query
    ↓
Search Agent (Finds reliable sources via Tavily)
    ↓
Reader Agent (Scrapes and extracts content via BeautifulSoup)
    ↓
Writer Chain (Synthesizes research into a report)
    ↓
Critic Chain (Reviews and refines the report)
    ↓
Final Research Output (Streamed to Frontend)
```

---

## 🛠️ Technologies Used

### Backend
* **Python 3**
* **FastAPI** (REST API & SSE Streaming)
* **LangChain** (Agent orchestration)
* **Mistral AI** (LLM provider)
* **Tavily API** (Search engine)
* **BeautifulSoup** (Web scraping)

### Frontend
* **React 19**
* **Vite** (Build tool)
* **React Markdown** (Rendering output)
* **Modern CSS** (Premium dark mode UI)

---

## 📂 Project Structure

```text
Multi-Agent-System/
│
├── backend/                  # Python FastAPI Backend
│   ├── agents.py             # Agent definitions (Search, Reader)
│   ├── pipeline.py           # The LangChain research pipeline
│   ├── server.py             # FastAPI server and SSE endpoints
│   └── tools.py              # Custom tools for agents
│
├── frontend/                 # React Frontend
│   ├── src/                  # React components and logic
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
│
├── .env                      # Environment variables
├── requirements.txt          # Python dependencies
└── README.md                 # Project documentation
```

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/multi-agent-research-system.git
cd multi-agent-research-system
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
TAVILY_API_KEY=your_tavily_api_key
MISTRAL_API_KEY=your_mistral_api_key
```

### 3. Backend Setup

Create and activate a virtual environment, then install dependencies:

**Windows:**
```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

**macOS/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Run the FastAPI backend:
```bash
# Ensure you are running this from the project root
python -m backend.server
```
*The backend will run on `http://localhost:8000`*

### 4. Frontend Setup

Open a new terminal window, navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`*

---

## 💡 Example Research Topics

Try searching for these topics in the UI:
* *Impact of AI on Healthcare*
* *Future of Quantum Computing*
* *State Space Models in AI*
* *Recent breakthroughs in solid-state batteries*

---

## 👤 Author

Surya S
