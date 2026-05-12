# Multi-Agent Research System

A multi-agent AI research system that autonomously performs:

* web search
* URL extraction
* webpage scraping
* report generation
* critique and feedback

Built using LangChain, Mistral AI, Tavily Search, BeautifulSoup, and Streamlit.

---

## Features

* Multi-agent research pipeline
* Tavily-powered web search
* URL preservation and extraction
* Webpage scraping using BeautifulSoup
* Automated report generation
* AI critic/review system
* Streamlit research dashboard
* Modular agent architecture

---

## System Architecture

```text id="jlwm133"
User Query
    ↓
Search Agent
    ↓
Reader Agent
    ↓
Writer Chain
    ↓
Critic Chain
    ↓
Final Research Output
```

---

## Agents

### Search Agent

Finds recent and reliable information while preserving URLs for future scraping.

### Reader Agent

Selects relevant URLs and extracts detailed webpage content.

### Writer Chain

Synthesizes all collected research into a structured report.

### Critic Chain

Reviews the generated report and provides feedback for improvement.

---

## Technologies Used

* Python
* LangChain
* Mistral AI
* Tavily API
* BeautifulSoup
* Streamlit
* Requests

---

## Project Structure

```text id="jlwm134"
Multi-Agent-System/
│
├── app.py
├── pipeline.py
├── agents.py
├── tools.py
├── prompts.py
├── requirements.txt
├── .gitignore
└── .env
```

---

## Installation

Clone the repository:

```bash id="’wini8a"
git clone https://github.com/YOUR_USERNAME/multi-agent-research-system.git
```

Move into the project folder:

```bash id="’wini8v"
cd multi-agent-research-system
```

Create virtual environment:

```bash id="’wini9f"
python -m venv .venv
```

Activate virtual environment:

### Windows

```bash id="’wini9w"
.venv\Scripts\activate
```

Install dependencies:

```bash id="’winiaf"
pip install -r requirements.txt
```

---

## Environment Variables

Create a `.env` file:

```env id="’winiaz"
TAVILY_API_KEY=your_api_key
MISTRAL_API_KEY=your_api_key
```

---

## Running the Application

### Streamlit UI

```bash id="’winibk"
streamlit run app.py
```

---

## Example Research Topics

* Impact of AI on Healthcare
* Future of Quantum Computing
* Impact of War on Stock Markets
* Applications of Nanotechnology in Medicine
* State Space Models in AI

---

## Deployment

The application can be deployed using:

* Streamlit Community Cloud
* Render
* Railway

---

## Author

Surya S
