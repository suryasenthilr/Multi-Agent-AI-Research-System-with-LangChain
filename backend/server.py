from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel
import json

from backend.pipeline import run_research_pipeline
from backend.database import init_db, save_report, get_all_reports, get_report_by_id

app = FastAPI(title="Research AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

class ResearchRequest(BaseModel):
    topic: str

@app.get("/api/research")
async def research_stream(topic: str):
    async def event_generator():
        try:
            async for update in run_research_pipeline(topic):
                if update.get("status") == "completed":
                    state = update.get("result", {})
                    save_report(topic, state.get("report", ""), state.get("feedback", ""))
                
                yield {
                    "event": "message",
                    "data": json.dumps(update)
                }
        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({"error": str(e)})
            }
            
    return EventSourceResponse(event_generator())

@app.get("/api/reports")
async def list_reports():
    return get_all_reports()

@app.get("/api/reports/{report_id}")
async def get_report(report_id: int):
    report = get_report_by_id(report_id)
    if report:
        return report
    return {"error": "Report not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.server:app", host="0.0.0.0", port=8000, reload=True)
