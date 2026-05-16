from langchain.tools import tool
import requests
from bs4 import BeautifulSoup
from tavily import TavilyClient
import os
from rich import print

from dotenv import load_dotenv
load_dotenv()

tavily = TavilyClient(api_key= os.getenv("TAVILY_API_KEY"))
@tool
def web_search(query:str)->str:
    """Search the web for recent and reliable information on a topic. Returns Titles,URL and snippets"""
    results = tavily.search(query= query,max_results=5)
    out = []
    for r in results["results"]:
        out.append(
            f"Title: {r['title']}\nURL: {r['url']}\nSnippet: {r['content'][:300]}\n"
        )

    return "\n---\n".join(out)


from langchain.tools import tool
import requests
from bs4 import BeautifulSoup


@tool
def scrape_url(url: str) -> str:
    """
    Extract and clean text content from a webpage URL for deeper learning.
    """

    try:

        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        response = requests.get(
            url,
            headers=headers,
            timeout=10
        )

        if response.status_code != 200:
            return f"Failed to access URL: {url}"

        soup = BeautifulSoup(
            response.text,
            "html.parser"
        )

        # Remove unnecessary tags
        for tag in soup([
            "script",
            "style",
            "noscript",
            "header",
            "footer",
            "nav",
            "aside"
        ]):
            tag.decompose()

        # Extract visible text
        text = soup.get_text(separator=" ")

        # Clean whitespace
        cleaned_text = " ".join(text.split())

        # Limit size for LLMs
        cleaned_text = cleaned_text[:3000]

        return cleaned_text

    except Exception as e:

        return f"Error extracting webpage: {str(e)}"
    
