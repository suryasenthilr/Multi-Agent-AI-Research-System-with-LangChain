# app.py

import streamlit as st
from pipeline import run_research_pipeline


# ---------------- PAGE CONFIG ----------------

st.set_page_config(
    page_title="Multi Agent Research System",
    layout="wide"
)


# ---------------- SIDEBAR ----------------

st.sidebar.title("◈ System Info")

st.sidebar.markdown("""
### Agents Used
- ⌕ Search Agent
- ◉ Reader Agent
- ✦ Writer Chain
- ◎ Critic Chain

### Features
- Web Search
- URL Extraction
- Web Scraping
- Research Report Generation
- Critic Feedback
""")


# ---------------- HEADER ----------------

st.title("◈ Multi-Agent Research System")

st.markdown("""
Research any topic using:
- intelligent search agents
- webpage scraping
- automated report writing
- AI critique and feedback
""")


# ---------------- INPUT ----------------

topic = st.text_input(
    "Enter Research Topic",
    placeholder="Example: Impact of AI on Healthcare"
)


# ---------------- BUTTON ----------------

run_button = st.button("Run Research Pipeline")


# ---------------- RUN PIPELINE ----------------

if run_button and topic:

    with st.spinner("Running Multi-Agent Pipeline..."):

        state = run_research_pipeline(topic)

    # ---------- SEARCH AGENT ----------

    st.divider()
    st.subheader("⌕ Step 1 — Search Agent")

    search_placeholder = st.empty()
    search_placeholder.success("Search completed")

    with st.expander("View Search Results", expanded=False):
        st.write(state["search_result"])


    # ---------- READER AGENT ----------

    st.divider()
    st.subheader("◉ Step 2 — Reader Agent")

    st.success("Web scraping completed")

    with st.expander("View Scraped Content", expanded=False):
        st.write(state["scrapped_content"])


    # ---------- WRITER AGENT ----------

    st.divider()
    st.subheader("✦ Step 3 — Writer Chain")

    st.success("Research report generated")

    st.markdown(state["report"])


    # ---------- CRITIC AGENT ----------

    st.divider()
    st.subheader("◎ Step 4 — Critic Chain")

    st.success("Critic feedback generated")

    st.markdown(state["feedback"])


# ---------------- FOOTER ----------------

st.divider()

st.caption("Built with LangChain + Tavily + Streamlit")