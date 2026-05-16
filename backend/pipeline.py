import asyncio
from backend.agents import build_reader_agent,build_search_agent,writer_prompt,writer_chain,critic_chain

async def run_research_pipeline(topic:str):
    state = {}

    yield {"step": "Search agent is working...", "status": "running"}

    search_agent = build_search_agent()
    search_result = await asyncio.to_thread(search_agent.invoke, {
        "messages":[("user",f"find recent,reliable and detailed information about {topic} and preserve the url so that they can be scrapped for future use")]
    })

    state["search_result"] = search_result["messages"][-1].content
    yield {"step": "Search completed.", "data": state['search_result'], "status": "running"}

    yield {"step": "Reader agent is scraping top resources...", "status": "running"}

    reader_agent = build_reader_agent()
    reader_result = await asyncio.to_thread(reader_agent.invoke, {
        "messages": [("user",
            f"Based on the following search results about '{topic}', "
            f"pick the most relevant URL and scrape it for deeper content.\n\n"
            f"Search Results:\n{state['search_result'][:800]}"
        )]
    })

    state['scrapped_content'] = reader_result["messages"][-1].content
    yield {"step": "Scraping completed.", "data": state['scrapped_content'], "status": "running"}

    yield {"step": "Writer is drafting the report...", "status": "running"}

    research_combined = (
        f"search results: \n{state['search_result']}\n\n"
        f"detailed scrapped content:\n{state['scrapped_content']}"
    )

    state["report"] = await asyncio.to_thread(writer_chain.invoke, {
        "topic":topic,
        "research":research_combined
    })
    
    yield {"step": "Drafting completed.", "data": state['report'], "status": "running"}

    yield {"step": "Critic is reviewing the report...", "status": "running"}

    state["feedback"] = await asyncio.to_thread(critic_chain.invoke, {
        "report":state["report"]
    })

    yield {"step": "Review completed.", "data": state['feedback'], "status": "running"}

    yield {"step": "Done", "status": "completed", "result": state}

if __name__ == "__main__":
    import asyncio
    async def main():
        topic = input("\n Enter a research topic : ")
        async for update in run_research_pipeline(topic):
            print(update)
    asyncio.run(main())
