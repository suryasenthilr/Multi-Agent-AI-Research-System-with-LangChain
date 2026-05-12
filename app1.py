# app.py

import streamlit as st
from pipeline import run_research_pipeline


# ---------------- PAGE CONFIG ----------------

st.set_page_config(
    page_title="ResearchFlow",
    page_icon="🧠",
    layout="wide"
)


# ---------------- CUSTOM CSS ----------------

st.markdown("""
<style>

    .stApp {
        background-color: #050816;
        color: white;
    }

    section[data-testid="stSidebar"] {
        background-color: #0B0F19;
        border-right: 1px solid #1E293B;
    }

    .main-title {
        font-size: 48px;
        font-weight: 700;
        color: white;
        margin-bottom: 10px;
    }

    .subtitle {
        color: #94A3B8;
        font-size: 18px;
        margin-bottom: 35px;
    }

    .agent-card {
        background-color: #0B1220;
        border: 1px solid #1E293B;
        border-radius: 18px;
        padding: 22px;
        height: 180px;
        transition: 0.3s;
    }

    .agent-card:hover {
        border: 1px solid #3B82F6;
    }

    .agent-label {
        font-size: 12px;
        letter-spacing: 2px;
        color: #64748B;
        margin-bottom: 18px;
        font-weight: 600;
    }

    .agent-title {
        font-size: 24px;
        font-weight: 600;
        color: white;
        margin-bottom: 12px;
    }

    .agent-desc {
        color: #94A3B8;
        font-size: 15px;
        line-height: 1.6;
    }

    .search-box {
        margin-top: 30px;
        margin-bottom: 40px;
    }

    .stTextInput > div > div > input {
        background-color: #0B1220;
        color: white;
        border: 1px solid #1E293B;
        border-radius: 12px;
        padding: 16px;
        font-size: 16px;
    }

    .stButton > button {
        background-color: #4F9CF9;
        color: white;
        border-radius: 12px;
        border: none;
        height: 55px;
        width: 100%;
        font-size: 18px;
        font-weight: 600;
    }

    .stButton > button:hover {
        background-color: #3B82F6;
    }

    .result-box {
        background-color: #0B1220;
        border: 1px solid #1E293B;
        border-radius: 16px;
        padding: 25px;
        margin-top: 20px;
    }

    hr {
        border-color: #1E293B;
    }

</style>
""", unsafe_allow_html=True)


# ---------------- SIDEBAR ----------------

st.sidebar.markdown("""
<div style="padding-top:20px;">

<h1 style="color:white;">ResearchFlow</h1>

<p style="color:#64748B; letter-spacing:3px; font-size:12px;">
MULTI-AGENT SYSTEM
</p>

<br>
<br>

</div>
""", unsafe_allow_html=True)


sidebar_agents = [
    ("🔎", "Search Agent", "Web search & URL extraction"),
    ("🌐", "Reader Agent", "URL scraping & deep content"),
    ("✍️", "Writer Chain", "Report drafting from research"),
    ("🧠", "Critic Chain", "Review, gaps & accuracy check")
]

for icon, title, desc in sidebar_agents:

    st.sidebar.markdown(f"""
    <div style="
        background:#0B1220;
        border:1px solid #1E293B;
        border-radius:14px;
        padding:18px;
        margin-bottom:16px;
    ">

    <div style="
        color:white;
        font-size:18px;
        font-weight:600;
    ">
    {icon} {title}
    </div>

    <div style="
        color:#64748B;
        font-size:14px;
        margin-top:8px;
    ">
    {desc}
    </div>

    </div>
    """, unsafe_allow_html=True)


# ---------------- HEADER ----------------

st.markdown("""
<div class="main-title">
ResearchFlow
</div>

<div class="subtitle">
Autonomous pipeline — search → scrape → write → critique.
</div>
""", unsafe_allow_html=True)


st.markdown("<hr>", unsafe_allow_html=True)


# ---------------- SEARCH BAR ----------------

col1, col2 = st.columns([5, 1])

with col1:
    topic = st.text_input(
        "",
        placeholder="e.g. Transformer architecture in computer vision"
    )

with col2:
    st.markdown("<br>", unsafe_allow_html=True)
    run_button = st.button("Run →")


# ---------------- AGENT CARDS ----------------

st.markdown("<br>", unsafe_allow_html=True)

c1, c2, c3, c4 = st.columns(4)

cards = [
    ("AGENT 01", "Search Agent",
     "Finds recent, reliable sources and preserves URLs."),

    ("AGENT 02", "Reader Agent",
     "Picks the best URL and scrapes it for depth."),

    ("CHAIN 03", "Writer Chain",
     "Synthesizes all data into a structured report."),

    ("CHAIN 04", "Critic Chain",
     "Reviews the report for gaps and accuracy.")
]

for col, card in zip([c1, c2, c3, c4], cards):

    with col:

        st.markdown(f"""
        <div class="agent-card">

            <div class="agent-label">
                {card[0]}
            </div>

            <div class="agent-title">
                {card[1]}
            </div>

            <div class="agent-desc">
                {card[2]}
            </div>

        </div>
        """, unsafe_allow_html=True)


# ---------------- RUN PIPELINE ----------------

if run_button and topic:

    with st.spinner("Running research pipeline..."):

        state = run_research_pipeline(topic)

    st.markdown("<br><br>", unsafe_allow_html=True)

    # SEARCH RESULTS

    st.markdown("""
    <div class="result-box">
    <h2>🔎 Search Results</h2>
    </div>
    """, unsafe_allow_html=True)

    st.write(state["search_result"])


    # SCRAPED CONTENT

    st.markdown("""
    <div class="result-box">
    <h2>🌐 Scraped Content</h2>
    </div>
    """, unsafe_allow_html=True)

    st.write(state["scrapped_content"])


    # REPORT

    st.markdown("""
    <div class="result-box">
    <h2>✍️ Final Report</h2>
    </div>
    """, unsafe_allow_html=True)

    st.markdown(state["report"])


    # FEEDBACK

    st.markdown("""
    <div class="result-box">
    <h2>🧠 Critic Feedback</h2>
    </div>
    """, unsafe_allow_html=True)

    st.markdown(state["feedback"])