# Deep Research AI

An autonomous AI platform that analyzes the web to compile comprehensive research reports. 

Built using **LangChain**, **Mistral AI**, **Tavily Search**, **FastAPI** with SQLite on the backend, and **React + Vite** for a modern, sleek frontend.

---

## 🌟 Features

* **Multi-agent research pipeline**: Specialized agents for searching, reading, synthesizing, and critiquing.
* **Real-time Streaming**: Watch the AI agents at work in real-time on the frontend using Server-Sent Events (SSE).
* **Tavily-powered web search**: Scours the internet to find recent and highly relevant information on any topic.
* **Persistent History & Database**: Automatically saves your generated reports to a local SQLite database (`reports.db`).
* **Sleek UI & Collapsible Sidebar**: A premium dark-mode interface with a collapsible sidebar that allows you to search and load past conversations instantly.
* **AI critique system**: Automatically reviews generated reports to ensure quality and depth.

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
Final Research Output (Saved to SQLite & Streamed to Frontend)
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
* **SQLite** (Local Database for persisting reports)

### Frontend
* **React 19**
* **Vite** (Build tool)
* **React Markdown** (Rendering output)
* **Modern CSS** (Premium dark mode UI with glassmorphism)

---

## 📂 Project Structure

```text
Multi-Agent-System/
│
├── backend/                  # Python FastAPI Backend
│   ├── agents.py             # Agent definitions (Search, Reader)
│   ├── database.py           # SQLite database schema and helper functions
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

Try asking the AI about these topics:
* *The future of solid-state batteries in EVs*
* *How do quantum computers break encryption?*
* *Latest breakthroughs in fusion energy*
* *State Space Models in modern AI*
